class Observer {
  constructor(value) {
    this.walk(value)
  }
  walk(data) {
    let keys = Object.keys(data)
    keys.forEach(key => {
      defineReactive(data, key, data[key])
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
      console.log('获取')
      return value
    }
  })
}
export function observe(data) {
  if(typeof data !== 'object' || data === null) {
    return
  }
  return new Observer(data)
}