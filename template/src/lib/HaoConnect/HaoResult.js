import HaoObject from './HaoObject.js'

function HaoResult()
{
}

HaoResult.prototype = new HaoObject();

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

HaoResult.instance = function(data)
{
    var obj = new HaoResult();
    obj.update(data);
    return obj;
}


export default HaoResult;
