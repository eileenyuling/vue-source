import { parseHTML } from "./parse";
import { generate } from "./generate";

export function compileToFunctions(template) {
  // html模版 => render函数
  // 1、将html模板转换成ast语法树， 可以用ast树来描述语言本身
  // 2、通过这棵树重新生成代码
  let ast = parseHTML(template) // TODO 没有处理自闭合标签 如<img />
  // 2、优化静态节点
  // 3、通过这棵树，重新生成代码
  let code = generate(ast)
  let render = new Function(`with(this){return ${code}}`)
  return render
}