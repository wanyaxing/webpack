<?php
/**
 * 222供前端ajax进行请求，将相应表单转化调用对应的HaoConnect接口。
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

//debug
// if ($_REQUEST['url_param']=='/customer/detail'){sleep(1);}

//接口安全校验
// 转化header头里key值为字母大写其他字母小写的key值，
$headers = getallheaders();
foreach ($headers as $key => $value) {
    $headers[ucfirst(strtolower($key))] = $value;
}
$tmpArr = [];
foreach ($_REQUEST as $key => $value) {
    $tmpArr[] = $key . '=' . $value;
}
if (isset($_COOKIE['Userid']))
{
    $tmpArr[] = 'Userid' . '=' . $_COOKIE['Userid'];
}
if (isset($headers['Haotime']))
{
    $tmpArr[] = 'Haotime' . '=' . $headers['Haotime'];
}

sort($tmpArr, SORT_STRING);//对数组进行自然排序
$tmpArrString = implode( $tmpArr );//将排序后的数组组合成字符串
$tmpArrMd5 = md5( $tmpArrString );//对这个字符串进行MD5加密，即可获得Signature
if (!isset($_REQUEST['content']) || !isset($headers['Haosign']) || !isset($headers['Haotime']) || $headers['Haosign']!=$tmpArrMd5 )//|| abs($headers['Haotime'] - time()) > 5*60
{
    echo json_encode(array(
                            'errorCode'  => -1,
                            'errorStr'   => '错误的调用方法，请联系管理员。',
                            'resultCount'=> 0,
                            'results'    => $_REQUEST,
                            'extraInfo'  => null
                        ));
    exit;
}

//配置禁用的接口
$disableParms = array('axapi/create_mhc_with_table_name','axapi/update_codes_of_hao_connect');//,'user/login'

//提取接口方法
$urlParam     = $_REQUEST['url_param'];
$urlParam     = strtolower(trim(trim($urlParam),'/'));
unset($_REQUEST['url_param']);
list($apiController,$apiAction) = explode('/',$urlParam);

//禁用过滤，因为驼峰和下划线都要兼容，所以这里想要过滤就得复杂一点。
$urlParamLower = strtolower( HaoUtility::camelCase($apiController.'/'.$apiAction) );
$isInDisable = false;
foreach ($disableParms as $dParm) {
    if ($urlParamLower == strtolower( HaoUtility::camelCase($dParm) ) )
    {
        $isInDisable = true;
        break;
    }
}
if (!isset($apiController,$apiAction) || $isInDisable)
{
    echo json_encode(array(
                            'errorCode'  => -1,
                            'errorStr'   => '不支持使用HaoAJAX转发该接口哦。',
                            'resultCount'=> 0,
                            'results'    => $_REQUEST,
                            'extraInfo'  => null
                        ));
    exit;
}

if (AXAPI_DEPLOY_STATUS==2 && (Utility::getHeaderValue('Referer')==null || strpos(Utility::getHeaderValue('Referer'),'http://'.$_SERVER['HTTP_HOST'].'/')!==0))
{
    echo json_encode(array(
                            'errorCode'  => -1,
                            'errorStr'   => '错误的调用方法，请联系管理员。',
                            'resultCount'=> 0,
                            'results'    => $_REQUEST,
                            'extraInfo'  => null
                        ));
    exit;
}

//调用对应接口方法
$content = '';
$params = json_decode($_REQUEST['content'],true);
if ($_SERVER['REQUEST_METHOD']=='GET')
{
    if (isset($_SERVER['HTTP_IF_NONE_MATCH']))
    {
        HaoConnect::$IF_NONE_MATCH = $_SERVER['HTTP_IF_NONE_MATCH'];
    }
    $ret = HaoConnect::loadContent($urlParam,$params,METHOD_GET,300,'all');
    $headarr= explode("\r\n", $ret['header']);
    foreach($headarr as $h){
        if(strlen($h)>0){
            if(strpos($h,'Content-Length')!==false) continue;
            if(strpos($h,'Transfer-Encoding')!==false) continue;
            if(strpos($h,'Connection')!==false) continue;
            if(strpos($h,'HTTP/1.1 100 Continue')!==false) continue;
            header($h);
        }
    }
    echo $ret['body'];
    exit;
}
else
{
    try {
        $method = new ReflectionMethod(HaoUtility::camelCase($apiController.'Connect'), HaoUtility::camelCase('request'.$apiAction));
        $result = $method->invoke(null,$params);
    } catch (Exception $e) {
        $method       = $_SERVER['REQUEST_METHOD'];
        $result = HaoConnect::request($urlParam,$params,$method);
    }

    if ($result->responseText)
    {
        echo $result->responseText;
    }
    else
    {
        echo json_encode($result->properties());
    }
}
