/*
v-model.range.focus="item.fee"  min=1 max=100

.focus 表示仅当输入框激活时才生效。（可防止多个range互动）

 */
export default {
    install: function(Vue) {
        // function that gets the min and max values for the element and prevents the value of the model from going below the min or above the max
        function bindNumberInRange(el, binding, vnode) {
            let model = binding.expression;
            let min = parseFloat(el.min);
            let max = parseFloat(el.max);
            let val = parseFloat(binding.value);
            let newValue = null;
            let isEdge = false;

            if ((min !== NaN) && (min >= val)) {
                // vnode.context[model] = min;
                isEdge = true;
                newValue = min;
            } else if ((max !== NaN) && (max <= val)) {
                // vnode.context[model] = max;
                isEdge = true;
                newValue = max;
            }
            if (isEdge && ( (binding.modifiers.focus && document.activeElement==el) || (!binding.modifiers.focus) ))
            {
                el.value = newValue;
                const e = document.createEvent('HTMLEvents');
                // e.initEvent(binding.modifiers.lazy?'change':'input', true, true);
                e.initEvent('input', true, true);
                el.dispatchEvent(e);
            }


        }

        // get the original reference to the v-model directive
        let modelDirective = Vue.directive('model')
        console.log('modelDirective',modelDirective);

        // set a new definition of the v-model directive
        Vue.directive('model', {
            bind: function(el, binding, vnode) {
                if (binding.modifiers.range) {
                    bindNumberInRange(el, binding, vnode)
                }
                // first fire the original v-model bind hook
                if (modelDirective.bind)
                {
                    modelDirective.bind(el, binding, vnode);
                }
            },
            inserted: function(el, binding, vnode) {
                if (modelDirective.inserted)
                {
                    modelDirective.inserted(el, binding, vnode);
                }
            },
            update: function(el, binding, vnode) {
                if (modelDirective.update)
                {
                    modelDirective.update(el, binding, vnode);
                }
            },
            unbind: function(el, binding, vnode) {
                if (modelDirective.unbind)
                {
                    modelDirective.unbind(el, binding, vnode);
                }
            },
            componentUpdated: function(el, binding, vnode) {
                if (binding.modifiers.range) {
                    bindNumberInRange(el, binding, vnode)
                }
                // first fire the original v-model componentUpdated hook
                if (modelDirective.componentUpdated)
                {
                    modelDirective.componentUpdated(el, binding, vnode);
                }
            }
        })
    }
}
