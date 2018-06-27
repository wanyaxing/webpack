<template>
    <div class="init_user_info_bg" v-if="requestResult">
        <div class="cell_inline">
            <div class="cell_label">姓名</div>
            <input type="text" v-model="item.nickname" placeholder="姓名" />
        </div>
        <div class="cell_inline">
            <div class="cell_label">手机号码</div>
            <input type="text" v-model="item.telephone" v-model-link="'/wode/change_telephone'" @input="loadContent" placeholder="手机号码" />
        </div>
        <div class="cell_inline">
            <div class="cell_label">头像</div>
            <uploadFileSingle style="position: absolute;right: 5px;top:5px;" :width="74" :height="74" v-model="item.avatar" fileNumLimit="1" ></uploadFileSingle>
        </div>
        <div>
            <div class="btn_blue" @click="submit">保存</div>
        </div>
    </div>
        <KongContent v-else>
            努力加载中...
        </KongContent>
</template>

<script>
import KongContent        from "@/components/KongContent"
import InputDaySelect     from "@/components/InputDaySelect"
import uploadFileSingle     from "@/components/uploadFileSingle.vue"



export default {
    name: 'InitUserInfo',
    components:{
        KongContent,
        InputDaySelect,
        uploadFileSingle,
    },
    data(){
        console.log('InitUserInfo.vue.data()');
        return {
            params        : null,
            item          : {},
            requestResult : null,
        }
    },
    methods:{
        pageenter:function(){
            this.$store.dispatch('pageUpdate',{
                    title:'个人信息',
                });
            this.loadContent();
        },
        loadContent:function(){
            this.$haoconnect.get('user/get_my_detail').then(hResult=>{
                this.item = hResult.results;
                this.requestResult = hResult;
            }).catch(hResult=>{alert(hResult.errorStr)});
        },
        submit:function(){
            Promise.all([
                    this.$haoconnect.post('user/update',this.item),
                    ])
            .then(()=>{
                this.$store.dispatch('get_my_detail');
                this.$emit('input','ok');
                this.$router.go(-1);
            }).catch(hResult=>{console.error(hResult);this.$MessageBox.alert(hResult.errorStr?hResult.errorStr:hResult)});
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
