<?php
/**
* 基本配置
* @package conf
* @author axing
* @version 0.1
*/

define('AXAPI_ROOT_PATH', __dir__ );
define('AXAPI_ELO_PATH' , __dir__ );

if (!isset($_SERVER['HTTP_HOST']) || $_SERVER['HTTP_HOST'] == 'mobile-{{name}}.haoxitech.com')
{//1是开发模式  2是正式环境
    define('AXAPI_DEPLOY_STATUS', 1 );
}
else
{
    define('AXAPI_DEPLOY_STATUS', 2 );
}

//加载类 并注册自动加载事件。
require_once(AXAPI_ROOT_PATH.'/components/autoload.php');

/** API项目名（最好全网唯一）   */
define('AXAPI_PROJECT_NAME', '{{name}}' );
define('AXAPI_PROJECT_TITLE', '{{name}}' );

// 默认分页数据量
define('DEFAULT_PAGE_SIZE', 10);

// 高德地图  JavaScript API
// define('AMAP_WEBAPI_KEY', '8097249239d135cbf4c9c3d113f16310');

/** 建议：可以引入常量文件（该文件通常来自API的常量文件，两者在svn中做软连接） */
//include AXAPI_ROOT_PATH . '/constant.php';

