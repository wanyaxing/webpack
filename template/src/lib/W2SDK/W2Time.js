const W2Time = {
    // 获得时间的时间戳
    getTimestamp:function(pTime=null) {
        if (!pTime || pTime=='time()') {
            pTime = parseInt((new Date()).getTime()/1000);
        }
        var time = null;
        if (parseInt(pTime) == pTime)
        {
            time = parseInt(pTime);
        }
        else if (typeof pTime==='string')
        {
            var tmp_datetime = pTime.replace(/[: ]/g,'-');
            tmp_datetime = tmp_datetime.replace(/ /g,'-');
            var arr = tmp_datetime.split("-");
            if (/\d\d\d\d-\d+-\d+ \d+:\d+:\d+/.test(pTime))
            {
                var now = Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]);
                time = parseInt(now/1000);
            }
            else if (/\d\d\d\d-\d+-\d+/.test(pTime))
            {
                var now = Date.UTC(arr[0],arr[1]-1,arr[2],0,0,0);
                time = parseInt(now/1000);
            }
        }
        else if (pTime instanceof Date)
        {
            time = parseInt(pTime.getTime()/1000);
        }
        return time;
    },
    // 将时间转成指定格式
    timetostr:function(pTime=null,pFormat='yyyy-MM-dd hh:mm:ss'){
        var time = this.getTimestamp(pTime);
        var date = new Date(time * 1000);
        var o =
        {
        "M+" : date.getMonth()+1, //month
        "d+" : date.getDate(), //day
        "h+" : date.getHours(), //hour
        "m+" : date.getMinutes(), //minute
        "s+" : date.getSeconds(), //second
        "q+" : Math.floor((date.getMonth()+3)/3), //quarter
        "S" : date.getMilliseconds() //millisecond
        }
        if(/(y+)/.test(pFormat))
        {
            pFormat = pFormat.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }

        for(var k in o)
        {
            if(new RegExp("("+ k +")").test(pFormat))
            {
                pFormat = pFormat.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return pFormat;
    },
    // 将字符串转成时间戳  yyyy-MM-dd hh:mm:ss
    strtotime:function(pTime=null)
    {
        return this.getTimestamp(pTime);
    },
    // 将时间转成Date类型
    timetodate:function(pTime=null)
    {
        var time = this.getTimestamp(pTime);
        return new Date(time * 1000);
    },
    // 取得两个时间（字符串或时间戳）之间的时间差距（秒）,负数 说明前者在后者之前。
    getTimeBetweenDateTime:function($pTime=null,$pTime2=null)
    {
        return this.getTimestamp($pTime) - this.getTimestamp($pTime2) ;
    },
    // 给时间增加或减少秒数，或 +1 day +1 month -1 year
    getTimeAdded:function(pTime=null,pAdd=0)
    {
        if (parseInt(pAdd) == pAdd)
        {
            return this.getTimestamp(pTime) + pAdd;
        }
        else if (/([\+\-])(\d+) (day|month|year)/.test(pAdd))
        {
            var cross = pAdd.replace(/([\+\-])(\d+) (day|month|year)/,'$1')=='-'?-1:1;
            var step = parseInt(pAdd.replace(/([\+\-])(\d+) (day|month|year)/,'$2'));
            var type = pAdd.replace(/([\+\-])(\d+) (day|month|year)/,'$3');
            var date = this.timetodate(pTime);
            switch(type)
            {
                case 'day':
                    date.setDate(date.getDate() + step * cross);
                    break;
                case 'month':
                    date.setMonth(date.getMonth() + step * cross);
                    break;
                case 'year':
                    date.setFullYear(date.getFullYear() + step * cross);
                    break;
            }
            return this.getTimestamp(date);
        }
        return this.getTimestamp(pTime);
    },

    /** 获得参数里的最小时间 */
    getMinTime()
    {
        var min = null;
        for (var i = 0; i < arguments.length ; i++) {
            var curTime = this.strtotime(arguments[i]);
            if (i==0 || curTime<min)
            {
                min = curTime;
            }
        }
        return min;
    },
    /** 获得参数里的最大时间 */
    getMaxTime()
    {
        var min = null;
        for (var i = 0; i < arguments.length ; i++) {
            var curTime = this.strtotime(arguments[i]);
            if (i==0 || curTime>min)
            {
                min = curTime;
            }
        }
        return min;
    },
    /**
     * 获得指定时间所在当月的第一天的日期 yyyy-MM-dd
     * @param  [type] pTime [description]
     * @return string             格式 yyyy-MM-dd
     */
    getFirstDayInSameMonth:function(pTime=null)
    {
        return this.timetostr(pTime,'yyyy-MM-1');
    },

    /**
     * 获得指定时间所在当月的最后一天的日期 yyyy-MM-dd
     * @param  [type] pTime [description]
     * @return string             格式 yyyy-MM-dd
     */
    getLastDayInSameMonth:function(pTime=null)
    {
        return this.timetostr((this.getTimeAdded(pTime,'+1 month') - 1),'yyyy-MM-dd');
    },

    /** 指定日期的下个月的第一天 */
    getFirstDayInNextMonth:function(pTime=null)
    {
        return this.timetostr(this.getTimeAdded(pTime,'+1 month') ,'yyyy-MM-1');
    },

    /** 指定日期的下个月的最后一天 */
    getLastDayInNextMonth:function(pTime=null)
    {
        return this.getLastDayInSameMonth(this.getTimeAdded(pTime,'+1 month'));
    },

    /** 指定日期的上个月的第一天 */
    getFirstDayInPrevMonth:function(pTime=null)
    {
        return this.timetostr(this.getTimeAdded(pTime,'-1 month') ,'yyyy-MM-1');
    },

    /** 指定日期的上个月的最后一天 */
    getLastDayInPrevMonth:function(pTime=null)
    {
        return this.getLastDayInSameMonth(this.getTimeAdded(pTime,'-1 month'));
    },
    /**
     * 获得指定时间所在当年的第一天的日期 yyyy-MM-dd
     * @param  [type] pTime [description]
     * @return string             格式 yyyy-MM-dd
     */
    getFirstDayInSameYear:function(pTime=null)
    {
        return this.timetostr(pTime,'yyyy-1-1');
    },

    /**
     * 获得指定时间所在当年的最后一天的日期 yyyy-MM-dd
     * @param  [type] pTime [description]
     * @return string             格式 yyyy-MM-dd
     */
    getLastDayInSameYear:function(pTime=null)
    {
        return this.getLastDayInSameMonth(this.timetostr(pTime,'yyyy-12-1'));
    },

    /**
     * 获得指定时间所在当周的第一天(星期一)的日期 yyyy-MM-dd
     * @param  [type] pTime [description]
     * @return string             格式 yyyy-MM-dd
     */
    getFirstDayInSameWeek:function(pTime=null)
    {
        var date = this.timetodate(pTime);
        var week = date.getDay();
        week = (week==0?7:week);
        return this.timetostr((this.getTimeAdded(this.timetostr(pTime,'yyyy-MM-dd'),'-'+((week-1))+' day')),'yyyy-MM-dd');
    },

    /**
     * 获得指定时间所在当周的最后一天(星期日)的日期 yyyy-MM-dd
     * @param  [type] pTime [description]
     * @return string             格式 yyyy-MM-dd
     */
    getLastDayInSameWeek:function(pTime=null)
    {
        var date = this.timetodate(pTime);
        var week = date.getDay();
        week = (week==0?7:week);
        return this.timetostr((this.getTimeAdded(this.timetostr(pTime,'yyyy-MM-dd'),'+'+(7-($w-1))+' day'))-1,'yyyy-MM-dd');
    },

    /**
     * 获得指定时间所在当季的第一天的日期 yyyy-MM-dd
     * @param  [type] pTime [description]
     * @return string             格式 yyyy-MM-dd
     */
    getFirstDayInSameQuarter:function(pTime=null)
    {
        var date = this.timetodate(pTime);
        date.setMonth(parseInt(date.getMonth()/3)*3+1-1);
        return this.timetostr(date,'yyyy-MM-1');
    },
    /**
     * 获得指定时间所在当季的第一天的日期 yyyy-MM-dd
     * @param  [type] pTime [description]
     * @return string             格式 yyyy-MM-dd
     */
    getLastDayInSameQuarter:function(pTime=null)
    {
        var date = this.timetodate(pTime);
        date.setMonth((parseInt(date.getMonth()/3)+1)*3-1);
        return this.timetostr(date,'yyyy-MM-1');
    },


}


export default {
    install: function(Vue) {
        Object.defineProperty(Vue.prototype, '$W2Time', { value: W2Time });
    }
}
