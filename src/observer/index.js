import { arrayMetods } from "./array"

class Observer {
  constructor(value) {
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
  observe(value)
  Object.defineProperty(data, key, {
    set(newValue) {
      if (newValue === value) return
      observe(newValue)
      value = newValue
    },
    get() {
      return value
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