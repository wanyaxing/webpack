import HaoConnect from './HaoConnect.js'
import HaoTemp from './HaoTemp.js'

export default {
    install: function(Vue) {
        Object.defineProperty(Vue.prototype, '$haoconnect', { value: HaoConnect });

        Vue.component(HaoTemp.name, HaoTemp);


        Vue.mixin({
            // 在路由跳转到下一个页面之前，尝试清理残留的无用数据的引用
            beforeRouteEnter: function beforeRouteEnter(to, from, next) {
                HaoConnect.dropCaches();
                next();
            }
        });
    }
}
