import HaoConnect from './HaoConnect.js'

export default {
  install: function(Vue) {
    Object.defineProperty(Vue.prototype, '$haoconnect', { value: HaoConnect });
  }
}
