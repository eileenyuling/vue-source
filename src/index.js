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
export default Vue