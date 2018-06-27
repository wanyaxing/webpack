import Vue                 from 'vue'
import Router              from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        else if (to.hash)
        {
            return {
                selector: to.hash
            }
        }
        else
        {
            return { x: 0, y: 0 }
        }
    },
    routes: [
        {   path: '/', redirect:'/hello', },
        {   path: '/hello',                      meta:{rank:1.5,isShowFooter:true},component:  resolve => require(['@/components/HelloWorld.vue'], resolve),                                  },
        {   path: '/list',                       meta:{rank:1.5,isShowFooter:true},component:  resolve => require(['@/components/HelloWorld.vue'], resolve),                                  },
        {   path: '/wode',                       meta:{rank:1.5,isShowFooter:true},component:  resolve => require(['@/components/wode/index/IndexWodeHome.vue'], resolve),                                  },
        {   path: '/wode/user_info',             meta:{rank:2.5,isShowFooter:true},component:  resolve => require(['@/components/wode/user_info/InitUserInfo.vue'], resolve),                                  },
        {   path: '/wode/change_telephone',      meta:{rank:3.5,isShowFooter:true},component:  resolve => require(['@/components/wode/change_telephone/InitChangeTelephone.vue'], resolve),                                  },
        {   path: '*',                           meta:{rank:9999,},              component:  resolve => require(['@/components/NotFoundComponent.vue'], resolve),}
    ]
})
