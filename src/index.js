import { initMixin } from "./init.js"
import { lifecycleMixin } from "./lifecycle.js"
import { renderMixin } from "./vdom/index.js"
import { initGlobalAPI } from "./global-api/index.js"
import { stateMixin } from "./state"
function Vue(options) {
  this._init(options)
}
initMixin(Vue)
initGlobalAPI(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
stateMixin(Vue)

import { compileToFunctions } from './compiler/index'
import {createEl, patch} from './vdom/patch'
let el1 = `<div id="app" style="color: red;" class="a">
  <div key="1">1</div>
  <div key="2">2</div>
  <div key="3">3</div>
  <div key="4">4</div>
  <div key="5">5</div>
</div>`
let el2 = `<div id="app1" style="background: red;" class="b">
  <div key="9">9</div>
  <div key="8">8</div>
  <div key="1">1</div>
  <div key="5">5</div>
  <div key="4">4</div>
  <div key="3">3</div>
  <div key="2">2</div>
  <div key="7">7</div>
</div>`

let vm1 = new Vue({
  data: {
    name: '1111'
  }
})
let render1 = compileToFunctions(el1)
let vnode1 = render1.call(vm1)
console.log(vnode1)
document.body.appendChild(createEl(vnode1))
let vm2 = new Vue({
  data: {
    name: '2222'
  }
})
let render2 = compileToFunctions(el2)
let vnode2 = render2.call(vm2)
setTimeout(() => {
  patch(vnode1, vnode2)
}, 2000)

export default Vue