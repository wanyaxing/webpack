<template>
    <div class="index_wode_home_bg" v-if="requestResult">
        <mt-loadmore :top-method="loadTop" ref="loadmore">
        <div class="wode_header">
            <div class="wode_title" v-if="$store.state.page.isWechat || $store.state.page.isWxwork">我的</div>
            <div class="wode_blank" v-else>&nbsp;</div>
            <div class="wode_info" v-model-link="'/wode/user_info'" @input="loadContent">
                <div class="avatar" v-if="requestResult.find('avatar')"><img
                    :src="'/ajax/file_relationships_view.php?file_name='+encodeURIComponent(requestResult.find('avatar')+'?imageMogr2/auto-orient/thumbnail/!120x120r/gravity/Center/crop/120x120')"
                    /></div>
                <div class="avatar" v-else>{{requestResult.find('nickname','未知昵称').substr(-2)}}</div>
                <div class="name">
                    <span class="tag" v-if="requestResult.find('id') == requestResult.find('extraInfo>company>userID')">{{requestResult.find('id') == requestResult.find('extraInfo>company>userID') ?'管理员':''}}</span>
                    <span class="tag" v-if="requestResult.find('userRoleLocal')">{{requestResult.find('userRoleLocal')}}</span>
                    <span>{{requestResult.find('nickname','未知昵称')}}</span>
                </div>
                <div class="company">{{requestResult.find('extraInfo>company>name')}}</div>
                <div class="telephone">{{requestResult.find('telephone')}}</div>
            </div>
        </div>
        <div class="cell_inline" style="margin-top:10px;" @click="logout">
            <div class="cell_label label_tuichu">重新登录</div>
            <span class="btn_xiayi">&nbsp;</span>
        </div>
        </mt-loadmore>
    </div>
        <KongContent v-else>
            <img src="~@/assets/images/loading.png" slot="img"/>
            努力加载中...
        </KongContent>
</template>

<script>
import KongContent from "@/components/KongContent"

export default {
    name: 'IndexWodeHome',
    components:{
        KongContent,
    },
    data(){
        console.log('IndexWodeHome.vue.data()');
        return {
            params        : null,
            requestResult : null,
        }
    },
    computed:{
        paramsToString(){
            console.log('IndexWodeHome.paramsToString()');
            return JSON.stringify(this.params);
        },
    },
    methods:{
        pageenter:function(){
            this.params = {
                        'uuid'       : this.$route.query.uuid   ,
                    };

            this.$store.dispatch('pageUpdate',{
                    title:'我的',
                });
        },
        logout:function(){
            this.$store.dispatch('logout');
        },
        loadContent:function(){
            this.$haoconnect.get('user/get_my_detail',this.params).then(hResult=>{
                this.requestResult = hResult;
                if (this.$refs.loadmore){
                    this.$refs.loadmore.onTopLoaded();
                }
            }).catch(hResult=>{alert(hResult.errorStr)});
        },
        loadTop:function(){
            this.loadContent();
        },
        jumpToVipSpecial:function(){
            window.location.href='/wode/vip_special';
        },
        jumpToSharePage:function(){
            if (this.$store.state.page.dingtalk)
            {
                const dd = this.$store.state.page.dingtalk.apis;
                dd.biz.util.share({
                    type: 0,//分享类型，0:全部组件 默认； 1:只能分享到钉钉；2:不能分享，只有刷新按钮
                    url: 'http://mobile.jiyingshou.com/load/index.html',
                    title: '记应收 - 全网唯一的免费企业应收帐款管理App',
                    content: '无法拒绝记应收的三个理由：\r\n1. 免费 2. 无需注册，体验绝佳\r\n3. 统计强大，提醒及时',
                    image: 'http://mobile.jiyingshou.com/images/wechatLogo.png',
                    onSuccess : function() {
                        //onSuccess将在分享完成之后回调
                        /**/
                    },
                    onFail : function(err) {}
                });
            }
            else
            {
                window.location.href='http://mobile.jiyingshou.com/load/index.html';
            }
        }
    },
    watch:{
        paramsToString:function(){
            this.loadContent();
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

/*--------------------------------------------*/
.form_telephone{
    border-bottom-width: 10px;
}
.form_address input[type=text]{
    text-align: left;
    padding-left: 34px;
}

.wode_header{
    background:url(~@/assets/design/wode/wode/back.png) no-repeat;
    padding-bottom: 42px;
    margin-top: -1px;
}
.wode_header .wode_title{
    text-align: center;
    line-height: 88px;
    color:white;
    font-size: 36px;
}
.wode_header .wode_blank{
    text-align: center;
    line-height: 44px;
    color:white;
    font-size: 36px;
}
.wode_header .wode_info{
    background-color: white;
    border-radius: 10px;
    margin:19px 30px;
    position: relative;
    padding: 50px 166px 43px 166px;
    background-image: url(~@/assets/images/wode/edit.png);
    background-repeat: no-repeat;
    background-position: 653px 10px;
    background-size: 26px;
    overflow: hidden;
    min-height: 200px;
}
.wode_header .wode_info .avatar{
    position:absolute;
    background: #f0f2f5;
    color: #5d9eef;
    font-size: 36px;
    width: 120px;
    height: 120px;
    text-align: center;
    line-height: 120px;
    border-radius: 60px;
    left: 24px;
    top: 48px;
    overflow: hidden;
}
.wode_header .wode_info .avatar img{
    max-width: 100%;
}
.wode_header .wode_info .name{
    font-size: 28px;
    color: #333333;
    white-space: nowrap;
}
.wode_header .wode_info .name .tag{
    border-radius: 4px 4px 4px 4px;
    border: solid 1px rgba(8, 178, 242, 1);
    font-size: 20px;
    padding:0 13px;
    color: #08b2f2;
    position: relative;
    top: -6px;
}
.wode_header .wode_info .company{
    color: #666666;
    font-size: 26px;
}
.wode_header .wode_info .telephone{
    color: #666666;
    font-size: 26px;
}

</style>
