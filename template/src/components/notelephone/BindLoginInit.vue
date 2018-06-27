<template>
    <div class="bind_login_init_bg" v-if="item">
        <div class="header_logo">
            <img src="~@/assets/logo.png"/>
        </div>
        <div class="cell_inline cell_iconline">
            <div class="cell_label icon_tel"></div>
            <input type="text" v-model="item.account" placeholder="请输入手机号码" />
        </div>
        <div class="cell_inline cell_iconline" v-if="!isShowPassword">
            <div class="cell_label icon_pwd"></div>
            <input type="password" v-model="item.password" placeholder="请输入密码" />
            <div class="btn_pwd_hide" @click="isShowPassword=true"></div>
        </div>
        <div class="cell_inline cell_iconline" v-show="isShowPassword">
            <div class="cell_label icon_pwd"></div>
            <input type="text" v-model="item.password" placeholder="请输入密码" />
            <div class="btn_pwd_show" @click="isShowPassword=false"></div>
        </div>
        <div class="form_submit">
            <div class="btn_blue" @click="submit" >登录</div>
        </div>
        <div class="nav_bg">
            <span @click="$emit('update:action','ResetPwdInit')">忘记密码</span>
            <span style="float:right;" @click="$emit('update:action','RegisterInit')">注册</span>
        </div>
    </div>
</template>

<script>
import KongContent from "@/components/KongContent"

export default {
    name: 'BindLoginInit',
    components:{
        KongContent,
    },
    data(){
        console.log('BindLoginInit.vue.data()');
        return {
            params        : {},
            isShowPassword : false,
            requestResult : null,
            item : {},
        }
    },
    computed:{
        paramsToString(){
            console.log('BindLoginInit.paramsToString()');
            return JSON.stringify(this.params);
        },
    },
    methods:{
        pageenter:function(){
            this.params = {};
        },
        loadContent:function(){
            // let params = Object.assign({},this.params,this.moreParams);
            // this.$haoconnect.get('example/list',params).then(hResult=>{
            //     if ( hResult.results.length ==0 || (params['size'] && hResult.results.length< params['size']) || (!params['size'] && hResult.results.length< 10) )
            //     {
            //         this.moreParams.allLoaded = true;
            //     }
            //     if (this.$refs.loadmore)
            //     {
            //         if (params.page==1)
            //         {
            //             this.$refs.loadmore.onTopLoaded();
            //         }
            //         else
            //         {
            //             hResult.results = this.requestResult.results.concat(hResult.results);
            //             this.$refs.loadmore.onBottomLoaded();
            //         }
            //     }
            //     this.requestResult = hResult;
            //     this.isEditMode = false;
            //     this.rightBtnCheck();
            // }).catch(hResult=>{console.error(hResult);this.$MessageBox.alert(hResult.errorStr?hResult.errorStr:hResult)});
        },
        submit:function(){
            this.$store.dispatch('bindLogin',this.item)
            .catch(hResult=>{console.error(hResult);this.$MessageBox.alert(hResult.errorStr?hResult.errorStr:hResult)});
        }
    },
    watch:{
        paramsToString:function(){
            this.loadContent();
        },
    },
    created:function(){
        this.$store.dispatch('pageUpdate',{
            title:'登录'
        });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*---------------------------------------*/
.header_logo{
    height: 319px;
    width: 100%;
}
.header_logo img{
    width: 159px;
    height: 159px;
    margin-left: 295px;
    margin-top:61px;
}
/*---------------------------------------*/

</style>
