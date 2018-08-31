<template>
    <div class="app-header" v-if="isHeaderShow" :class="{wechat_header:$store.state.page.isWechat,wxwork_header:$store.state.page.isWxwork,}">
        <div class="btn_back" @click="$store.dispatch('btnBack')" v-if="!$route.meta.isShowFooter">\{{ $store.state.page.backText?$store.state.page.backText:'返回' }}</div>
        <div class="header_title" >\{{ $store.state.page.title }}</div>
        <div class="btn_more" @click="$store.dispatch('btnMore')">\{{$store.state.page.moreText}}</div>
    </div>
    <div v-else></div>
</template>

<script>
export default {
    name: 'AppHeader',
    data () {
        return {
        }
    },
    computed:{
        isHeaderShow:function(){
            if  (!this.$store.state.page.title)
            {
                return false;
            }
            if (this.$store.state.page.isDdtalk)
            {
                return false;
            }
            if (this.$store.state.page.isWechat || this.$store.state.page.isWxwork)
            {//微信内，只有需要右上角按钮时才出现。
                if (!this.$store.state.page.moreText)
                {
                    return false;
                }
            }
            return true;
        },
    },
    methods:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-header {
    position: relative;
    color: #ffffff;
    line-height: 88px;
    z-index: 90;
}

.app-header .header_title{
    font-size: 35px;
    padding: 0 120px;
    text-align: center;
    line-height: 88px;
    background-color: #08b2f2;
    font-size: 36px;
}

.app-header .btn_back{
    position: absolute;
    left: 0;
    padding-left: 49px;
    padding-right: 33px;
    background: url("~@/assets/images/return.png") no-repeat left;
    background-size: auto 52px;
    cursor: pointer;
    font-size: 27px;
}

.app-header .btn_more{
    position: absolute;
    right: 0;
    top:0;
    font-size: 30px;
    padding: 0 33px;
}

/*--------------------------wechat_header,wxwork_header--------------------------------*/
.wechat_header, .wxwork_header{
    top: 20px;
    position: fixed;
    width: 750px;
    margin: auto;
}

.wechat_header .btn_back, .wxwork_header .btn_back{
    display: none;
}

.wechat_header .header_title, .wxwork_header .header_title{
    display: none;
}
.wechat_header .btn_more, .wxwork_header .btn_more{
    line-height: 38px;
    padding:0 18px;
    min-width: 100px;
    font-size: 20px;
    color:#2c84f2;
    background-color: white;
    border: 1px solid #ececec;
    border-right: 0;
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px;
}
</style>
