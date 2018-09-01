<template>
    <div class="app_header" v-if="isCanHeaderShow" :class="{no_fullscreen:!isFullscreen}">
        <div class="header_blank" v-if="isFullscreen && $store.state.page.title">&nbsp;</div>
        <transition name="fade">
            <div class="header_fixed" v-if="isFadeIn && $store.state.page.title" tabindex="0" @blur="fadeOutWhenBlur" ref="headerNode">
                <!-- <div class="empty_blank" v-if="!isFullscreen" @touchstart="isFadeIn=false;">&nbsp;</div> -->
                <div class="btn_back" @click="$store.dispatch('btnBack')" v-if="!$route.meta.isShowFooter">\{{ $store.state.page.backText?$store.state.page.backText:'返回' }}</div>
                <div class="header_title" >\{{ $store.state.page.title }}</div>
                <div class="btn_more" @click="$store.dispatch('btnMore')" v-if="$store.state.page.moreText"><div>\{{$store.state.page.moreText}}</div></div>
            </div>
        </transition>
    </div>
    <div v-else></div>
</template>

<script>
export default {
    name: 'AppHeader',
    data () {
        return {
            isFadeIn: true,
            scrolled: 0,
        }
    },
    computed:{
        isCanHeaderShow:function(){
            if (this.$store.state.page.isDdtalk)
            {
                return false;
            }
            if (!this.isFullscreen)
            {//微信内，只有需要右上角按钮时才出现。
            }
            return true;
        },
        moreText:function(){
            return this.$store.state.page.moreText;
        },
        // 是否在非全屏模式（如微信或企业微信中）
        isFullscreen(){
            return ! (this.$store.state.page.isWechat || this.$store.state.page.isWxwork);
        },
    },
    watch:{
        moreText:function(){
            this.isFadeIn = true;
            this.focusWhenShow();
        },
        scrolled:function(newValue,oldValue){
            if (this.isFadeIn && newValue - oldValue > 10)
            {
                this.isFadeIn = false;
            }
            else if (!this.isFadeIn && (newValue==0 || newValue - oldValue < -10) )
            {
                this.isFadeIn = true;
            }
        },
        isFadeIn:function(){
            this.focusWhenShow();
        },
    },
    created:function(){
        if (this.isCanHeaderShow)
        {
            this.$nextTick(()=> {
                window.addEventListener('scroll', this.onScroll)
                window.addEventListener('click', this.showIfBodyFocused)
                // window.addEventListener('blur', this.showIfBodyFocused)
            });
        }
    },
    methods: {
        onScroll() {
            this.scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        },
        showIfBodyFocused(){
            this.$nextTick(()=> {
                var focusNode = document.activeElement;
                if (this.scrolled==0 && (!focusNode || focusNode.tagName=='BODY'))
                {
                    this.isFadeIn = true;
                }
            });
        },
        focusWhenShow(){
            this.$nextTick(()=> {
                var focusNode = document.activeElement;
                if (this.isFadeIn && (!focusNode || focusNode.tagName=='BODY'))
                {
                    if (this.$refs.headerNode)
                    {
                        this.$refs.headerNode.focus();
                    }
                }
            });
        },
        fadeOutWhenBlur(event){
            this.$nextTick(()=> {
                if (!this.isFullscreen)
                {
                    var focusNode = document.activeElement;
                    if (focusNode && focusNode!=event.target && focusNode.tagName!='BODY')
                    {
                        this.isFadeIn = false;
                    }
                }
            });
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app_header {
    position: relative;
    color: #ffffff;
    line-height: 88px;
    z-index: 90;
}

.app_header .header_blank{
    width: 100%;
}
.app_header .header_fixed{
    position: fixed;
    width:100%;
    top: 0;
    left: 0;
    outline: none;
}
.app_header .header_title{
    font-size: 35px;
    padding: 0 120px;
    text-align: center;
    line-height: 88px;
    background-color: #08b2f2;
    font-size: 36px;
}

.app_header .btn_back{
    position: absolute;
    left: 0;
    padding-left: 49px;
    padding-right: 33px;
    background: url("~@/assets/images/login_reg/return.png") no-repeat left;
    background-size: auto 52px;
    cursor: pointer;
    font-size: 27px;
}

.app_header .btn_more{
    position: absolute;
    right: 0;
    top:0;
    font-size: 30px;
    padding: 0 33px;
}

/*--------------------------wechat_header,wxwork_header--------------------------------*/
.no_fullscreen{
    top: 20px;
    position: fixed;
    width: 750px;
    margin: auto;
}

.no_fullscreen .btn_back{
    display: none;
}

.no_fullscreen .header_title{
    display: none;
}
.no_fullscreen .btn_more{
    width: 200px;
    height: 200px;
    font-size: 28px;
    border-radius: 200px;
    color: #2c84f2;
    background-color: white;
    border: 2px solid #ececec;
    box-shadow: -2px 2px 18px #ececec;
    right: -82px;
    padding: 82px 91px 23px 21px;
    line-height: 32px;
    top: -82px;
    overflow: hidden;
    display: table;
}

.no_fullscreen .btn_more div{
    text-align: center; display: table-cell; vertical-align: middle;
}

.empty_blank{
    width:100%;
    height: 200px;
    position: absolute;
    left: 0;
    top: 0;
}
/*=================*/
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
