import { popTarget, pushTarget } from "./dep"

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
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    }
    this.get()
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
    this.getter()
    popTarget()
  }
  update() {
    this.get()
  }
}
export default Watcher
// 1、把watcher放到Dep.target
// 2、 开始渲染 取值调用get方法
