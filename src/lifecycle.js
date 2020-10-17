import { patch } from "./vdom/patch"
import Watcher from "./observer/watcher"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this
    vm.$el = patch(vm.$el, vnode)
  }
}
export function mountComponent(vm, el) {
  callHook(vm, 'beforeMount')
  // 调用render方法，调用虚拟节点，再将虚拟节点渲染到页面上
  // vm._update(vm._render())
  function updateComponent() {
    vm._update(vm._render())
  }
  new Watcher(vm, updateComponent, () => {
    callHook(vm, 'updated')
  }, true)
  callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0; i< handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}