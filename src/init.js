import { initState } from "./state"
import { compileToFunctions } from "./compiler/index"
import { mountComponent } from "./lifecycle"

export function initMixin(Vue){
  Vue.prototype._init = function(options) {
    const vm = this
    vm.$options = options
    initState(vm)
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
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