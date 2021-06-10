疑问：
- rollup.config.js 里返回的是一个array[config] ??? 还可以接受数组？？ 
- TODO: createApp defineComponent
- effect 
- ShapeFlags patchFlag代表什么， 1<< 2 enum代表什么？
- .d.ts声明文件如何做的？.ts里也有一些declare module
- watcher deps等没看到，再看下proxy has set get方法
- 有很多个proxy，具体看看怎么用的



命令行：
- dev
- build
- serve
- release

## packages/vue
主要是依赖@vue/compiler-dom @vue/runtime-dom两个包，返回了如下代码所示，跟vue2.**系列一样又不一样，compile编译函数，都是通过baseCompile parse generate生成code ast map等信息，但是parse transform generate里的逻辑不一样了

```javascript
export { compileToFunction as compile }
export * from '@vue/runtime-dom'

// (function anonymous(
// ) {
// const _Vue = Vue
// const { createVNode: _createVNode, createCommentVNode: _createCommentVNode } = _Vue

// const _hoisted_1 = /*#__PURE__*/_createVNode("h1", null, "Latest Vue.js Commits", -1 /* HOISTED */)

// return function render(_ctx, _cache) {
//   with (_ctx) {
//     const { createVNode: _createVNode, createCommentVNode: _createCommentVNode, toDisplayString: _toDisplayString, Fragment: _Fragment, openBlock: _openBlock, createBlock: _createBlock } = _Vue

//     return (_openBlock(), _createBlock(_Fragment, null, [
//       _hoisted_1,
//       _createCommentVNode(" <template v-for=\"branch in branches\">\n    <input type=\"radio\"\n      :id=\"branch\"\n      :value=\"branch\"\n      name=\"branch\"\n      v-model=\"currentBranch\">\n    <label :for=\"branch\">{{ branch }}</label>\n  </template> "),
//       _createVNode("p", null, "vuejs/vue@" + _toDisplayString(currentBranch), 1 /* TEXT */),
//       _createCommentVNode(" <ul>\n    <li v-for=\"{ html_url, sha, author, commit } in commits\">\n      <a :href=\"html_url\" target=\"_blank\" class=\"commit\">{{ sha.slice(0, 7) }}</a>\n      - <span class=\"message\">{{ truncate(commit.message) }}</span><br>\n      by <span class=\"author\"><a :href=\"author.html_url\" target=\"_blank\">{{ commit.author.name }}</a></span>\n      at <span class=\"date\">{{ formatDate(commit.author.date) }}</span>\n    </li>\n  </ul> ")
//     ], 64 /* STABLE_FRAGMENT */))
//   }
// }
// })

compileToFunction() {
  const { code } = compile(
    template,
    extend(
      {
        hoistStatic: true,
        onError: __DEV__ ? onError : undefined,
        onWarn: __DEV__ ? e => onError(e, true) : NOOP
      } as CompilerOptions,
      options
    )
  )

  const render = (__GLOBAL__
    ? new Function(code)()
    : new Function('Vue', code)(runtimeDom)) as RenderFunction

  return (compileCache[key] = render)
}
```
## packages/compiler-core
baseCompile baseParse ast等核心compiler函数，transforms下有针对vFor vOn vIf vModel的解析方法

###### baseCompile
- const ast = baseParse(template, options)
```javascript
export function baseParse(
  content: string,
  options: ParserOptions = {}
): RootNode {
  // 生成parse context上下文，主要内容{ options: {delimiters: ['{{', '}}']}, source: 'html string', originalSource: 'html string' } 后面解析html成ast，主要是操作context.source
  const context = createParserContext(content, options)
  // 记录初始位置 {line: 0, column:0, offset: 0}
  const start = getCursor(context)
  // 主要是parseChildren解析，在这个函数内，判断html string( context.source---> s)；返回的数据格式是[node {}, node...]
  // parseChildren内部声明了nodes = [];每解析完一个标签 字符，就会nodes.push(node)
  // 1. s[0] 是 <
        // 1.1 s[1] 是!; 有三种情况：注释<!-- 文档<!DOCTYPE <![CDATA[；分别用parseComment parseBogusComment解析
        // 1.2 s[1] 是 /: s[2] > 前进3个字符； s[2] a-z 前进3个字符
        // 1.3 s[1] 是a-z 则表明是element标签，parseElement进行解析
            // parseElement内会 调用parseTag，利用正则匹配出tag， 再次调用parseChildren 生成子节点，并把当前父节点作为ancestor传给 parseChildren,parseChildren 内部调用isEnd函数判断接下来的s字符串是否是父标签的结束标签。
  // 2. s[0]是{{，parseInterpolation，生成动态标签 dynamic
  // 否则就是文本，调用parseText进行解析
  return createRoot(
    parseChildren(context, TextModes.DATA, []),
    getSelection(context, start)
  )
}

// parseTag内不仅解析出了标签，还除了属性 parseAttributes，TODO
```
- transform(ast, { nodeTransforms: [], directiveTransforms: {} })
```javascript
export function transform(root: RootNode, options: TransformOptions) {
  // 生成transform上下文，对象内容包括 helpers: new Map(), help() {}, removeHelper() {}, helperString (name) {} // 把Symbol(createVnode)转成_createVnode
  const context = createTransformContext(root, options)
  // 遍历执行nodeTransforms数组内方法，如果某个方法还返回了 另一个方法（onExit）的话，最后执行一遍onExits
  // TODO 看下nodeTransforms内的函数都做了什么，没找到适用场景？？？
  traverseNode(root, context)
  if (options.hoistStatic) {
    hoistStatic(root, context)
  }
  if (!options.ssr) {
    createRootCodegen(root, context)
  }
  // finalize meta information
  root.helpers = [...context.helpers.keys()]
  root.components = [...context.components]
  root.directives = [...context.directives]
  root.imports = context.imports
  root.hoists = context.hoists
  root.temps = context.temps
  root.cached = context.cached

  if (__COMPAT__) {
    root.filters = [...context.filters!]
  }
}
```
- generate(ast, {})   codegen.ts，返回{ast, code, preamble, map}
```javascript
1. 生成generate上下文，包括{code: '', helper() {}, push() {}, indent() {}, newline() {}}
2. genFunctionPreamble
    push(`const _Vue = ${VueBinding}\n`)
    push(`const { ${staticHelpers} } = _Vue\n`)
3.  const functionName = ssr ? `ssrRender` : `render`
    const args = ssr ? ['_ctx', '_push', '_parent', '_attrs'] : ['_ctx', '_cache']
    push(`function ${functionName}(${signature}) {`)
    ...
      if (useWithBlock) {
        push(`with (_ctx) {`)
        indent()
        // function mode const declarations should be inside with block
        // also they should be renamed to avoid collision with user properties
        if (hasHelpers) {
          push(
            `const { ${ast.helpers
              .map(s => `${helperNameMap[s]}: _${helperNameMap[s]}`)
              .join(', ')} } = _Vue`
          )
          push(`\n`)
          newline()
        }
      }
    ...
    if (ast.codegenNode) {
        // genNode根据node.type判断不同类型，genVNodeCall genText genExpression genInterpolation genComment
        genNode(ast.codegenNode, context)
    } else {
        push(`null`)
    }
```

## packages/compiler-dom
把compiler-core的函数都暴露出去，transform目录下同样有vHtml vModel vOn vShow等函数
export的compile内部调用compiler-core的baseCompile
export的parse内部调用compiler-core的baseParse

## packages/compiler-sfc

## packages/runtime-core
renderer h vnode apiCreateApp apiLifecycle apiWatch等核心运行时函数

- Vue.createApp({ data() {}, created() {}}).mount('#demo')
- createApp 生成app实例（下图）
    - createRenderer
        - baseCreateRenderer，这里有大量的处理/生成节点的函数，包括patch patchElement processFragment processElement mountChildren render等，最终返回了{render, createApp: createAppAPI(render, hydrate)}
- mount 调用：
  - createVnode
  - render(vnode, rootContainer) // vnode就是createVnode创建的，rootContainer是document.querySelector('#demo')；renderer.ts中baseCreateRenderer内声明的函数
      - patch(container._vnode || null, vnode, container, null, null, null, isSVG)
          - 根据vnode.type判断类型，是processText processCommentNode processFragment processComponent 还是processElement
          - 根据type shapeFlag判断出来先走processComponent逻辑：mountComponent
          - mountComponent  renderer.ts
              - 创建instance（见下图）
              - setupComponent(instance)
                  - **component.ts**: setupStatefulComponent
                      - 是否有setup函数；有的话，先执行setup()，setup()返回时一个函数setupResult的话，instance.render=setupResult，那么后续不再执行compile函数；没有的话往下执行
                      - finishComponentSetup: instance.render为null的话，则生成
                      - Component.render = **compile(template, finalCompilerOptions)**，这里compile===**compileToFunction**； 这里Component= instance.type；同时：instance.render = (Component.render || NOOP) as InternalRenderFunction
              - setupRenderEffect(instance,initialVNode,container,anchor,parentSuspense,isSVG,optimized)
                  - instance.update= effect(fn, params), 这其实是一个reactiveEffect构造函数，effect.__isEffect = true; effect.raw = fn; effect.deps = []; effect执行的过程中，effectStack有一次入栈出栈的操作，activeEffect=当前effect
                  - 这里立即执行了fn方法，主要运行render获取vnode，再patch一遍
```javascript
const subTree = (instance.subTree = renderComponentRoot(instance));
    // renderComponentRoot: result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);

```


## packages/runtime-dom
这个包里主要是跟dom操作相关的api；包括createApp, directives: vModel vOn vShow指令，nodeOps, modules: attrs class events style等

###### appcontext
![2a2576f8436c24cf94f8e7154bad1fec.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p10)

###### app
![606c230c679fbc96afe921b039539bf9.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p11)

###### proxy
![a4f4a11bbf6a813dbfa5cb9b11c227ee.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p12)

###### vnode
![6f3b2494b82a0c50db7bc6c80101ec01.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p13)

###### instance
![07f969c1471fd1fd6501c391ed593474.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p14)

###### Context
![4f2a859766813819560b5bc6f22b2574.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p16)

###### AST 
![b54f72296e05649188338a38371a6fd3.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p15)


##### 有意思的代码：
- input输入框，输入法正在输入但是还没确定的时候（比如中文拼音）使用onCompositionStart/ onCompositionEnd区分; Safari < 10.2 & UIWebView 不支持compositionend，采用change补充监听
```javascript
addEventListener(el, lazy ? 'change' : 'input', e => {
      if ((e.target as any).composing) return
      let domValue: string | number = el.value
      if (trim) {
        domValue = domValue.trim()
      } else if (castToNumber) {
        domValue = toNumber(domValue)
      }
      el._assign(domValue)
})
addEventListener(el, 'compositionstart', onCompositionStart)
      addEventListener(el, 'compositionend', onCompositionEnd)
      // Safari < 10.2 & UIWebView doesn't fire compositionend when
      // switching focus before confirming composition choice
      // this also fixes the issue where some browsers e.g. iOS Chrome
      // fires "change" instead of "input" on autocomplete.
      addEventListener(el, 'change', onCompositionEnd)
function onCompositionStart(e: Event) {
  ;(e.target as any).composing = true
}

function onCompositionEnd(e: Event) {
  const target = e.target as any
  if (target.composing) {
    target.composing = false
    trigger(target, 'input')
  }
}

function trigger(el: HTMLElement, type: string) {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}
```
- 语法错误 错误码
```javascript
const error = new SyntaxError(String(msg)) as CompilerError


export const errorMessages: Record<ErrorCodes, string> = {
 [ErrorCodes.ABRUPT_CLOSING_OF_EMPTY_COMMENT]: 'Illegal comment.'
}

export const enum ErrorCodes {
  // parse errors
  ABRUPT_CLOSING_OF_EMPTY_COMMENT
}
```