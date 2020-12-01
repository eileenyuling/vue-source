export function patch(oldVnode, vnode) {
  // 比对老的虚拟节点和新的虚拟节点，将不同的地方更新
  // 将虚拟节点转换成真实节点
  if (oldVnode.nodeType === 1) {
    let el = createEl(vnode)
    let parentElm = oldVnode.parentNode
    parentElm.insertBefore(el, oldVnode.nextSibling)
    parentElm.removeChild(oldVnode)
    return el
  } else {
    if (oldVnode.tag !== vnode.tag) { // tag不一样，直接替换
      oldVnode.el.parentNode.replaceChild(createEl(vnode))
      return
    }
    if (!oldVnode.tag) { // 文本
      if (oldVnode.text !== vnode.text) {
        oldVnode.el.textContent = vnode.text
      }
      return
    }
    // 标签名一样， 复用
    let el = vnode.el = oldVnode.el // 复用老节点
    updateProperties(vnode, oldVnode.data)
    // 比较子元素
    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []
    if (oldChildren.length > 0 && newChildren.length > 0) {
      updateChildren(oldChildren, newChildren, el)
    } else if (oldChildren.length > 0) {
      el.innerHTML = ''
    } else if (newChildren.length > 0){
      for (let i = 0; i<newChildren.length; i++) {
        el.appendChild(createEl(newChildren[i]))
      }
    }
  }

}

export function createEl(vnode) {
  let { tag, data, key, children, text } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach(child => {
      vnode.el.appendChild(createEl(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

function updateProperties(vnode, oldProps={}) {
  let newProps = vnode.data || {}
  let el = vnode.el
  // 老的有新的没有，删除属性
  // 新的有，更新
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }

  //  样式处理
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}
function makeIndexByKey(children) {
  let map = {}
  children.forEach((item, index) => {
    if (item.key) {
      map[item.key] = index
    }
  })
  return map
}


function updateChildren(oldChildren, newChildren, parent) {
  // diff算法很多优化
  // vue2中采用双指针的方式
  // 在尾部添加
  let oldStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let oldStartVnode = oldChildren[oldStartIndex]
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newEndIndex = newChildren.length - 1
  let newStartVnode = newChildren[newStartIndex]
  let newEndVnode = newChildren[newEndIndex]
  let map = makeIndexByKey(oldChildren)
  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex]
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[++oldEndIndex]
    }
    else if (isSameVNode(oldStartVnode, newStartVnode)) {
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVNode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVNode(oldStartVnode, newEndVnode)) {
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVNode(oldEndVnode, newStartVnode)) {
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else {
      // 暴力比对
      let moveIndex = map[newStartVnode.key]
      if (moveIndex === undefined) {
        parent.insertBefore(createEl(newStartVnode), oldStartVnode.el)
      } else {
        let moveVnode = oldChildren[moveIndex]
        oldChildren[moveIndex] = null
        patch(moveVnode, newStartVnode)
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
      }
      newStartVnode = newChildren[++newStartIndex]
    }
  }
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // parent.appendChild(createEl(newChildren[i]))
      let ele = newChildren[newEndIndex + 1] ? newChildren[newEndIndex + 1].el : null
      parent.insertBefore(createEl(newChildren[i]), ele)
    }
  }
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i]
      if (child) {
        parent.removeChild(child.el)
      }
    }
  }
}

function isSameVNode(oldNode, newNode) {
  return oldNode.tag === newNode.tag && oldNode.key === newNode.key
}