import { arrayMetods } from "./array"
import Dep from './dep'

class Observer {
  constructor(value) {
    this.dep = new Dep() // 给整个对象增加dep
    // 判断一个数据是否被观测过
    Object.defineProperty(value, '__ob__', {
      enumerable: false, // 不能被枚举
      configurable: false,
      value: this
    })
    // value.__ob__ = this 不能这样写，因为会不断调用defineReactive， 陷入死循环
    // 为了性能考虑，对数组的监听进行改写
    if (Array.isArray(value)) {
      // 函数劫持、切片编程
      value.__proto__ = arrayMetods
      this.observeArray(value)
      return
    }
    this.walk(value)
  }
  walk(data) {
    let keys = Object.keys(data)
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
  observeArray(value) {
    value.forEach(item => {
      observe(item)
    })
  }
}
function defineReactive(data, key, value) {
  // 获取到数组对应的dep
  let childDep = observe(value) // 如果数组或者对象被直接访问， 那么得到的就是Observer的实例
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) { // 说明正在渲染页面
        dep.depend()
        if (childDep) {
          childDep.dep.depend()
        }
      }
      return value
    },
    set(newValue) {
      if (newValue === value) return
      observe(newValue)
      value = newValue

      dep.notify() // 异步操作，防止频繁操作
    }
  })
}
export function observe(data) {
  if(typeof data !== 'object' || data === null) {
    return
  }
  if (data.__ob__) {
    return
  }
  return new Observer(data)
}