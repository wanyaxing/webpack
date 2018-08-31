<template>
    <div class="btn_view_more_bg">
        <div class="btn_viewmore" @click="switchMore">\{{placeholderText}}</div>
        <div class="bg_more" v-show="isShowMore" ref="bgMore">
            <slot></slot>
        </div>
    </div>
</template>

<script>

export default {
    name: 'BtnViewMore',
    components:{
    },
    props:[
        'requestResult',
        'placeholder',
    ],
    data(){
        console.log('BtnViewMore.vue.data()');
        return {
            isShowMore    : false,
            singleMenuText    : null,
            labelMore    : '查看更多',
        }
    },
    computed:{
        placeholderText(){
            if (this.singleMenuText)
            {
                return this.singleMenuText;
            }
            return this.placeholder?this.placeholder:'查看更多';
        },
    },
    methods:{
        switchMore:function(){
            console.log(this.$refs.bgMore,this.$refs.bgMore.childNodes.length)
            if (this.singleMenuText)
            {
                console.log('click');
                this.$refs.bgMore.childNodes[0].click();
            }
            else
            {
                this.isShowMore = !this.isShowMore;
            }
        },
        jumpToHref:function(url)
        {
            this.isShowMore = false;
            if (this.$store.state.page.isDevMode)
            {
                window.location = 'http://mobile-jiyingshou.haoxitech.com'+url;
            }
            else
            {
                window.location = 'http://mobile.jiyingshou.com'+url;
            }
        }
    },
    mounted:function(){
        if (this.$refs.bgMore && this.$refs.bgMore.childNodes.length==1)
        {
            this.singleMenuText = this.$refs.bgMore.childNodes[0].textContent;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn_view_more_bg{
    position: absolute;
    z-index: 90;
    top: 20px;
    right: 0;
}
.btn_viewmore{
    font-size: 20px;
    color:#448ef3;
    line-height: 38px;
    text-align: center;
    border:1px solid #448ef3;
    border-right: 0px;
    border-top-left-radius: 38px;
    border-bottom-left-radius: 38px;
    padding:0 18px;
    min-width: 100px;
}
.bg_more{
    position: absolute;
    right: 22px;
    top: 60px;
    width: 237px;
    font-size: 20px;
    line-height: 74px;
    color:white;
    background-color: #4483f3;
    border-radius: 5px;
}
.bg_more:after{
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    border-width: 18px 10px;
    border-color: transparent;
    border-bottom-color: #4483f3;
    top: -35px;
    right: 35px;
}
.bg_more>*{
    display: block;
    padding-left: 10px;
    width: 227px;
    margin:0 auto;
    border-bottom: 1px solid white;
    line-height: 50px;
}
.li_attachment{
    background: url(~@/assets/jys/fujian_03.png) no-repeat;
}
.li_reminder{
    background: url(~@/assets/jys/cuikuantz_03.png) no-repeat;
}
.li_payable{
    background: url(~@/assets/jys/cuikuantz_11.png) no-repeat;
}
.bg_more li{
    background-position: 10px;
}
</style>
