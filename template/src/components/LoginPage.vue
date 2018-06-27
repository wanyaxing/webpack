<template>
    <div v-if="$route.query.login">
        <form v-on:submit.stop.prevent="login" style="margin-top:140px;">
            <div class="cell_inline">
                <div class="cell_label">用户名：<span class="form_require_tip">*</span></div>
                <input type="text" v-model="loginParam.account" placeholder="用户名" />
            </div>
            <div class="cell_inline">
                <div class="cell_label">密码：<span class="form_require_tip">*</span></div>
                <input type="text" v-model="loginParam.password" placeholder="密码" />
            </div>
            <div class="form_submit">
                <input class="btn_blue" type="submit" value="账号密码登录">
            </div>
        </form>
        <form v-on:submit.stop.prevent="unionLogin">
            <div class="cell_inline">
                <div class="cell_label">登录方式：<span class="form_require_tip">*</span></div>
                <InputDefaultSelect v-model="unionParam.union_type" >
                    <option value="2">QQ</option>
                    <option value="3">微博</option>
                    <option value="4">微信APP</option>
                    <option value="5">钉钉</option>
                    <option value="6">企业微信</option>
                    <option value="7">微信公众号</option>
                    <option value="8">微信unionid</option>
                </InputDefaultSelect>
                <span class="btn_xiayi">&nbsp;</span>
            </div>
            <div class="cell_inline">
                <div class="cell_label">联合识别码：<span class="form_require_tip">*</span></div>
                <input type="text" v-model="unionParam.union_token" placeholder="联合识别码" />
            </div>
            <div class="form_submit">
                <input class="btn_blue" type="submit" value="联合登录">
            </div>
        </form>
    </div>
    <div class="only_dd_use" v-else-if="$store.state.page.isDdtalk || isDdHost" :style="{'min-height':bodyHeight+'px'}">
        <div>请企业管理员使用微信或QQ等第三方软件扫一扫，</div>
        <div>注册企业后再下载钉钉开始使用。  </div>
    </div>
    <div class="only_dd_use" v-else :style="{'min-height':bodyHeight+'px'}">
        <div>请使用微信打开后，</div>
        <div>开始使用。 </div>
    </div>
</template>

<script>
import InputDefaultSelect     from "@/components/InputDefaultSelect"

export default {
    name: 'LoginPage',
    components:{
        InputDefaultSelect,
    },
    data(){
        console.log('LoginPage.vue.data()');
        return {
            loginParam:{
                'account':'13774298448',
                'password':'qazxcv',
            },
            unionParam:{
                'union_type':'7',
                'union_token':'oQ0zpwpfn5uQfj-_7VWCuxdX5URM',
            },
        }
    },
    computed:{
        bodyHeight(){
            return window.innerHeight;
        },
        isDdHost(){
            return window.location.host == 'dd.jiyingshou.com';
        },
    },
    methods:{
        login:function(e){
            this.$store.dispatch('login',this.loginParam)
            .catch(hResult=>{console.error(hResult);this.$MessageBox.alert(hResult.errorStr?hResult.errorStr:hResult)});
        },
        unionLogin:function(e){
            this.$store.dispatch('unionLogin',this.unionParam)
            .catch(hResult=>{console.error(hResult);this.$MessageBox.alert(hResult.errorStr?hResult.errorStr:hResult)});
        },
    },
    created:function(){
        this.$store.dispatch('pageUpdate',{
                title:'记应收'
            });
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
