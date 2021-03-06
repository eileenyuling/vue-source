const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        key = key ? key.trim() : key
        value = value ? value.trim() : value
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}
function genChildren(el) {
  const children = el.children
  if (children) {
    return children.map(child => gen(child)).join(',')
  }
}
function gen(node) {
  if (node.type === 1) { // 元素
    return generate(node)
  } else { // 文本
    let text = node.text
    // 若是普通文本
    if(!defaultTagRE.test(text)) {
      return `_v("${text}")`
    }
    let tokens = []
    let lastIndex = defaultTagRE.lastIndex = 0
    let match, index = 0
    while(match = defaultTagRE.exec(text)) {
      index = match.index
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
      text = text.slice(lastIndex)
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})`
  }
}
export function generate(el) {
  let children = genChildren(el)
  let code = `_c("${el.tag}",${el.attrs.length ? genProps(el.attrs) : undefined}${children ? `,${children}` : ''})`
  return code
}