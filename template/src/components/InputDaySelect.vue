<template>
    <span class="input_day_select" @click="dateSelect">
        {{value?value:placeholderText}}
    </span>
</template>

<script>
import IosSelect from 'iosselect/merge/iosSelect.js'
import 'iosselect/merge/iosSelect.css'
import '@/lib/iosSelect/iosSelectPlus.css'

export default {
    name: 'InputDaySelect',
    components:{
    },
    props:[
        'value',
        'placeholder',
        'maxDate',
        'minDate',
        'disabled',
    ],
    data(){
        console.log('InputDaySelect.vue.data()');
        return {
            iosSelectObj:null,
        }
    },
    computed:{
        currentDay(){
            if (this.value)
            {
                return this.value;
            }
            var now = new Date();
            return now.getFullYear()  +'-'+ (now.getMonth()+1) +'-' + (now.getDate());
        },
        year(){
            return parseInt(this.currentDay.replace(/(\d+)\-(\d+)-(\d+)/g,'$1'));
        },
        month(){
            return parseInt(this.currentDay.replace(/(\d+)\-(\d+)-(\d+)/g,'$2'));
        },
        day(){
            return parseInt(this.currentDay.replace(/(\d+)\-(\d+)-(\d+)/g,'$3'));
        },
        placeholderText(){
            return this.placeholder?this.placeholder:'请选择日期';
        },
        nowYear(){
            return (new Date()).getFullYear();
        },
        // 时间戳，单位毫秒（除以1000是秒）
        minTime(){
            if (this.minDate)
            {
                return this.getTimestamp(this.minDate);
            }
            return this.getTimestamp('1900-01-01');
        },
        maxTime(){
            if (this.maxDate)
            {
                return this.getTimestamp(this.maxDate);
            }
            return this.getTimestamp('2099-12-31');
        },
    },
    methods:{
        getTimestamp:function(pTime){
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
        isDateGreaterThanMinTime:function(year,month=12,day=31){
            return this.getTimestamp(year+'-'+month+'-'+day) >= this.minTime;
        },
        isDateLessThanMaxTime:function(year,month=1,day=1){
            return this.getTimestamp(year+'-'+month+'-'+day) <= this.maxTime;
        },
        isDateVaild:function(year,month,day){
            return this.isDateGreaterThanMinTime(year,month,day) && this.isDateLessThanMaxTime(year,month,day);
        },
        formatYear:function(nowYear) {
            var arr = [];
            for (var i = nowYear - 50; i <= nowYear + 10; i++) {
                if (!this.isDateVaild(i))
                {
                    continue;
                }
                arr.push({
                    id: i + '',
                    value: i + '年'
                });
            }
            console.log('formatYear',arr);
            return arr;
        },
        yearFunc:function(callback) {
            callback(this.formatYear(this.nowYear))
        },
        formatMonth (year) {
            console.log('formatMonth');
            var arr = [];
            for (var i = 1; i <= 12; i++) {
                if (!this.isDateVaild(year,i))
                {
                    continue;
                }
                arr.push({
                    id: i + '',
                    value: (i<10?'0':'') + i + '月'
                });
            }
            return arr;
        },
        monthFunc:function(year, callback){
            callback(this.formatMonth(year));
        },
        formatDate:function (year, month) {
            var count = 31;
            if (/^(1|3|5|7|8|10|12)$/.test(month)) {
                count = 31 ;
            }
            else if (/^(4|6|9|11)$/.test(month)) {
                count = 30 ;
            }
            else if (/^2$/.test(month)) {
                if (year % 4 === 0 && year % 100 !==0 || year % 400 === 0) {
                    count = 29 ;
                }
                else {
                    count = 28 ;
                }
            }
            var arr = [];
            for (var i = 1; i <= count; i++) {
                if (!this.isDateVaild(year,month,i))
                {
                    continue;
                }
                arr.push({
                    id: i + '',
                    value: (i<10?'0':'') + i + '日'
                });
            }
            return arr;
        },
        dateFunc: function (year, month, callback) {
            callback(this.formatDate(year, month));
        },
        dateSelect:function(){
            if (this.disabled==='' || this.disabled)
            {
                return false;
            }
            // 初始化时间
            var that = this;
            this.iosSelectObj = new IosSelect(3,
                [this.yearFunc, this.monthFunc, this.dateFunc],
                {
                    title: this.placeholderText,
                    headerHeight: 87,
                    itemHeight: 70,
                    itemShowCount: 7,
                    relation: [1, 1, 1, 1, 1],
                    oneLevelId: that.year,
                    twoLevelId: that.month,
                    threeLevelId: that.day,
                    callback: function (selectOneObj, selectTwoObj,selectThreeObj) {
                        that.$emit('input', selectOneObj.id + '-' + (selectTwoObj.id<10?'0':'') + selectTwoObj.id + '-' + (selectThreeObj.id<10?'0':'') + selectThreeObj.id );
                    }
            });
            console.log(this.iosSelectObj);
        }
    },
    watch:{

    },
    deactivated:function(){
        if (this.iosSelectObj && this.iosSelectObj.iosSelectLayer)
        {
            this.iosSelectObj.iosSelectLayer.close()
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
