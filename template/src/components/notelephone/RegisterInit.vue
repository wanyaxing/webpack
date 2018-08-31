<template>
    <div class="init_change_telephone_bg" v-if="user">
        <div class="cell_inline cell_iconline">
            <div class="cell_label icon_tel"></div>
            <input type="text" v-model="item.telephone" placeholder="请输入手机号码" />
        </div>
        <div class="cell_inline cell_iconline cell_coltwo">
            <div class="cell_label icon_captcha"></div>
            <input type="text" v-model="item.captcha_code" placeholder="请输入图形码" />
            <input type="hidden" v-model="item.captcha_key">
            <img :src="captchaSrc" @click="loadCaptchaSrc"/>
        </div>
        <div class="cell_inline cell_iconline cell_coltwo">
            <div class="cell_label icon_verify"></div>
            <input type="text" v-model="item.verify_code"  placeholder="请输入验证码" />
            <a class="btn_sms" :class="{btn_disabled:countDown>0}" @click="sendSmsVerifyCode">发送验证码<span v-if="countDown>0">(\{{countDown}})</span></a>
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
        <div>
            <div class="btn_blue" @click="submit" >立即注册</div>
        </div>
        <div class="nav_bg">
            <span @click="$emit('update:action','ResetPwdInit')">忘记密码</span>
            <span style="float:right;" @click="$emit('update:action','BindLoginInit')">登录</span>
        </div>
    </div>
        <KongContent v-else>
            <img src="~@/assets/images/loading.png" slot="img"/>
            努力加载中...
        </KongContent>
</template>

<script>
import KongContent        from "@/components/KongContent"
import InputDaySelect     from "@/components/InputDaySelect"



export default {
    name: 'RegisterInit',
    components:{
        KongContent,
        InputDaySelect,
    },
    data(){
        console.log('RegisterInit.vue.data()');
        return {
            params        : null,
            user          : {},
            company       : {},
            requestResult        : null,
            item        : {},
            countDown:0,
            captchaSrc:null,
            isShowPassword : false,
        }
    },
    methods:{
        pageenter:function(){
            this.loadContent();
        },
        loadContent:function(){
            this.$haoconnect.get('user/get_my_detail').then(hResult=>{
                this.user = {
                    'id':hResult.find('id'),
                    'username':hResult.find('username'),
                    'telephone':hResult.find('telephone'),
                };
                this.company = {
                    'id':hResult.find('extraInfo>company>id'),
                    'name':hResult.find('extraInfo>company>name'),
                    'cashTime':hResult.find('extraInfo>company>cashTime'),
                };
                this.requestResult = hResult;
                this.loadCaptchaSrc();
            }).catch(hResult=>{alert(hResult.errorStr)});
        },
        loadCaptchaSrc:function(){
            this.$haoconnect.get('axapi/get_captcha',this.params).then(hResult=>{
                this.item.captcha_key = hResult.find('captchaKey');
                this.captchaSrc = hResult.find('url');
            }).catch(hResult=>{this.$MessageBox.alert(hResult.errorStr)});
        },
        sendSmsVerifyCode:function(){
            if (this.countDown>0)
            {
                return false;
            }
            this.$haoconnect.post('sms_verify/send_verify_code',{'telephone':this.item.telephone,'captcha_key':this.item.captcha_key,'captcha_code':this.item.captcha_code,'usefor':1}).then(hResult=>{
                this.countDown = 60 ;
                this.$MessageBox.alert(hResult.errorStr);
            }).catch(hResult=>{this.$MessageBox.alert(hResult.errorStr)});
        },
        submit:function(){
            this.$haoconnect.post('user/add',this.item).then(()=>{
                this.$emit('update:action','BindLoginInit');
            }).catch(hResult=>{console.error(hResult);this.$MessageBox.alert(hResult.errorStr?hResult.errorStr:hResult)});
        },
    },
    created:function(){
        this.$store.dispatch('pageUpdate',{
            title:'注册',
            backFn:()=>{
                this.$emit('update:action','BindLoginInit');
                return false;
            },
        });
        this.loadCaptchaSrc();
    },
    watch:{
        countDown:function(newValue,oldValue){
            if (newValue>0)
            {
                setTimeout(()=>{
                    this.countDown--;
                },1000);
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*--------------------form_inline------------------------*/

/*---------------------------------------*/

.form_inline >>> .input_day_select{
    height: 74px;
    display: inline-block;
    line-height: 74px;
    width: 95%;
    padding-left: 100px;
    margin-left: -17px;
}

/*==================*/
.btn_disabled{
    background: #999999!important;
}
</style>
