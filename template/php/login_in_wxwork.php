<?php

    $uriState = 'mobile-jiyingshou-wxwork';
    if (isset($_GET['openid']) && AXAPI_DEPLOY_STATUS==1)                              //测试环境支持，从参数里抓取openid
    {
        $openid = $_GET['openid'];                           //当前用户的openid
    }
    else if (isset($_GET['code'],$_GET['state']) && $_GET['state']==$uriState )                           //或从参数里抓取code，一般是来自授权成功后的回调地址
    {
        $infoResult = HaoConnect::post('wxwork/get_wx_user_info_of_code',array('code'=>$_GET['code']));
        if ($infoResult->isResultsOK())
        {
            $openid = $infoResult->find('corpid') .'_' .$infoResult->find('userid');
            if ($openid=='-')
            {
                $message = '无法获得您的用户身份，请稍后再试或联系管理员。';
                include AXAPI_ELO_PATH .'/503.php';
                exit;
            }
        }
        else
        {
            // if ($infoResult->find('results>errcode')==40029)
            // {

            // }
            // else
            // {
                $message = $infoResult->errorStr;
                include AXAPI_ELO_PATH .'/503.php';
                // var_dump($infoResult);
                exit;
            // }
        }
    }
    if (!isset($openid))                                                     //如果获取不了用户数据，转向授权地址。
    {
        $redirect_uri = 'http://' .  $_SERVER['HTTP_HOST'] . preg_replace('/&(code|state)=[^&]*/','',$_SERVER['REQUEST_URI']) ;
        $uriResult = HaoConnect::post('wxwork/get_url_for_wx_auth',array('redirect_uri'=>$redirect_uri,'scope'=>'snsapi_privateinfo','state'=>$uriState));
        if ($uriResult->isResultsOK())
        {
            // print_r('location:'.$uriResult->find('oauth_uri'));
            header('location:'.$uriResult->find('oauth_uri'));
            exit;
        }
        else
        {
            var_dump($uriResult);
            exit;
        }
    }

    if (isset($openid))
    {

        //第三方登录
        $currentUserResult = UserConnect::requestUnionLogin(array('union_token'=>$openid,'union_type'=>6));
        if (!$currentUserResult->isResultsOK())
        {
            // print_r($currentUserResult);
            Utility::exit503($currentUserResult->errorStr);
            exit;
        }

        //完善用户信息（通常是首次登陆）
        if (isset($infoResult) && $currentUserResult->find('username')==null )//&& $infoResult->find('avatar')!=null
        {
            $headimgurl = $infoResult->find('avatar');
            $headimgurlResult = HaoConnect::request('qiniu/fetch_url_to_qiniu',array('url'=>$headimgurl),METHOD_POST);
            if ($headimgurlResult->isResultsOK())
            {
                $headimgurl = $headimgurlResult->find('results>');
            }
            $currentUserResult = HaoConnect::post('user/update',array(
                                                                'id'=>$currentUserResult->find('id')
                                                                ,'username'=>$infoResult->find('name')
                                                                ,'avatar'=>$headimgurl
                                                                ));
        }

        // //完善推荐人信息
        // if ($currentUserResult->find('referrerUserID')==null && $sharerID>0 && $sharerID!=$currentUserResult->find('id'))
        // {
        //     HaoConnect::post('user/update',array(
        //             'id'=>$currentUserResult->find('id')
        //             ,'referrer_user_id'=>$sharerID
        //         ));
        // }

        // $userWxResult = HaoConnect::get('wechat/get_wx_user_info_of_open_id',array('openid'=>$openid));
        // if (!$userWxResult->isResultsOK())
        // {
        //     UserConnect::requestLogOut();
        //     // if ($userWxResult->isErrorCode(1034))
        //     // {
        //         if ($sharerID>0)
        //         {
        //             $sharerResult = HaoConnect::get('user/detail',array('id'=>$sharerID));
        //             if ($sharerResult->isResultsOK())
        //             {
        //                 $qrScene = HaoConnect::post('qr_scene/new_from_sharer',array(
        //                                                             'title'=>'您的好友 '.$sharerResult->find('accountLocal').' 向您推荐了一个好东东。'
        //                                                             ,'description'=>'赶快看看吧。'
        //                                                             // ,'pic_url'=>''
        //                                                             ,'url'=>'http://' .  $_SERVER['HTTP_HOST'] . $requestPath
        //                                                             ,'sharer'=>$sharerID
        //                                                         ));
        //                 $PAGE_QRCODE = $qrScene->find('sceneTicketLocal');
        //             }
        //         }
        //         include AXAPI_ELO_PATH . '/only_fans.php';
        //         exit;
        //     // }
        // }

        //移除网址中的临时字段
        if (isset($_GET['code'],$_GET['state']) || isset($_GET['openid']) || isset($_GET['sharer']) )
        {
            header('location:'.'http://' .  $_SERVER['HTTP_HOST'] .  preg_replace('/(\?*)&*(code|state|sharer)=[^&]*/','$1',$_SERVER['REQUEST_URI']) . (strpos($_SERVER['REQUEST_URI'],'?')!==false?'&':'?') .'sharer='.$currentUserResult->find('id'));
            exit;
        }
    }
