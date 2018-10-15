
function HaoObject()
{
}

// 有效值覆盖
// https://stackoverflow.com/a/37164538/9023348
HaoObject.isObject = function (item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
// 合并变化的值（忽略 null 值）
HaoObject.mergeChangedDeep = function (oldObj, newObj) {
    if (oldObj==null || Object.keys(oldObj).length==0)
    {//如果旧值为空对象，直接返回新值
        return newObj;
    }
    let output = Object.assign({}, oldObj);
    if (this.isObject(oldObj) && this.isObject(newObj)) {
        Object.keys(newObj).forEach(key => {
            if (oldObj.hasOwnProperty(key))
            {
                if (oldObj[key] != newObj[key])
                {
                    if (this.isObject(newObj[key]))
                    {
                        if (newObj[key] instanceof HaoObject)
                        {
                            output[key] = newObj[key];
                        }
                        else
                        {
                            output[key] = this.mergeChangedDeep(oldObj[key], newObj[key]);
                        }
                    }
                    else if (newObj[key]===null)
                    {
                        // 如果新值为null值则不覆盖旧值
                        // console.log(oldObj,newObj);
                    }
                    else
                    {
                        output[key] = newObj[key];
                    }
                }
            }
            else
            {
                output[key] = newObj[key];
            }
        });
    }
    return output;
}
// 判断新对象是否真的新
HaoObject.isChanged = function (oldObj, newObj) {
    if (oldObj && newObj && typeof oldObj === 'object' && typeof newObj === 'object') {
        for (let key in newObj)
        {
            if (oldObj.hasOwnProperty(key))
            {
                if (!HaoObject.isChanged(oldObj[key],newObj[key]))
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
    }
    else
    {
        return oldObj == newObj;
    }
    return true;
}

// 尝试更新数据（如无变化则不更新）
HaoObject.prototype.update = function(data)
{
    if (typeof(data) != 'object')
    {
        throw new Error('error: unvalid data');
        return null;
    }

    var isDifferent = false;
    for (let key in data)
    {
        if (typeof data[key]=='object' )
        {
            data[key] = HaoObject.instance(data[key]);
        }
    }

    var _newResults      = HaoObject.mergeChangedDeep(this,data);
    if ( !HaoObject.isChanged(this,_newResults) )
    {
        for (let key in _newResults)
        {
            this[key] = _newResults[key];
        }
    }

}


/** 根据路径取数据 */
HaoObject.prototype.find = function(path,defaultValue)
{
    path = path.trim();

    if (this.hasOwnProperty('modelType') && this['modelType']=='HaoResult' && path.indexOf('results') !== 0 && path.indexOf('extraInfo') !== 0 )
    {
        path = 'results>' + path;
    }
    if (path=='')
    {
        return this;
    }

    var paths = path.split('>');

    var changeValue = this;

    while (paths.length>0 && changeValue)
    {
        var keyItem = paths.shift();
        if (keyItem!='')
        {
            if (typeof changeValue[keyItem] != 'undefined')
            {
                changeValue = changeValue[keyItem];
            }
            else
            {
                changeValue = null;
            }
        }
        if (changeValue instanceof HaoObject)
        {
            changeValue = changeValue.find(paths.join('>'),defaultValue);
            break;
        }
    }

    if (defaultValue && (changeValue==null || changeValue=='') )
    {
        changeValue = defaultValue;
    }

    return changeValue;
}


/**
 * 根据path取值，如果不是数组，就转成数组
 * @param  string $path
 * @return array
 */
HaoObject.prototype.findAsList = function(path)
{
    var value = this.find(path);

    if (value==null)
    {
        value = [];
    }
    else if ( typeof(value)!=='object' || value instanceof HaoObject)
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
HaoObject.prototype.findAsString = function(path)
{
    value = this.find(path);

    if (typeof(value) != 'string')
    {
        value = value+"";
    }

    return value;
}


HaoObject.prototype.findAsFloat = function(path,defaultValue)
{
    return parseFloat(this.find(path,defaultValue));
}

/**
 * 根据path取值，如果不是数字，就转成数字
 * @param  string path
 * @return int
 */
HaoObject.prototype.findAsInt = function(path)
{
    value = this.find(path);

    if (typeof(value)!='number')
    {
        value = parseInt(value);
    }

    return value;
}

/**
 * 根据path取值，如果不是HaoObject类型，就转成HaoObject类型
 * @param  string path
 * @return HaoObject
 */
HaoObject.prototype.findAsResult = function(path)
{
    value = this.find(path);

    if (!(value instanceof HaoObject))
    {
        value = HaoObject.instance(value);
    }

    return value;
}

/*遍历路径*/
HaoObject.prototype.getKeyIndexArray = function(target)
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

/** 在结果中进行搜索，返回结果是数组（至少也是空数组） */
HaoObject.prototype.search = function(path)
{
    var searchIndex             = this.getKeyIndexArray( this.results );

    path = path.trim();

    var result = [];
    var reg = new RegExp('(^|\\s)(' + path + ')(|\\s+)','g');
    var _this = this;
    searchIndex.join("\n").replace(reg,function($0,$1,$2,$3){
        result.push(_this.find($2));
    });
    return result;
}

HaoObject.cache = {};

HaoObject.instance = function(data){
    if (data==null || typeof data != 'object' || data instanceof HaoObject)
    {
        return data;
    }
    if (data.hasOwnProperty('modelType'))
    {
        var cacheKey;
        var modelType = data['modelType'];
        if (typeof data['uuid'] != 'undefined')
        {
            cacheKey = modelType + '_' + data['uuid'];
        }
        else if (typeof data['id'] != 'undefined')
        {
            cacheKey = modelType + '_' + data['id'];
        }
        var obj;
        if (cacheKey && this.cache[cacheKey])
        {
            obj = this.cache[cacheKey];
        }
        else
        {
            obj = new HaoObject();
        }
        obj.update(data);
        if (cacheKey)
        {
            this.cache[cacheKey] = obj;
        }
        return obj;
    }
    else
    {
        for (var key in data)
        {
            if (typeof data[key]=='object')
            {
                data[key] = HaoObject.instance(data[key]);
            }
        }
        return data;
    }
}

HaoObject.dropCaches = function(){
    for (var cacheKey in this.cache) {
        if (this.cache[cacheKey] && this.cache[cacheKey].__ob__ && this.cache[cacheKey].__ob__.dep && this.cache[cacheKey].__ob__.dep.subs.length==0)
        {
            delete this.cache[cacheKey];
        }
    }
}

export default HaoObject;
