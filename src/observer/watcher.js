import { popTarget, pushTarget } from "./dep"
import { nextTick } from '../utils'
let id = 0
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.cb = cb
    this.options = options
    this.id = id
    this.deps = [] // watcher记录dep
    this.depsId = new Set()
    this.user = options.user
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else {
      this.getter = () => {
        let obj = vm
        let path = exprOrFn.split('.')
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]]
        }
        return obj
      }
    }
    this.value = this.get()
  }
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }
  get() {
    pushTarget(this)
    let result = this.getter()
    popTarget()
    return result
  }
  run() {
    let newValue = this.get()
    let oldValue = this.value
    if (this.user) {
      console.log('run')
      this.cb.call(this.vm, newValue, oldValue)
    }
    this.value = newValue
  }
  update() {
    // 批量更新
    queueWatcher(this)
    // this.get()
  }
}
let queue = []
let has = {}
let pending = false

function flushSchedulerQueue() {
  queue.forEach(watcher => {
    watcher.run()
    if (!watcher.user) {
      watcher.cb()
    }
  })
  queue = []
  has = {}
  pending = false
}
function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
  }
  if (!pending) {
    // nextTick()
    nextTick(flushSchedulerQueue)
    // setTimeout(() => {

    // }, 0)
    pending = true
  }
}
export default Watcher
// 1、把watcher放到Dep.target
// 2、 开始渲染 取值调用get方法
