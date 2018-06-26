<?php
    if (!isset($_GET['corpid']))
    {
        echo '404';
        exit;
    }

    $ddConfigResult = HaoConnect::get('ddtalk/get_js_config',['corp_id'=>$_GET['corpid'],'url'=>W2Web::getCurrentUrl()]);
    if (!$ddConfigResult->isResultsOK())
    {
        Utility::exitMessage($ddConfigResult->errorStr);
        exit;
    }
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=414,user-scalable=0, target-densitydpi=device-dpi">
<title>登录中...</title>
<script type="text/javascript">var _config = <?= $ddConfigResult->find('jsConfig') ?></script>
<script type="text/javascript" src="https://g.alicdn.com/dingding/open-develop/1.6.9/dingtalk.js"></script>
<style type="text/css">
    body{
        margin: 0;
    }
    #home_container{
        width: 414px;
        margin:0 auto;
        word-break: break-all;
    }
</style>
</head>
<body>
<div id="home_container">
    登录中...
</div>
</body>
<script type="text/javascript">
dd.config({
    agentId: _config.agentId,
    corpId: _config.corpId,
    timeStamp: _config.timeStamp,
    nonceStr: _config.nonceStr,
    signature: _config.signature,
    jsApiList: [
        'runtime.info',
        'runtime.permission.requestAuthCode',
        'device.notification.prompt',
        'biz.chat.pickConversation',
        'device.notification.confirm',
        'device.notification.alert',
        'device.notification.prompt',
        'biz.chat.open',
        'biz.util.open',
        'biz.user.get',
        'biz.contact.choose',
        'biz.telephone.call',
        'biz.util.uploadImage',
        'biz.ding.post']
});

dd.userid=0;
dd.ready(function() {
    // alert('dd.ready rocks!');

    dd.runtime.info({
        onSuccess: function(info) {
            // alert('runtime info: ' + JSON.stringify(info));
        },
        onFail: function(err) {
            alert('fail: ' + JSON.stringify(err));
        }
    });

    dd.runtime.permission.requestAuthCode({
        corpId: _config.corpId,
        onSuccess: function(result) {
            // alert('onSuccess:'+JSON.stringify(result));
            if (result && result['code'])
            {
                window.location.href = window.location.href + '&code='+result['code'];
            }
        /*{
            code: 'hYLK98jkf0m' //string authCode
        }*/
        },
        onFail : function(err) {
            alert('onFail:'+JSON.stringify(err));
        }

    })
});

dd.error(function(error){
       /**
        {
           message:"错误信息",//message信息会展示出钉钉服务端生成签名使用的参数，请和您生成签名的参数作对比，找出错误的参数
           errorCode:"错误码"
        }
       **/
       alert('dd error: ' + JSON.stringify(error));
});
</script>
</html>
