export function patch(oldVnode, vnode) {
  // 将虚拟节点转换成真实节点
  let el = createEl(vnode)
  let parentElm = oldVnode.parentNode
  parentElm.insertBefore(el, oldVnode.nextSibling)
  parentElm.removeChild(oldVnode)
  return el
}

function createEl(vnode) {
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

function updateProperties(vnode) {
  let el = vnode.el
  let newProps = vnode.data || {}
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