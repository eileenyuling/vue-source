let id = 0
class Dep {
  constructor() {
    this.subs = []
    this.id = id++
  }
  depend() {
    // 希望wathcer可以存dep
    Dep.target.addDep(this)
    // this.subs.push(Dep.target)
  }
  notify() {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
}
Dep.target = null
export function pushTarget(watcher) {
  Dep.target = watcher
}
export function popTarget() {
  Dep.target = null
}
export default Dep