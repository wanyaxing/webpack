let number_format = require('locutus/php/strings/number_format')

let vue_number_format = function(number, decimals=2, decPoint, thousandsSep)
{
    let number2 = number_format(number, decimals, decPoint, thousandsSep);
    number2 = number2.replace(/\.0*$/g,'');
    return number2;
}
export default {
  install: function(Vue) {
    Object.defineProperty(Vue.prototype, '$number_format', { value: vue_number_format });
  }
}
