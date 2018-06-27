<template>
    <span class="search_input_bg"
          :class="{
                    search_blur_noword:!isSearchFoucs&&!keyword,
                    search_blur_word:!isSearchFoucs&&keyword,
                    search_foucs_noword:isSearchFoucs&&!(keyword || inputValue),
                    search_foucs_word:isSearchFoucs&&(keyword || inputValue),
                }"
    >
        <input class="input_keyword" type="text" v-model="keyword"
        v-on:input="inputValue = $event.target.value;"  @focus="isSearchFoucs=1" @blur="isSearchFoucs=0" ref="inputKeyword"/>
        <span class="tips_search">
            <img src="~@/assets/design/ys/hetong/seeks.png" />
            <span>搜索</span>
        </span>
        <div @click="clear" class="icon_clear">
            <img src="~@/assets/design/yf/jifapiao/close.png"/>
        </div>
        <span @click="clear" class="btn_cancel">取消</span>
    </span>
</template>

<script>

import debounce from 'lodash/debounce';


export default {
    name: 'SearchInput',
    props:[
        'value'
    ],
    data(){
        return {
            keyword       : '',
            inputValue    : '',
            isSearchFoucs : null,
        }
    },
    methods:{
        cancel:function(){
            this.$refs.inputKeyword.blur();
            // this.keyword = '';
        },
        clear:function(e){
            e.preventDefault();
            this.keyword='';
            return false;
        },
        emitValue:debounce(function(value){
            console.log(value);
            // this.$emit('update:keyword',this.keyword);
            this.$emit('input',value);
        },500),
    },
    watch:{
        value:function(){
            this.keyword = this.value;
        },
        keyword:function(value){
            if (this.keyword != this.value)
            {
                this.emitValue(this.keyword);
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.search_input_bg{
    width: 100%;
    padding-right: 20px;
    position: relative;
    display: inline-block;
    padding: 18px 30px;
}
.search_input_bg .tips_search{
    display: block;
    text-align: center;
    position: absolute;
    top: 26px;
    font-size: 26px;
    color:#9da1a3;
    pointer-events: none;
}
.search_input_bg .tips_search span{
    visibility: hidden;
}
.search_input_bg .icon_clear{
    position: absolute;
    top: 18px;
    right: 31px;
    display: none;
    padding: 8px;
    width: 40px;
    height: 56px;
}
.search_input_bg .input_keyword{
    width: 100%;
    height: 56px;
    font-size: 26px;
    padding-left: 40px;
}
.search_input_bg img{
    display: inline-block;
    margin:0 auto;
    height: 26px;
    top:5px;
    position: relative;
}
.search_input_bg .btn_cancel{
    position: relative;
    float: right;
    line-height: 56px;
    color:#666666;
    cursor: pointer;
    display: none;
}

.search_blur_noword .tips_search{
    margin-left: 300px;
}

.search_blur_word .tips_search,.search_foucs_noword .tips_search,.search_foucs_word .tips_search{
    margin-left: 10px;
}

.search_foucs_noword .input_keyword,.search_foucs_word .input_keyword{
    width: 90%;
}

.search_foucs_word .icon_clear{
    right: 15%;
}

.search_foucs_noword .tips_search span,.search_blur_noword .tips_search span{
    visibility: visible;
}
/*有一个问题没有解决，在激活input的情况下，如果点击clear按钮，input就会失去激活状态，目前没找到保持激活状态的方法，所以，暂时隐藏激活状态下的clear按钮*/
/*.search_foucs_word .icon_clear,*/
.search_blur_word .icon_clear{
    display: block;
}

.search_foucs_noword .btn_cancel,.search_foucs_word .btn_cancel{
    display: block;
}
</style>
