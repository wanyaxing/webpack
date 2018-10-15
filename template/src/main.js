// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import hao_connect from './lib/HaoConnect/index.js'
Vue.use(hao_connect)

import vModelPlus from './lib/v-model-plus/index.js'
Vue.use(vModelPlus)


import routerThen from 'vue-router-then';
routerThen.initRouter(router)
Vue.use(routerThen)

import Vuex from 'vuex'
Vue.use(Vuex)

import store from './store/initStore.js'

import Loadmore from 'mint-ui/lib/Loadmore'
import Switch from 'mint-ui/lib/switch'
import 'mint-ui/lib/switch/style.css'
import 'mint-ui/lib/loadmore/style.css'
import '@/lib/mint-ui-plus/mint-ui.css'
Vue.component(Switch.name, Switch)
Vue.component(Loadmore.name, Loadmore)

import CheckboxRadio from 'vue-checkbox-radio';
Vue.use(CheckboxRadio);


import LoadMoreAllLoaded from '@/components/LoadMoreAllLoaded.vue'
Vue.component(LoadMoreAllLoaded.name, LoadMoreAllLoaded)

import messagebox from './lib/mint-ui-plus/messageboxInstall.js'
Vue.use(messagebox)

import W2Time from './lib/W2SDK/W2Time.js'
Vue.use(W2Time)


import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer,{
  defaultOptions: {
    // 'button': false,
    'title': false,
    // 'navbar': false,
    'toolbar': false,
  }
})



import '@/lib/utility/index.css'
import utility from './lib/utility/index.js';
Vue.use(utility);

Vue.config.productionTip = false;

Vue.mixin({
    /*初始化组件时，触发pageenter方法*/
    mounted:function(){
       if (this.pageenter)
       {
           this.pageenter();
       }
    },
    // /*从其他组件返回激活当前组件时（通常是keep-alive保留的缓存），根据快照配置是否改动决定是否触发pageenter方法或更新页面标题*/
    activated:function(){
       if (this.pageenter)
       {
           // this.pageenter();
           console.log('this._locationSearch',this._locationSearch);
           if (this._locationSearch != window.location.search)
           {//如果路由发生变化，则重新初始化页面数据；
                this.pageenter();
           }
           else if (this._payload)
           {
                this.$store.dispatch('pageUpdate',this._payload);
           }
       }
    },
    /*在同一组件中，切换路由（参数变化）时，先触发pageleave再触发pageenter*/
    beforeRouteUpdate:function(to, from, next){
        console.log('this.pageenter',this.pageenter);
        if (this.pageleave)
        {
            this.pageleave();
        }
        if (this.pageenter)
        {
            this.$nextTick(()=>{
                this.pageenter();
            });
        }
        next();
    },
    // beforeRouteEnter:function(to, from, next){
    //     console.log('.route.beforeRouteEnter',this,to, from, next);
    //     // next();
    //     next(
    //         vm => {
    //             if (vm.pageenter)
    //             {
    //                 vm.pageenter();
    //             }
    //     });
    // },
    beforeRouteLeave:function(to, from, next){
        console.log('.route.beforeRouteLeave',this,to, from, next);
        if (this.pageleave)
        {
            this.pageleave();
        }
        if (from && from.meta.rank && to.meta.rank && from.meta.rank>to.meta.rank)
        {//如果返回上一层，则摧毁本层缓存。
            if (this.$vnode && this.$vnode.data.keepAlive)
            {
                if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache)
                {
                    if (this.$vnode.componentOptions)
                    {
                        var key = this.$vnode.key == null
                                    ? this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
                                    : this.$vnode.key;
                        var cache = this.$vnode.parent.componentInstance.cache;
                        var keys  = this.$vnode.parent.componentInstance.keys;
                        if (cache[key])
                        {
                            if (keys.length) {
                                var index = keys.indexOf(key);
                                if (index > -1) {
                                    keys.splice(index, 1);
                                }
                            }
                            delete cache[key];
                        }
                    }
                }
            }
            this.$destroy();
        }
        else
        {
            //离开组件前保存配置快照
            this._locationSearch = window.location.search;
            if (this.$store.state.page.payload)
            {
                this._payload = this.$store.state.page.payload;
            }
        }
        next();
    },
    /*组件销毁时，触发pageleave*/
    // destroyed:function(){
    //     if (this.pageleave)
    //     {
    //         this.pageleave();
    //     }
    // },
    /*离开当前组件（当前组件未销毁被缓存）时，触发pageleave*/
    // deactivated:function(){
    //     if (this.pageleave)
    //     {
    //         this.pageleave();
    //     }
    // },
});


/*debug 生命周期*/
if (process.env.NODE_ENV === 'development' )
{
    Vue.mixin({
        beforeCreate:function(){
            console.log(this.$options.name + '.beforeCreate');
        },
        created:function(){
            console.log(this.$options.name + '.created');
        },
        beforeMount:function(){
            console.log(this.$options.name + '.beforeMount');
        },
        mounted:function(){
            console.log(this.$options.name + '.mounted');
        },
        beforeUpdate:function(){
            if (this.$options.name!='HomeTopBar' && this.$options.name!='RouterLink')
            {
                console.log(this.$options.name + '.beforeUpdate');
            }
        },
        updated:function(){
            if (this.$options.name!='HomeTopBar' && this.$options.name!='RouterLink')
            {
                console.log(this.$options.name + '.updated');
            }
        },
        activated:function(){
            console.log(this.$options.name + '.activated');
        },
        deactivated:function(){
            console.log(this.$options.name + '.deactivated');
        },
        beforeDestroy:function(){
            console.log(this.$options.name + '.beforeDestroy');
        },
        destroyed:function(){
            console.log(this.$options.name + '.destroyed');
        },
        beforeRouteEnter:function(to, from, next){
            console.log('.route.beforeRouteEnter',this,to, from, next);
            // next();
            next(
                vm => {
                // 通过 `vm` 访问组件实例
                console.log(vm.$options.name + '.route.beforeRouteEnter.next()');
            });
        },
        beforeRouteUpdate:function(to, from, next){
            console.log(this.$options.name + '.route.beforeRouteUpdate',this,to, from, next);
            console.log(this.$route);
            next();
        },
        beforeRouteLeave:function(to, from, next){
            console.log(this.$options.name + '.route.beforeRouteLeave',this,to, from, next);
            next();
        },
    });
}

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
