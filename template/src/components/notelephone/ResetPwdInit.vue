<template>
    <div class="init_change_telephone_bg" >
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
            <input type="text" v-model="item.verifycode"  placeholder="请输入验证码" />
            <a class="btn_sms" :class="{btn_disabled:countDown>0}" @click="sendSmsVerifyCode">发送验证码<span v-if="countDown>0">({{countDown}})</span></a>
        </div>
        <div class="cell_inline cell_iconline" v-if="!isShowPassword">
            <div class="cell_label icon_pwd"></div>
            <input type="password" v-model="item.newpassword" placeholder="请输入密码" />
            <div class="btn_pwd_hide" @click="isShowPassword=true"></div>
        </div>
        <div class="cell_inline cell_iconline" v-show="isShowPassword">
            <div class="cell_label icon_pwd"></div>
            <input type="text" v-model="item.newpassword" placeholder="请输入密码" />
            <div class="btn_pwd_show" @click="isShowPassword=false"></div>
        </div>
        <div class="form_submit">
            <div class="btn_blue" @click="submit" >提交</div>
        </div>
        <div class="nav_bg">
            <span @click="$emit('update:action','BindLoginInit')">登录</span>
            <span style="float:right;" @click="$emit('update:action','RegisterInit')">注册</span>
        </div>
    </div>
</template>

<script>

export default {
    name: 'RegisterInit',
    components:{
    },
    data(){
        console.log('RegisterInit.vue.data()');
        return {
            params        : null,
            item        : {},
            countDown:0,
            captchaSrc:null,
            isShowPassword : false,
        }
    },
    methods:{
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
            this.$haoconnect.post('sms_verify/send_verify_code',{'telephone':this.item.telephone,'captcha_key':this.item.captcha_key,'captcha_code':this.item.captcha_code,'usefor':3}).then(hResult=>{
                this.countDown = 60 ;
                this.$MessageBox.alert(hResult.errorStr);
            }).catch(hResult=>{this.$MessageBox.alert(hResult.errorStr)});
        },
        submit:function(){
            this.$haoconnect.post('user/update_with_verify_code',this.item).then(()=>{
                this.$MessageBox.alert('密码修改成功').then(()=>{
                    this.$emit('update:action','BindLoginInit');
                });
            }).catch(hResult=>{console.error(hResult);this.$MessageBox.alert(hResult.errorStr?hResult.errorStr:hResult)});
        },
    },
    created:function(){
        this.$store.dispatch('pageUpdate',{
            title:'忘记密码',
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

/*==================*/
.btn_disabled{
    background: #999999!important;
}
</style>
