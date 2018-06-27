<template>
    <div class="init_feedback_bg">
        <div class="feedback_header"></div>
        <div class="form_inline">
            <textarea v-model="item.content" placeholder="请留下您宝贵的意见，让我们不断进步，谢谢！"></textarea>
        </div>
        <div class="form_inline">
            <div class="form_label">联系人名称:</div>
            <input type="text" v-model="item.name" placeholder="联系人名称" />
        </div>
        <div class="form_inline">
            <div class="form_label">联系电话:</div>
            <input type="text" v-model="item.telephone" placeholder="联系电话" />
        </div>
        <div class="feedback_note">
            <p>咨询及意见反馈，可加QQ:<a>156873375</a></p>
            <p>电话微信同号：<a href="tel:13818815391">138 1881 5391</a></p>
        </div>

        <div class="form_submit">
            <div class="btn_submit" @click="submit">提交</div>
        </div>
    </div>
</template>

<script>
import KongContent        from "@/components/KongContent"
import InputDaySelect     from "@/components/InputDaySelect"
import InputDefaultSelect     from "@/components/InputDefaultSelect"



export default {
    name: 'InitFeedback',
    components:{
        KongContent,
        InputDaySelect,
        InputDefaultSelect,
    },
    data(){
        console.log('InitFeedback.vue.data()');
        return {
            item       : {},
        }
    },
    methods:{
        pageenter:function(){
            this.$store.dispatch('pageUpdate',{
                    title:'意见反馈',
                });
        },
        submit:function(){
            Promise.all([
                    this.$haoconnect.post('feedback/add',this.item)])
            .then(()=>{
                this.$MessageBox.alert('提交成功，谢谢您的反馈。').then(()=>{
                    this.$emit('input','ok');
                    this.$router.go('-1');
                    this.item = {};
                });
            }).catch(hResult=>{console.error(hResult);this.$MessageBox.alert(hResult.errorStr?hResult.errorStr:hResult)});
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.init_feedback_bg{
    position: relative;
    top: -1px;
}


/*--------------------form_inline------------------------*/
.form_inline{
    background: white;
    line-height: 84px;
    min-height: 84px;
    font-size: 30px;
    color: #448ef3;
    text-align: right;
    position: relative;
    border-bottom: 2px solid #f0f2f5;
    clear: both;
}
.form_inline .form_label{
    position: absolute;
    pointer-events:none;
    left: 0px;
    color: #1b1b20;
    padding: 0 34px;
    background: white;
}
.form_inline input{
    width: 100%;
    font-size: 28px;
    color: #448ef3;
    padding-right: 20px;
    border: 0;
    text-align: right;
}
.form_inline textarea{
    width: 100%;
    height: 325px;
    font-size: 28px;
    padding: 33px;
    border: 0;
    text-align: left;
}
.form_inline textarea:focus{
    outline: none;
}
.form_inline select{
    font-size: 28px;
    direction: rtl;
    width: 50%;
}
.form_inline input.input_day_select{
    width: 50%;
}
.form_inline input.input_day_two{
    width: 196px;
}
.form_inline .tip_in_day{
    color: #1b1b20;
}
.form_inline input:focus{
    outline: none;
}
.form_inline .form_require_tip{
    color: #f40b0b;
    position: relative;
    top: -4px;
}

.form_inline input[type=radio]{
    width: 30px;
    transform: scale(2);
}
.form_center{
    text-align: center;
}
.form_contract_type label{
    /*padding: 0 15px;*/
}
.form_wenhao_tip{
    position: relative;
    top: 2px;
    padding: 8px;
    background: url(~@/assets/design/ys/jiyingshou/wenhao.png) no-repeat;
    background-size: auto 23px;
    margin: 0 10px 0 4px;
}

.form_submit{
    width: 100%;
    float: left;
    margin-top: 50px;
    clear: both;
}
.btn_submit{
    margin: 0 auto;
    width: 600px;
    height: 82px;
    line-height: 82px;
    font-size: 36px;
    color: white;
    background: rgba(8, 178, 242, 1);
    text-align: center;
    letter-spacing: 23px;
}
.btn_xiayi{
    background: url(~@/assets/design/ys/jiyingshou/get.png) no-repeat;
    background-size: 13px 23px;
    background-position: 10px;
    padding: 0 22px;
    display: inline-block;
}
/*--------------------------------------------*/
/*-------------------本页特有元素-------------------------*/
.feedback_header{
    width: 100%;
    height: 264px;
    background:url(~@/assets/design/wode/yijianfankui/tu.png) no-repeat;
    background-size: 750px;
    position: relative;
}
.feedback_note{
    font-size: 26px;
    line-height: 35px;
    color: #848484;
    padding: 32px;
}
.feedback_note a{
    color: #08b2f2;
}
</style>
