import axios from 'axios';
import qs from 'qs';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const browserMD5File = require('browser-md5-file');
const SparkMD5 = require('spark-md5');


const HaoResult = (function()
{
    /** 将数据初始化成对象 */
    function HaoResult(results,errorCode,errorStr,extraInfo)
    {
        var modelType = 'HaoResult';
        if (!errorCode && !errorStr && !extraInfo && typeof(results['errorCode'])!='undefined')
        {
            errorCode = results['errorCode'];
            errorStr  = results['errorStr'];
            extraInfo = results['extraInfo'];
            modelType = results['modelType'];
            results   = results['results'];
        }
                this.errorCode   = errorCode;
                this.errorStr    = errorStr;
                this.extraInfo   = extraInfo;
                this.results     = results;
                this.modelType   = modelType;

                this.pathCache   = {};
                this.searchIndexString   = null;
    }

    /** 根据路径取数据，默认是results中取，也可以指定extraInfo>路径下取数据。 */
    HaoResult.prototype.findValue = function(path,defaultValue)
    {
        // console.log('debug find:',path,this);
        path = path.trim();
        if (this.pathCache[path])
        {
            return this.pathCache[path];
        }
        if (!path)
        {
            console.log('warning: unvalid path.');
            return null;
        }

        if ( path.indexOf('results>') !== 0 && path.indexOf('extraInfo>') !== 0 )
        {
                path = 'results>' + path;
        }

        let paths = path.split('>');

        var changeValue = null;

        for (var index in paths)
        {
            var keyItem = paths[index];
            if (index==0)
            {
                if (keyItem=='extraInfo')
                {
                    changeValue = this.extraInfo;
                }
                else
                {
                    changeValue = this.results;
                }
            }
            else if (keyItem!='')
            {
                if (changeValue && typeof changeValue[keyItem]!='undefined')
                {
                    changeValue = changeValue[keyItem];
                    continue;
                }
                changeValue = null;
                break;
            }
        }

        this.pathCache[path] = changeValue;

        if (defaultValue && (changeValue==null || changeValue=='') )
        {
            changeValue = defaultValue;
        }
        return changeValue;

    }
    HaoResult.prototype.findAsFloat = function(path,defaultValue)
    {
        return parseFloat(this.findValue(path,defaultValue));
    }

    /** 根据路径取数据，默认是results中取，也可以指定extraInfo>路径下取数据。 */
    HaoResult.prototype.find = function(path,defaultValue)
    {
        let value = this.findValue(path,defaultValue);
        value = this.value(value);
        return value;
    }

    /** 传入值如果是model，则以当前Result为框架构建新Result，否则直接返回。 */
    HaoResult.prototype.value = function(value)
    {
        if (Array.isArray(value))
        {
            var array = [];
            for (var key in value)
            {
                var tmpValue = value[key];
                array.push(this.value(tmpValue));
            }
            return array;
        }
        else if (typeof(value) == 'object')
        {
            if (value!=null && value.modelType)
            {
                return new HaoResult(value, this.errorCode, this.errorStr, this.extraInfo);
            }
            else
            {
                return value;
            }
        }
        return value;
    }

    HaoResult.prototype.getKeyIndexArray = function(target)
    {
            var keyList = [];
            if (typeof(target) == 'object')
            {
                    for (var key in target) {
                            keyList.push(key + '');
                            var objc = target[key];
                            if (typeof(objc) == 'object') {
                                    var keyListTemp = this.getKeyIndexArray(objc);
                                    for (var j in keyListTemp)
                                    {
                                        keyList.push(key + ">" + keyListTemp[j]);
                                    }
                            }
                    }
            }
            return keyList;
    }


    /**
     * 根据path取值，如果不是数组，就转成数组
     * @param  string $path
     * @return array
     */
    HaoResult.prototype.findAsList = function(path)
    {
        var value = this.find(path);

        if ( typeof(value)!=='object' || value instanceof HaoResult)
        {
                value = [value];
        }

        return value;
    }

    /**
     * 根据path取值，如果不是字符串，就转成字符串
     * @param  string path
     * @return string
     */
    HaoResult.prototype.findAsString = function(path)
    {
        var    value = this.find(path);

        if (typeof(value) != 'string')
        {
                value = value+"";
        }

        return value;
    }


    /**
     * 根据path取值，如果不是数字，就转成数字
     * @param  string path
     * @return int
     */
    HaoResult.prototype.findAsInt = function(path)
    {
        var    value = this.find(path);

        if (typeof(value)!='number')
        {
                value = parseInt(value);
        }

        return value;
    }

    /**
     * 根据path取值，如果不是HaoResult类型，就转成HaoResult类型
     * @param  string path
     * @return HaoResult
     */
    HaoResult.prototype.findAsResult = function(path)
    {
        var    value = this.find(path);

        if (!(value instanceof HaoResult))
        {
                value = new HaoResult(value, this.errorCode, this.errorStr, this.extraInfo);
        }

        return value;
    }


    /** 在结果中进行搜索，返回结果是数组（至少也是空数组） */
    HaoResult.prototype.search = function(path)
    {
        if (this.searchIndexString == null)
        {
            var resultObjc = {};
            resultObjc['results']       = this.results;
            resultObjc['extraInfo']     = this.extraInfo;
                var searchIndex             = this.getKeyIndexArray( resultObjc );
                this.searchIndexString      = searchIndex.join("\n");
        }

        path = path.trim();

        if ( path.indexOf('results>') !== 0 && path.indexOf('extraInfo>') !== 0 )
        {
                path = 'results>' + path;
        }

        var result = [];
        var reg = new RegExp('(^|\\s)(' + path + ')(|\\s+)','g');
        var _this = this;
        this.searchIndexString.replace(reg,function($0,$1,$2,$3){
            result.push(_this.find($2));
        });
        return result;
    }

    /**  将属性results进行转化后输出。 通常用于列表页结果，可以用该方法一次性获得N个HaoResult组成的数组。 */
    HaoResult.prototype.results = function()
    {
            return this.find('results>');
    }

    /** 判断当前实例是否目标model */
    HaoResult.prototype.isModelType = function(modelType)
    {
            return modelType.toLowerCase() == this.modelType.toLowerCase();
    }

    /**
     * 判断是否等于目标ErroCode
     * @param  array  errorCode  目标errorCode
     * @return boolean            是否一致
     */
    HaoResult.prototype.isErrorCode = function(errorCode)
    {
            return this.errorCode === errorCode;
    }

    /**
     * 判断是否正确获得结果
     * @return boolean            是否正确获得
     */
    HaoResult.prototype.isResultsOK = function()
    {
            return this.isErrorCode(0) ;
    }

    /** 返回字典类型数据（重新包装成字典） */
    HaoResult.prototype.properties = function()
    {
            return {
                                    'errorCode'  : this.errorCode,
                                    'errorStr'   : this.errorStr,
                                    'extraInfo'  : this.extraInfo,
                                    'results'    : this.results
                    };
    }

    return HaoResult;
})();

// window.addEventListener('unhandledrejection', event =>
// {
//     console.log('unhandledrejection',event); // 打印"Hello, Fundebug!"
// });

const HaoConnect = {
    getCookie:function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return (arr[2]);
        else
            return null;
    },
    request:function(urlParam,  content={}, method='get'){
        let params = {
                        'url_param':urlParam,
                        'content':JSON.stringify(content),
                        };
        // return  axios.post('http://mobile4-jiyingshou.haoxitech.com/static/js/ajax_haoconnect.php',params);
        let crsftoken = '';
        var tmpArr = [];
        for (var i in params)
        {
            if (params[i]!==null && params[i]!==undefined)
            {
                tmpArr.push(i+'='+params[i]);
            }
        }
        if (this.getCookie('Userid')>0)
        {
            tmpArr.push('Userid'+'='+this.getCookie('Userid'));
        }
        var Haotime = parseInt(new Date().getTime() /1000);
        tmpArr.push('Haotime'+'='+Haotime);

        tmpArr = tmpArr.sort();
        var tmpArrString = tmpArr.join('');
        var tmpArrMd5 = SparkMD5.hash( tmpArrString );
        console.log(tmpArrString,tmpArrMd5);
        let headers = {'X-Requested-With':'XMLHttpRequest','Haotime':Haotime,'Haosign':tmpArrMd5};
        NProgress.start();
        return  axios.request({
            method:method,
            url:'/ajax/ajax_haoconnect.php',
            params:method=='get'?params:null,
            data:method=='post'?qs.stringify(params):null,
            headers:headers,
        }).then(function(response){
            NProgress.done();
            let hResult =  new HaoResult(response.data);
            if (hResult.isResultsOK())
            {
                return hResult;
            }
            else
            {
                return Promise.reject(hResult) ;
                // let pReject = Promise.reject(hResult) ;
                // console.log('pReject',pReject);
                // setTimeout(function(){
                //   pReject.then(function(){
                //     console.log('then',pReject);
                //   });
                //   console.log('pReject',pReject);
                // },1);
                // return pReject;
            }
        },()=>{NProgress.done();});
    },
    get:function(urlParam,  params={})
    {
        return this.request(urlParam,  params, 'get');
    },
    requestFirstInList:function(urlParam,  params={})
    {
        params['page']=1;
        params['size']=1;
        return this.get(urlParam,  params).then(hResult=>{
            console.log(hResult.find('results>'));
            if (hResult.find('results>') && hResult.find('results>').length>0)
            {
                return hResult.find('results>')[0];
            }
            else
            {
                return hResult;
            }
        });
    },
    post:function(urlParam,  params={})
    {
        return this.request(urlParam,  params, 'post');
    },
    uploadFileToQiniu:function(file,onPercent=null){
        NProgress.start();
        return new Promise( (resolve, reject)=>{
            browserMD5File(file,(err, md5)=>{
                let hconnect = this.post('qiniu/getUploadTokenForQiniu',{
                            'md5':md5,
                            'filesize':file.size,
                            'filetype':file.name.indexOf('.')>0?file.name.replace(/^.*\./g,''):'.tmp',
                }).then(hResult=>{
                    if (hResult.find('isFileExistInQiniu') && hResult.find('urlPreview'))
                    {
                        if (onPercent)
                        {
                            onPercent(100);
                        }
                        return hResult;
                    }
                    else
                    {
                        let param = new FormData(); //创建form对象
                        param.append('chunk','0');//断点传输
                        param.append('chunks','1');
                        param.append('file',file,file.name)
                        param.append('token',hResult.find('uploadToken'));
                        let config = {
                            headers:{'Content-Type':'multipart/form-data'},
                        };
                        if (onPercent)
                        {
                            onPercent(1);
                            config.onUploadProgress = function( progressEvent ) {
                                var percent = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
                                if (percent<1)
                                {
                                    percent = 1;
                                }
                                onPercent(percent) ;
                            }
                        }
                        return  axios.post('http://upload.qiniu.com/',param,config)
                                .then(response=>{
                                    return new HaoResult(response.data);
                                },()=>{NProgress.done();});
                    }
                });
                return resolve(hconnect);
            });
        });
    },
}

export default HaoConnect
