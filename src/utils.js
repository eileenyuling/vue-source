export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]
const strats = {}
strats.data = function(parentValue, childValue) {
  return childValue // 此处应有合并策略
}
strats.computed = function() {

}
strats.watch = function(parentValue, childValuevalue) {
  return childValuevalue
}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
function mergeHook(parentValue, childValue) {
  if (parentValue) {
    return childValue ? parentValue.concat(childValue) : parentValue
  } else {
    return Array.isArray(childValue) ? childValue : [childValue]
  }
}
export function mergeOptions(parent, child) {
  const options = {}
  // parent有
  for (let key in parent) {
    mergeFiled(key)
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeFiled(key)
    }
  }

  function mergeFiled(key) {
    if(strats[key]) {
      options[key] = strats[key](parent[key], child[key])
    } else {
      options[key] = child[key]
    }
  }
  return options
}

let pending = false
const callbacks = []
function flushCallbacks() {
  while (callbacks.length) {
    let cb = callbacks.pop()
    cb()
  }
  pending = false
}
let timerFunc
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else
if (MutationObserver) {
  let observe = new MutationObserver(flushCallbacks)
  let textNode = document.createTextNode(1)
  observe.observe(textNode, {characterData: true})
  timerFunc = () => {
    setTimeout(() => {
      textNode.textContent = 2
    }, 2000);

  }
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  }
}
export function nextTick(cb) {
  callbacks.push(cb)
  // vue3 nextTick就是 promise.then， 没有做兼容性处理
  if (!pending) {
    timerFunc()
    pending = true
  }
}