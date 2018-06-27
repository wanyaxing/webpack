<template>
    <div>
        <center>
            <img src="~@/assets/jys/60@3x.png" style="width: 101px;"/>
            <p style="font-size: 34px;color: #3c7fc8;">感谢您使用记应收</p>
        </center>
        <div class="form_inline" style="margin-top: 260px;">
            <div class="form_label">手机号</div>
            <input type="tel" v-model="telephone" />
        </div>
        <div class="form_inline form_coltwo">
            <div class="form_label">图形码</div>
            <input type="text" v-model="item.captcha_code"  />
            <input type="hidden" v-model="item.captcha_key">
            <img :src="captchaSrc" @click="loadCaptchaSrc"/>
        </div>
        <div class="form_inline form_coltwo">
            <div class="form_label">验证码</div>
            <input type="tel" v-model="item.verify_code"  />
            <a @click="sendSmsVerifyCode">发送验证码<span v-if="countDown>0">({{countDown}})</span></a>
        </div>
        <div class="form_inline" v-if="isShowPassword">
            <div class="form_label">密　码</div>
            <input type="password" v-model="item.password" />
        </div>
        <div class="form_inline form_cash_time" v-if="isShowPassword">
            <div class="form_label">公司成立时间</div>
            <InputDaySelect v-model="item.cash_time" minDate="1990-01-01" :maxDate="$W2Time.timetostr(null,'yyyy-MM-dd')"></InputDaySelect>
        </div>
        <div class="form_submit" v-if="$store.state.user.currentUser.find('extraInfo>isWxworkAdmin')">
            <div class="btn_submit" @click="createCompanyForWxwork" >确认</div>
            <div style="font-size: 20px;color: #252525;text-align: center;margin-top: 14px;">
                已注册记应收App，请用记应收App的登录帐号绑定企业微信版记应收
            </div>
        </div>
        <div class="form_submit" v-else-if="$store.state.user.currentUser.find('extraInfo>isDdAdmin')">
            <div class="btn_submit" @click="createCompanyForDD" >确认</div>
        </div>
    </div>
</template>

<script>
import KongContent        from "@/components/KongContent"
import InputDaySelect     from "@/components/InputDaySelect"

export default {
    name: 'AdminFirstInit',
    components:{
        KongContent,
        InputDaySelect,
    },
    data(){
        console.log('AdminFirstInit.vue.data()');
        return {
            item        : {},
            telephone:null,
            countDown:0,
            captchaSrc:null,
            isShowPassword : false,
            isNewCompany : false,
            is_bind_confirm:0,
        }
    },
    methods:{
        pageenter:function(){
            this.$store.dispatch('pageUpdate',{
                    title:'初始化',
                });
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
            this.$haoconnect.post('sms_verify/send_verify_code',{'telephone':this.telephone,'captcha_key':this.item.captcha_key,'captcha_code':this.item.captcha_code,'is_bind_confirm':this.is_bind_confirm,'usefor':7}).then(hResult=>{
                this.countDown = 60 ;
                this.$MessageBox.alert(hResult.errorStr);
                if (!this.is_bind_confirm)
                {
                    this.isShowPassword = true;
                }
            }).catch(hResult=>{
                if (hResult.isErrorCode(1231))
                {
                    this.$MessageBox.confirm(hResult.errorStr).then(()=>{
                        this.is_bind_confirm = 1;
                        this.isShowPassword = false;
                        this.sendSmsVerifyCode();
                    }).catch(()=>{
                        this.is_bind_confirm = 0;
                    });
                }
                else
                {
                    this.$MessageBox.alert(hResult.errorStr)
                }
            });
        },
        createCompanyForWxwork:function(){
            this.item.telephone = this.telephone;
            this.item.is_bind_confirm = this.is_bind_confirm;
            this.$store.dispatch('createCompanyForWxwork',this.item)
            .catch(hResult=>{console.error(hResult);this.$MessageBox.alert(hResult.errorStr?hResult.errorStr:hResult)});
        },
        createCompanyForDD:function(){
            this.item.telephone = this.telephone;
            this.item.is_bind_confirm = this.is_bind_confirm;
            this.$store.dispatch('createCompanyForDD',this.item)
            .catch(hResult=>{console.error(hResult);this.$MessageBox.alert(hResult.errorStr?hResult.errorStr:hResult)});
        },
    },
    watch:{
        countDown:function(){
            if (this.countDown>0)
            {
                setTimeout(()=>{
                    this.countDown -= 1;
                },1000);
            }
        },
        captchaSrc:function(){
            setTimeout(()=>{
                this.loadCaptchaSrc();
            },300000);
        },
        telephone:function(newItem,oldItem)
        {
            this.is_bind_confirm = 0;
            this.isShowPassword = false;
        },
    },
    created:function(){
        document.body.style.backgroundColor='white';
        this.$store.dispatch('pageUpdate',{
                title:'请做初始化'
            });
        this.loadCaptchaSrc();
    },
    destroyed:function(){
        document.body.removeAttribute('style');
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*--------------------form_inline------------------------*/
.form_inline{
    position: relative;
    width: 649px;
    margin: 0 auto;
    /*padding: 20px 0;*/
    background-color: white;
    border-bottom: 2px solid #ebf0f2;
}
.form_inline input{
    height: 74px;
    width: 100%;
    font-size: 28px;
    padding-left: 120px;
    padding-right: 0;
    /*background: #f0f2f6;*/
    /*border: 1px solid #d8dce1;*/
    color: #448ef3;
    border:0;
}
.form_inline input:focus {
    background: white;
    outline: none;
}

.form_inline .form_label{
    position: absolute;
    pointer-events:none;
    left: 0;
    font-size: 26px;
    line-height: 78px;
    color: #050505;
    padding-left: 13px;
    pointer-events: none;
}

.form_coltwo input{
    width: 52%;
}
.form_coltwo a,.form_coltwo img{
    position: absolute;
    width: 200px;
    line-height: 74px;
    right: 0;
    top: 0;
    font-size: 22px;
    color: #b3c9e1;
    text-align: right;
}
.form_coltwo img{
    top: 3px;
    height: 67px;
}

.form_submit{
    width: 100%;
    float: left;
    margin-top: 60px;
    clear: both;
}
.form_submit .btn_submit{
    margin: 0 auto;
    width: 587px;
    height: 67px;
    line-height: 67px;
    font-size: 26px;
    color: white;
    background: #3c7fc8;
    text-align: center;
    letter-spacing: 23px;
}
/*---------------------------------------*/
.icon_tel,.icon_captcha,.icon_verify,.icon_pwd,.icon_name,.icon_time{
    background-repeat: no-repeat;
    width: 31px;
    height: 31px;
    margin-left: 33px;
    top: 43px;
    background-size: auto 31px;
    position: absolute;

}
.icon_tel{
    background-image:url(~@/assets/design/denglu/cellphone.png);
}
.icon_captcha{
    background-image:url(~@/assets/design/denglu/eye.png);
}
.icon_verify{
    background-image:url(~@/assets/design/denglu/verification.png);
}
.icon_pwd{
    background-image:url(~@/assets/images/login_reg/password.png);
}
.icon_name{
    background-image:url(~@/assets/images/login_reg/company.png);
}
.icon_time{
    background-image:url(~@/assets/images/login_reg/establishment.png);
}
.btn_pwd_show{
    display: block;
    position: absolute;
    width: 130px;
    height: 100%;
    top: 0;
    right: 0;
    background:url(~@/assets/images/login_reg/eyes.png) no-repeat;
    background-size: auto 31px;
    background-position: 33px 43px;
}

.btn_pwd_hide{
    display: block;
    position: absolute;
    width: 130px;
    height: 100%;
    top: 0;
    right: 0;
    background:url(~@/assets/images/login_reg/eyes-close.png) no-repeat;
    background-size: 53px auto;
    background-position: 33px 57px;
}

.form_inline >>> .input_day_select{
    height: 74px;
    display: inline-block;
    line-height: 74px;
    width: 100%;
    text-align: right;
    color: #b3c9e1;
}

/*==================*/
.btn_disabled{
    background: #999999!important;
}
</style>
