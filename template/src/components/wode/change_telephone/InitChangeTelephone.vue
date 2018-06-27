<template>
    <div class="init_change_telephone_bg" v-if="user">
        <div class="cell_inline cell_iconline">
            <div class="cell_label icon_tel"></div>
            <input type="tel" v-model="telephone" placeholder="请输入手机号码" />
        </div>
        <div class="cell_inline cell_iconline cell_coltwo">
            <div class="cell_label icon_captcha"></div>
            <input type="text" v-model="item.captcha_code" placeholder="请输入图形码" />
            <input type="hidden" v-model="item.captcha_key">
            <img :src="captchaSrc" @click="loadCaptchaSrc"/>
        </div>
        <div class="cell_inline cell_iconline cell_coltwo">
            <div class="cell_label icon_verify"></div>
            <input type="tel" v-model="item.verify_code"  placeholder="请输入验证码" />
            <a @click="sendSmsVerifyCode">发送验证码<span v-if="countDown>0">({{countDown}})</span></a>
        </div>
        <div class="cell_inline cell_iconline">
            <div class="cell_label icon_pwd"></div>
            <input type="password" v-model="item.oldpassword" placeholder="为保障数据安全，请输入当前登录密码" />
        </div>
        <div>
            <div class="btn_blue" @click="submit" >提交</div>
        </div>
    </div>
        <KongContent v-else>
            努力加载中...
        </KongContent>
</template>

<script>
import KongContent        from "@/components/KongContent"
import InputDaySelect     from "@/components/InputDaySelect"



export default {
    name: 'InitChangeTelephone',
    components:{
        KongContent,
        InputDaySelect,
    },
    data(){
        console.log('InitChangeTelephone.vue.data()');
        return {
            params        : null,
            user          : {},
            company       : {},
            requestResult        : null,
            telephone        : null,
            item        : {},
            countDown:0,
            captchaSrc:null,
            is_bind_confirm:0,
        }
    },
    methods:{
        pageenter:function(){
            this.$store.dispatch('pageUpdate',{
                    title:'更改手机号',
                });
            this.loadContent();
        },
        loadContent:function(){
            this.$haoconnect.get('user/get_my_detail').then(hResult=>{
                this.telephone = hResult.find('telephone'),
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
            this.$haoconnect.post('sms_verify/send_verify_code',{'telephone':this.telephone,'captcha_key':this.item.captcha_key,'captcha_code':this.item.captcha_code,'is_bind_confirm':this.is_bind_confirm,'usefor':4}).then(hResult=>{
                this.countDown = 60 ;
                this.$MessageBox.alert(hResult.errorStr);
            }).catch(hResult=>{
                if (hResult.isErrorCode(1216) || hResult.isErrorCode(1230))
                {
                    this.$MessageBox.confirm(hResult.errorStr).then(()=>{
                        this.is_bind_confirm = 1;
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
        submit:function(){
            this.$haoconnect.post('user/update_with_oldpassword',Object.assign({},this.item,{'telephone':this.telephone,'is_bind_confirm':this.is_bind_confirm})).then(()=>{
                this.$store.dispatch('get_my_detail');
                this.$emit('input',this.telephone);
                this.$router.go(-1);
            }).catch(hResult=>{console.error(hResult);this.$MessageBox.alert(hResult.errorStr?hResult.errorStr:hResult)});
        },
    },
    watch:{
        telephone:function(newItem,oldItem)
        {
            this.is_bind_confirm = 0;
        },
        countDown:function()
        {
            if (this.countDown>0)
            {
                setTimeout(()=>{
                    this.countDown --;
                },1000);
            }
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
