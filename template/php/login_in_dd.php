<?php

    if (isset($_GET['openid']) && AXAPI_DEPLOY_STATUS==1)                              //测试环境支持，从参数里抓取openid
    {
        $openid = $_GET['openid'];                           //当前用户的openid
    }
    else if (isset($_GET['corpid'],$_GET['code']))                           //或从参数里抓取code，一般是来自授权成功后的回调地址
    {
        $infoResult = HaoConnect::post('ddtalk/get_user_info',array('corp_id'=>$_GET['corpid'],'code'=>$_GET['code']));
        if ($infoResult->isResultsOK())
        {
            $openid = $_GET['corpid'] .'_' .$infoResult->find('userid');
        }
        else
        {
            if ($infoResult->find('results>errcode')==40029)
            {

            }
            else
            {
                $message = $infoResult->errorStr;
                include AXAPI_ELO_PATH .'/503.php';
                // var_dump($infoResult);
                exit;
            }
        }
    }
    if (!isset($openid))                                                     //如果获取不了用户数据，转向授权地址。
    {
        //此处实现jsAPI免登
        include AXAPI_ELO_PATH . '/oauth_uri_dd.php';
        exit;
    }

    if (isset($openid))
    {
        //第三方登录
        $currentUserResult = UserConnect::requestUnionLogin(array('union_token'=>$openid,'union_type'=>5));
        if (!$currentUserResult->isResultsOK())
        {
            var_export($currentUserResult);
            // Utility::exit503($currentUserResult->errorStr);
            exit;
        }

        //完善用户信息（通常是首次登陆）
        if (isset($infoResult) && $currentUserResult->find('username')==null )//&& $infoResult->find('avatar')!=null
        {
            // $headimgurl = $infoResult->find('avatar');
            // $headimgurlResult = HaoConnect::request('qiniu/fetch_url_to_qiniu',array('url'=>$headimgurl),METHOD_POST);
            // if ($headimgurlResult->isResultsOK())
            // {
            //     $headimgurl = $headimgurlResult->find('results>');
            // }
            $currentUserResult = HaoConnect::post('user/update',array(
                                                                'id'=>$currentUserResult->find('id')
                                                                ,'username'=>$infoResult->find('name')
                                                                ,'avatar'=>$infoResult->find('avatar')
                                                                ));
        }

        //移除网址中的临时字段
        if (isset($_GET['code'],$_GET['corpid']) || isset($_GET['openid']) || isset($_GET['sharer']) )
        {
            header('location:'.'http://' .  $_SERVER['HTTP_HOST'] .  preg_replace('/(\?*)&*(code|corpid|sharer)=[^&]*/','$1',$_SERVER['REQUEST_URI']) . (strpos($_SERVER['REQUEST_URI'],'?')!==false?'&':'?') .'sharer='.$currentUserResult->find('id'));
            exit;
        }
    }
