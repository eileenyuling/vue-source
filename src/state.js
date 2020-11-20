import { observe } from "./observer/index"
import Watcher from "./observer/watcher"
import { nextTick } from './utils'

export function initState(vm) {
  const opts = vm.$options
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}
function proxy(vm, data, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key]
    },
    set(newValue) {
      vm[data][key] = newValue
    }
  })
}
function initProps(){}
function initMethods(){}
function initData(vm){
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  observe(data)
}
function initComputed(){}
function initWatch(vm){
  let watch = vm.$options.watch
  for (let key in watch) {
    const handler = watch[key] // 可能是数组、字符串、对象、函数
    if(Array.isArray(handler)) {
      handler.forEach(handle => {
        createWatcher(vm, key, handle)
      })
    } else {
      createWatcher(vm, key, handler) // 字符串、对象、函数
    }
  }
}
function createWatcher(vm, exprOrFn, handler, options={}) { // options标识是否用户watcehr
  if (typeof handler === 'object') {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler] // 将实例方法作为handler
  }
  return vm.$watch(exprOrFn, handler, options)
}
export function stateMixin(Vue) {
  Vue.prototype.$nextTick = nextTick
  Vue.prototype.$watch = function(exprOrFn, cb, options) {
    new Watcher(this, exprOrFn, cb, {...options, user: true})
    if (options.immediate) {
      cb()
    }
  }
}
