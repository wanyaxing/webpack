<?php
/**
 * 供前端ajax进行请求，将相应表单转化调用对应的HaoConnect接口。
 */
ini_set('display_errors',1);            //错误信息
ini_set('display_startup_errors',1);    //启动错误信息

error_reporting(-1);                    //打印出所有的 错误信息

date_default_timezone_set('Asia/Shanghai');//设定时区

define("AX_TIMER_START", microtime (true));//记录请求开始时间


    //加载配置文件
    require_once(__dir__.'/../../php/config.php');

    //加载HaoConnect核心类
    require_once(AXAPI_ROOT_PATH.'/lib/HaoConnect/HaoConnect.php');

    //加载基础方法
    require_once(AXAPI_ROOT_PATH.'/components/Utility.php');

$fileName = W2HttpRequest::getRequestString('file_name');

$result = HaoConnect::get('qiniu/get_private_url_of_key',['key'=>$fileName]);

header('location:'.$result->find('results>'),302);
