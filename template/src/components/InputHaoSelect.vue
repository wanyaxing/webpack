<template>
    <span class="input_hao_select" @click="actionSelect" ref="inputSelectNode">
        <span class="ios_select_value">{{text}}</span>
    </span>
</template>

<script>
import IosSelect from 'iosselect/merge/iosSelect.js'
import 'iosselect/merge/iosSelect.css'
import '@/lib/iosSelect/iosSelectPlus.css'

export default {
    name: 'InputHaoSelect',
    components:{
    },
    props:{
        'value':{type:String},
        'placeholder':{type:String},
        'urlParam'  : {type:String},//接口地址
        'params'    : {type:Object},//接口请求的筛选参数
        'labelKey'  : {type:String},//数据中，选项文字对应的字段的字段名，通常为name或title等
        'valueKey'  : {type:String},//数据中，选项值对应的字段的字段名，通常为id或uuid等
        'disabled'  : {type:Boolean},//是否禁用
    },
    data(){
        console.log('InputHaoSelect.vue.data()');
        return {
            options:[],
        }
    },
    computed:{
        placeholderText(){
            return this.placeholder?this.placeholder:'请选择';
        },
        text(){
            let text = this.placeholderText;
            if (this.value)
            {
                this.options.forEach(item=>{
                    if (item.id==this.value){
                        text = item.value;
                    }
                })
            }
            return text;
        }
    },
    methods:{
        loadContent:function(){
            this.loading = true;
            var query = Object.assign({},this.params);
            this.$haoconnect.get(this.urlParam,query).then(hResult=>{
                var names           = hResult.search('.*?\\d>'+this.labelKey);
                var ids          = hResult.search('.*?\\d>'+this.valueKey);
                var arr = [];
                var selectOption = null;
                for (var i = 0; i < this.options.length; i++) {
                    if (this.id == this.options[i].id)
                    {
                        selectOption = this.options[i];
                    }
                }
                if (names.length > 0 && names.length == ids.length)
                {
                    for (var i in names)
                    {
                        var id = ids[i];
                        var name = names[i];

                        if (name == null){name = ""+id;}
                        if (id ==  this.id && this.id != '' && selectOption)
                        {
                            selectOption.value = name;
                        }
                        else
                        {
                            arr.push({
                                            value: name,
                                            id: id,
                                        });
                        }
                    }
                }
                if (selectOption)
                {
                    arr.unshift(selectOption);
                }
                this.options = arr;
            }).catch(hResult=>{
                this.options = [];
            }).finally(hResult=>{
                this.loading = false;
            });
        },
        actionSelect:function(){
            if (this.disabled){
                return false;
            }
            var that = this;
            console.log(that.year,that.month,that.day);
            var iosSelect = new IosSelect(1,
                [this.options],
                {
                    title: this.placeholderText,
                    headerHeight: 87,
                    itemHeight: 70,
                    itemShowCount: 7,
                    oneLevelId: that.value,
                    callback: function (selectOneObj) {
                        that.$emit('input', selectOneObj.id);
                    }
            });
        }
    },
    // watch:{
    //     value:function(){
    //     }
    // },
    mounted:function(){
        this.loadContent();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
