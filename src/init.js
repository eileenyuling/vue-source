import { initState } from "./state"
import { compileToFunctions } from "./compiler/index"
import { mountComponent, callHook } from "./lifecycle"
import { mergeOptions } from "./utils"

// 全局组件 和 局部组件 的区别？？？？？？
export function initMixin(Vue){
  Vue.prototype._init = function(options) {
    const vm = this
    // vm.$options = options
    vm.$options = mergeOptions(vm.constructor.options, options)
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    vm.$el = el
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      const render = compileToFunctions(template)
      options.render = render
    }

    // 需要挂载组建
    mountComponent(vm, el)
  }
}