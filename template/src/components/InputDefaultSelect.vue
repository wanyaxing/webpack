<template>
    <span class="input_default_select" @click="actionSelect" ref="inputSelectNode">
        <span style="display:none;">
            <slot></slot>
        </span>
        <span class="ios_select_value">\{{text}}</span>
    </span>
</template>

<script>
import IosSelect from 'iosselect/merge/iosSelect.js'
import 'iosselect/merge/iosSelect.css'
import '@/lib/iosSelect/iosSelectPlus.css'

export default {
    name: 'InputDefaultSelect',
    components:{
    },
    props:[
        'value',
        'placeholder',
    ],
    data(){
        console.log('InputDefaultSelect.vue.data()');
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
        actionSelect:function(){
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
    watch:{
        value:function(){
            let text = '';
        }
    },
    mounted:function(){
        console.log('InputDefaultSelect.vue.mounted',arguments);
        let arr = [];
        console.log('this.$refs',this.$refs);
        let optionNodes = this.$refs.inputSelectNode.querySelectorAll('option');
        [].forEach.call(optionNodes, function(oNode) {
            arr.push({
                id: oNode.value,
                value: oNode.text,
            });
        });
        this.options = arr;
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
