<?php

if ( strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false )
{
    if ( strpos($_SERVER['HTTP_USER_AGENT'], 'wxwork') !== false )
    {
        include AXAPI_ELO_PATH . '/login_in_wxwork.php';
    }
    else
    {
        include AXAPI_ELO_PATH . '/login_in_wechat.php';
    }
}
else if ( strpos($_SERVER['HTTP_USER_AGENT'], 'DingTalk') !== false )
{
    include AXAPI_ELO_PATH . '/login_in_dd.php';
}
else
{
    // print_r($_SERVER);
    // exit;
}
