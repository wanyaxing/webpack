<template>
    <div class="no_telephone_available_bg" v-if="$store.state.user.currentUser">
        <mt-loadmore :top-method="loadTop" ref="loadmore">
            <AdminFirstInit v-if="$store.state.user.currentUser.find('extraInfo>isDdAdmin') || $store.state.user.currentUser.find('extraInfo>isWxworkAdmin')" class="form_body"></AdminFirstInit>
            <template v-else-if="$store.state.page.isWechat || $store.state.page.isH5Mode">
                <!-- <KongContent v-if="action==''">
                    <img src="~@/assets/design/kong/quanxian.png" slot="img"/>
                    <p>在使用记应收之前，</p>
                    <p>为了更好的为您服务，</p>
                    <p>您可以与APP版的账号进行绑定，</p>
                    <p>或者注册一个新账号哦。</p>
                    <span @click="action='BindLoginInit'">登录</span>
                </KongContent> -->
                <BindLoginInit v-if="action=='' || action=='BindLoginInit'" :action.sync="action"></BindLoginInit>
                <ResetPwdInit v-else-if="action=='ResetPwdInit'" :action.sync="action"></ResetPwdInit>
                <RegisterInit v-else-if="action=='RegisterInit'" :action.sync="action"></RegisterInit>
            </template>
            <KongContent v-else>
                <p>{{$store.state.user.currentUser.find('username','嗨')}}，</p>
                <p>您还不能使用记应收，</p>
                <p>快通知管理员来开通吧~~</p>
            </KongContent>
        </mt-loadmore>
    </div>
        <KongContent v-else>
            <img src="~@/assets/images/loading.png" slot="img"/>
            努力加载中...
        </KongContent>
</template>

<script>
import KongContent from "@/components/KongContent"
import InputDaySelect     from "@/components/InputDaySelect"
import AdminFirstInit     from "./AdminFirstInit.vue"
import BindLoginInit     from "./BindLoginInit.vue"
import RegisterInit     from "./RegisterInit.vue"
import ResetPwdInit     from "./ResetPwdInit.vue"

export default {
    name: 'NoTelephoneAvailable',
    components:{
        KongContent,
        InputDaySelect,
        AdminFirstInit,
        BindLoginInit,
        RegisterInit,
        ResetPwdInit,
    },
    data(){
        console.log('NoTelephoneAvailable.vue.data()');
        return {
            params        : {},
            requestResult : null,
            moreParams : {
                allLoaded:false,
                page:1,
            },
            action:'',
        }
    },
    methods:{
        loadContent:function(){
            this.$store.dispatch('get_my_detail');
        },
        loadTop:function(){
            this.moreParams.page = 1;
            this.loadContent();
            console.log('loadTop');
        },
    },
    created:function(){
        this.loadContent();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.no_telephone_available_bg >>> .nav_bg{
    width:100%;
    padding: 35px 75px;
    color:#2c84f2;
    clear: both;
}

</style>
