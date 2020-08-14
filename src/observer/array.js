let oldArrayProtoMethods = Array.prototype
export let arrayMetods = Object.create(oldArrayProtoMethods)
let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
]
methods.forEach(method => {
  arrayMetods[method] = function(...args) {
    const result = oldArrayProtoMethods[method].apply(this, args)
    let inserted
    const ob = this.__ob__
    switch(key) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice': // vue.$set原理， 后面讲
        inserted = args.slice(2)
        break
      default:
        break
    }
    if (inserted) {
      ob.observeArray(inserted)
    }
    return result
  }
})