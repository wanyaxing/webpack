<template>
    <div id="app" >
        <div v-if="currentUser" :style="{'padding-bottom':($route.meta.isShowFooter?'103px':'')}">
            <app-header/>
            <template v-if="currentUser.find('telephone')!=null">
                <transition :name="transitionName" mode="out-in">
                    <keep-alive>
                        <router-view class="transit-view"></router-view>
                    </keep-alive>
                </transition>
                <app-footer v-if="$route.meta.isShowFooter"/>
            </template>
            <NoTelephoneInit v-else></NoTelephoneInit>
        </div>
        <div v-else-if="$store.state.user.loginFailed">
            <LoginPage></LoginPage>
        </div>
        <div v-else>
            loading...
        </div>
    </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'
import LoginPage from '@/components/LoginPage'
import NoTelephoneInit from '@/components/notelephone/NoTelephoneInit.vue'
import { mapState } from 'vuex'

export default {
    name: 'app',
    components:{
    },
    data(){
        return {
            transitionName:'',
            isCanBeSync:true,
        }
    },
    computed:{
        ...mapState({
            currentUser:state=>state.user.currentUser
        }),
        currentCompany(){
            if (this.$store.state.user.currentUser)
            {
                return this.$store.state.user.currentUser.find('extraInfo>company')
            }
            return null;
        },
    },
    // computed:{
    //   currentUser(){
    //     return this.$store.state.user.currentUser
    //   }
    // },
    components:{
        AppHeader,
        AppFooter,
        LoginPage,
        NoTelephoneInit,
    },
    methods:{
    },
    watch:{
        '$route'(to, from) {
            // console.log('watch.$route');
            // this.$store.dispatch('pageUpdate',{
            //     title:'',
            // });
            this.$store.commit('pageFromFullPath',from.fullPath?from.fullPath:null);

            if (from && from.meta.rank != to.meta.rank)
            {
                this.transitionName = to.meta.rank < from.meta.rank ? 'slide-right' : 'slide-left';
            }
            else
            {
                this.transitionName = '';
            }

            //一旦路由发生变化，就无脑关闭messageBox
            this.$MessageBox.close();
        }
    },
    beforeCreate:function(){
        console.log('App.vue.beforeCreate',arguments);
        this.$store.dispatch('get_my_detail').then(hResult=>{
        });
    },
    created:function(){
        console.log('App.vue.created',arguments);
        this.$store.commit('routerInit',this.$router);
    },
}
</script>

<style>
* {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box
}
body {
    color: #2c3e50;
    background-color: #f4f4f4;
    width: 750px;
    font-size: 29px;
    margin: 0 auto!important;
    /*padding-bottom: 103px;*/
    text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    font-family: PingFangSC-Light,'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
a{
    color: #313131;
    text-decoration: none;
}
div, ul, li {
    margin: 0;
    padding: 0;
}
ul, li {
    list-style: none outside none;
}
.transit-view{
    width:750px;
    transition: all 0.1s cubic-bezier(.25,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(50px, 0);
    transform: translate(50px, 0);
}
.slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-50px, 0);
    transform: translate(-50px, 0);
}
</style>
