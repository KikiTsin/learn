下面这段简单的JSX代码，在项目中配置好.babelrc后，再执行后 npx babel index.jsx -w -o index.js后就会转译成常见的js代码。

```javascript
// .babelrc
{
    "presets": ["@babel/preset-react"]
}
// jsx start...
function formatName(user) {
    return user.firstName + ' ' + user.lastName;
}
let user = {
    firstName: 'Harper',
    lastName: 'Perez'
};
let code = (
    <h1>
        Hello, {formatName(user)}!
    </h1>
);
// transformed js...
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}
let user = {
  firstName: 'Harper',
  lastName: 'Perez'
};
let code = /*#__PURE__*/React.createElement("h1", null, "Hello, ", formatName(user), "!");
```
从babel官网中，我们得知@babel/preset-react预设包含了 @babel/plugin-syntax-jsx、@babel/plugin-transform-react-jsx、@babel/plugin-transform-react-display-name三个插件，其中，@babel/plugin-syntax-jsx给解析参数parserOpts中增加了plugins: ['jsx']，使babel在parse过程中对JSX语法进行识别；@babel/plugin-transform-react-jsx主要是对初步生成好的AST进行transform，比如将‘(<h1>hello,{formatName(user)}!</h1>)’生成的AST转换成'React.createElement(*****)'相应的AST。接下来会逐步介绍其中的过程。

这段在@babel/core/lib/transformation/index.js的run函数 展示了这次转换的主体过程：

```javscript
function* run(config, code, ast) {
  // parse解析
  // (0, _normalizeOpts.default)(config) 这里会得知parserOpts解析参数，增加了plugins:['jsx']
  const file = yield* (0, _normalizeFile.default)(config.passes, (0, _normalizeOpts.default)(config), code, ast);
  const opts = file.opts;

  // transform转换
  try {
    yield* transformFile(file, config.passes);
  } catch (e) {
  }


  let outputCode, outputMap;

  // generate生成最终代码的过程
  try {
    if (opts.code !== false) {
      ({
        outputCode,
        outputMap
      } = (0, _generate.default)(config.passes, file));
    }
  } catch (e) {
  }


  return {
    metadata: file.metadata,
    options: opts,
    ast: opts.ast === true ? file.ast : null,
    code: outputCode === undefined ? null : outputCode,
    map: outputMap === undefined ? null : outputMap,
    sourceType: file.ast.program.sourceType
  };
}
```

@babel/plugin-transform-react-jsx 
这个插件主要是在create-plugin.js文件中生成的。利用babel插件机制，在遍历每个AST节点的时候，都会访问visitor函数，所以在该插件中，注册特定AST节点的enter、exit处理函数

```javascript
{
      name,
      inherits: _pluginSyntaxJsx.default,
      visitor: {
        Program: {
          enter(path, state) {
            // file对象是什么呢？请看下图
            const {
              file
            } = state;
            // runtime---> 'classic'
            let runtime = RUNTIME_DEFAULT;
            let source = IMPORT_SOURCE_DEFAULT;
            // React.createElement
            let pragma = PRAGMA_DEFAULT;
            let pragmaFrag = PRAGMA_FRAG_DEFAULT;
            let sourceSet = !!options.importSource;
            let pragmaSet = !!options.pragma;
            let pragmaFragSet = !!options.pragmaFrag;
            
            set(state, "runtime", runtime);
            if (runtime === "classic") {
              
              const createElement = toMemberExpression(pragma);
              const fragment = toMemberExpression(pragmaFrag);
              set(state, "id/createElement", () => _core.types.cloneNode(createElement));
              set(state, "id/fragment", () => _core.types.cloneNode(fragment));
              set(state, "defaultPure", pragma === DEFAULT.pragma);
            }
          }
        },
        // ...
      }
    }
```
在看上述代码之前，先来看一下babel转化出来的AST节点，最外层是File对象，主要关注点在ast属性值里的program对象，这里描述了节点类型、代码所在的起始终止的位置、注释、以及body内的子节点等内容。
[file](./jsx-images/file.png)
[createElement](./jsx-images/createElement.png)
[body1](./jsx-images/body1--第一个声明体.png)
[body2](./jsx-images/body2---第二个声明体.png)
[jsx-total](./jsx-images/JSX-total.png)
[jsx-init](./jsx-images/JSX-%20init%20openingElement.png)
[jsxExpressionContainer](./jsx-images/JSXExpressionContainer.png)
[jsxText](./jsx-images/JSXText.png)
[elements](./jsx-images/elements.png)
[callExpr--替换后的](./jsx-images/callExpr---React.createElement.png)

了解了代码的主体AST结构后，来分析program的enter函数了做了什么事情？ 其实主要是标记runtime运行时的模式为classic，以及生成React.createElement的AST节点，保存在state中，以便后续使用。下图就是React.createElement的描述信息：

接下来到了transform转换过程。在JSXElement节点类型exti函数内触发：

```javascript
   JSXElement: {
        exit(path, file) {
            let callExpr;
            // ...省略若干代码
            // 生成最新节点
            callExpr = buildCreateElementCall(path, file);
            // ...省略若干代码
            // 替换原有节点
            path.replaceWith(_core.types.inherits(callExpr, path.node));
          }
        }
        
function buildCreateElementCall(path, file) { 
    const openingPath = path.get("openingElement"); 
    // getTag(openingPath)---> returns h1节点
    return call(file, "createElement", [getTag(openingPath), buildCreateElementOpeningElementAttributes(file, path, openingPath.get("attributes")), ..._core.types.react.buildChildren(path.node)]); 
} 
// _core.types.react.buildChildren 对应下述函数，生成elements数组, 见下图
// 其实就是将之前JSXElement里的JSXText JSXExpressionContainer信息提取出来
// types/lib/builders/react/buildChildren.js 
function buildChildren(node) { 
    const elements = []; 
    for (let i = 0; i < node.children.length; i++) { 
        let child = node.children[i]; 
        if ((0, _generated.isJSXText)(child)) { 
            (0, _cleanJSXElementLiteralChild.default)(child, elements); 
            continue; 
        } 
        if ((0, _generated.isJSXExpressionContainer)(child)) child = child.expression; 
        if ((0, _generated.isJSXEmptyExpression)(child)) continue; 
        elements.push(child); 
    } 
    return elements; 
} 
```

最终生成的React.createElement节点信息，这里也增加了leadingComments前置注释信息：/*#__PURE__*/，来替换掉原有的节点信息。那么最终在babel的generate环节，就会生成相应的js代码：/*#__PURE__*/React.createElement("h1", null, "Hello, ", formatName(user), "!");

Babel generate生成代码环节，即针对不同的AST节点信息，采用相应的处理函数。比如通过node.type来获取节点类型program，获取到提前声明好的program处理函数。对于AST抽象语法树这样的数据接口，采取深度优先遍历。采用递归或者循环的方式。如果AST层级过深，那递归层次也会过深，可能栈溢出，所以可以加一个数组（作为栈）来记录接下来要遍历 AST，这样就可以变成循环了。
以下是babel generator中的主要处理函数：

```javascript
print(node, parent) { 
    if (!node) return; 
    // 这里获取 每种ast节点相应的处理方式 
    const printMethod = this[node.type]; 
    // ... 省略代码 
    // 通过循环的方式，维护一个数组，进行处理 
    this._printStack.push(node); 
    // ... 省略代码 
    this.withSource("start", loc, () => { 
        printMethod.call(this, node, parent); 
    }); 
    // ... 省略代码 
    if (shouldPrintParens) this.token(")"); 
    this._printStack.pop(); 
} 
```