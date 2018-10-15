import axios from 'axios';
import qs from 'qs';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const browserMD5File = require('browser-md5-file');
const SparkMD5 = require('spark-md5');

import HaoObject from './HaoObject.js'
import HaoResult from './HaoResult.js'

const HaoConnect = {
    cache:{},
    pendingChange(step=1){
        if (!this._pendingChange)
        {
            this._pendingChange = 0;
        }
        this._pendingChange += step;
        if (this._pendingChange==1){
            NProgress.start();
        }
        else if (this._pendingChange==0){
            NProgress.done();
        }
    },
    getCookie:function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return (arr[2]);
        else
            return null;
    },
    dropCaches:function(){
        //尝试清除无用的缓存引用。
        HaoObject.dropCaches();
    },
    request:function(urlParam,  content={}, method='get'){
        var _this = this;

        var cache = [];
        var params = {
                        'url_param':urlParam,
                        'content':JSON.stringify(content, function(key, value) {
                                        if (typeof value === 'object' && value !== null) {
                                            if (cache.indexOf(value) !== -1) {
                                                // Circular reference found, discard key
                                                return;
                                            }
                                            // Store value in our collection
                                            cache.push(value);
                                        }
                                        return value;
                                    }),
                        };
        // return  axios.post('http://mobile4-jiyingshou.haoxitech.com/js/ajax_haoconnect.php',params);
        var crsftoken = '';
        var tmpArr = [];
        for (var i in params)
        {
            if (params[i]!==null && params[i]!==undefined)
            {
                tmpArr.push(i+'='+params[i]);
            }
        }
        var requestMD5;
        // 只有pending中的promise可以共用。
        if (method == 'get')
        {
            requestMD5 = SparkMD5.hash( tmpArr.join('') );
            if (_this.cache[requestMD5])
            {
                return _this.cache[requestMD5];
            }
        }

        if (_this.getCookie('Userid')>0)
        {
            tmpArr.push('Userid'+'='+_this.getCookie('Userid'));
        }
        var Haotime = parseInt(new Date().getTime() /1000);
        tmpArr.push('Haotime'+'='+Haotime);

        tmpArr = tmpArr.sort();
        var tmpArrString = tmpArr.join('');
        var tmpArrMd5 = SparkMD5.hash( tmpArrString );
        // console.log(tmpArrString,tmpArrMd5);
        let headers = {'X-Requested-With':'XMLHttpRequest','Haotime':Haotime,'Haosign':tmpArrMd5};
        HaoConnect.pendingChange(1);

        var CancelToken = axios.CancelToken;
        var source = CancelToken.source();


        var ret =  axios.request({
            method:method,
            url:'/ajax/ajax_haoconnect.php',
            // url:'http://mobile4-jiyingshou.haoxitech.com/js/ajax_haoconnect.php',
            params:method=='get'?params:null,
            data:method=='post'?qs.stringify(params):null,
            headers:headers,
            cancelToken: source.token,
            timeout: 300000,
        }).then(function(response){
            // 如果请求成功，则移除请求缓存，不再共用。
            // 也就是说只有请求中的缓存才能共用。
            if (requestMD5 && _this.cache[requestMD5])
            {
                delete _this.cache[requestMD5];
            }
            HaoConnect.pendingChange(-1);
            let hResult =  HaoResult.instance(response.data);
            if (hResult.isResultsOK())
            {
                return hResult;
            }
            else
            {
                return Promise.reject(hResult) ;
            }
        });

        ret.cancel = function(reson){
            source.cancel('Operation canceled by the user.');
            console.warn('HaoConnect.request canceled');
        }

        // 同一请求最多保留30秒，通常用于并发请求的共用。
        if (method == 'get' && requestMD5)
        {
            _this.cache[requestMD5] = ret;
            setTimeout(function(){
                if (requestMD5 && _this.cache[requestMD5])
                {
                    delete _this.cache[requestMD5];
                }
            },30000);
        }
        return ret;
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
    uploadFileToQiniu:function(file,onProgress=null){
        HaoConnect.pendingChange(1);
        return new Promise( (resolve, reject)=>{
            browserMD5File(file,(err, md5)=>{
                let hconnect = this.post('qiniu/getUploadTokenForQiniu',{
                            'md5':md5,
                            'filesize':file.size,
                            'filetype':file.name.indexOf('.')>0?file.name.replace(/^.*\./g,''):'.tmp',
                }).then(hResult=>{
                    if (hResult.find('isFileExistInQiniu') && hResult.find('urlPreview'))
                    {
                        if (onProgress)
                        {
                            onProgress({loaded:100,total:100,percent:100});
                        }
                        HaoConnect.pendingChange(-1);
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
                        if (onProgress)
                        {
                            onProgress({loaded:1,total:100,percent:1});
                            config.onUploadProgress = function( progressEvent ) {
                                progressEvent.percent = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
                                if (progressEvent.percent<1)
                                {
                                    progressEvent.percent = 1;
                                }
                                onProgress(progressEvent) ;
                            }
                        }
                        return  axios.post('http://upload.qiniu.com/',param,config)
                                .then(response=>{
                                    HaoConnect.pendingChange(-1);
                                    return HaoResult.instance(response.data);
                                },function(){HaoConnect.pendingChange(-1);});
                    }
                },function(){HaoConnect.pendingChange(-1);});
                return resolve(hconnect);
            });
        });
    },
}

export default HaoConnect
