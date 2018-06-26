<?php

    $uriState = 'mobile-jiyingshou-wechat';
    if (isset($_GET['openid']) && AXAPI_DEPLOY_STATUS==1)                              //测试环境支持，从参数里抓取openid
    {
        $openid = $_GET['openid'];                           //当前用户的openid
    }
    if (isset($_GET['code'],$_GET['state']) && $_GET['state']==$uriState )                           //或从参数里抓取code，一般是来自授权成功后的回调地址
    {
        $infoResult = HaoConnect::post('wechat/get_wx_user_info_of_code',array('code'=>$_GET['code']));
        if ($infoResult->isResultsOK())
        {
            $userWxResult = HaoConnect::get('wechat/get_wx_user_info_of_open_id',array('openid'=>$infoResult->find('openid')));
            // print_r($userWxResult);exit;
            // if ($userWxResult->isResultsOK() && $userWxResult->find('subscribe'))
            // {//只有关注用户才能给予登录。否则仍作为游客处理，后续会展示二维码页面。
                $openid = $infoResult->find('openid');
            // }
        }
        else
        {
            // if ($infoResult->find('results>errcode')==40029)
            // {

            // }
            // else
            // {
            //     $message = $infoResult->errorStr;
            //     include AXAPI_ELO_PATH .'/503.php';
            //     // var_dump($infoResult);
            //     exit;
            // }
        }
    }
    else if (!isset($openid))                                                     //如果获取不了用户数据，转向授权地址。
    {
        $redirect_uri = 'http://' .  $_SERVER['HTTP_HOST'] . preg_replace('/&(code|state)=[^&]*/','',$_SERVER['REQUEST_URI']) ;
        $uriResult = HaoConnect::post('wechat/get_url_for_wx_auth',array('redirect_uri'=>$redirect_uri,'scope'=>'snsapi_userinfo','state'=>$uriState));
        if ($uriResult->isResultsOK())
        {
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
        $currentUserResult = UserConnect::requestUnionLogin(array('union_token'=>$openid,'union_type'=>7));
        if (!$currentUserResult->isResultsOK())
        {
            // print_r($currentUserResult);
            Utility::exit503($currentUserResult->errorStr);
            exit;
        }

        //完善用户信息（通常是首次登陆）
        if (isset($infoResult) && $currentUserResult->find('username')==null )//&& $infoResult->find('avatar')!=null
        {
            $headimgurl = $infoResult->find('headimgurl');
            $headimgurlResult = HaoConnect::request('qiniu/fetch_url_to_qiniu',array('url'=>$headimgurl),METHOD_POST);
            if ($headimgurlResult->isResultsOK())
            {
                $headimgurl = $headimgurlResult->find('results>');
            }
            $currentUserResult = HaoConnect::post('user/update',array(
                                                                'id'=>$currentUserResult->find('id')
                                                                ,'username'=>$infoResult->find('nickname')
                                                                ,'avatar'=>$headimgurl
                                                                ));
        }

        //移除网址中的临时字段
        if (isset($_GET['code'],$_GET['state']) || isset($_GET['openid']) || isset($_GET['sharer']) )
        {
            header('location:'.'http://' .  $_SERVER['HTTP_HOST'] .  preg_replace('/(\?*)&*(code|state|sharer)=[^&]*/','$1',$_SERVER['REQUEST_URI'])  );
            exit;
        }
    }
