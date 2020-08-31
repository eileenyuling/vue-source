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
strats.data = function() {

}
strats.computed = function() {

}
strats.watch = function() {

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