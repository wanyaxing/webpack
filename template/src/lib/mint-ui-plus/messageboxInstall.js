import MessageBox from 'mint-ui/lib/message-box';

MessageBox.setDefaults({
    title: ''
});

export default {
  install: function(Vue) {
    Object.defineProperty(Vue.prototype, '$MessageBox', { value: MessageBox });
  }
}
