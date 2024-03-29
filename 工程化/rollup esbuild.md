#### 如何解决以下问题？[plugins](https://github.com/rollup/awesome)
* 代码压缩---terser plugin
* babel转译 ??? 这个后面看下vue3是怎么构建的。。
* cdn---> external 公共库倒也不需要
* 去掉console debugger ---> strip plugin
* publish
* watch: -w
* typescript .d.ts生成：tsconfig.json: declaration:true

#### 使用方式
- rollup.config.js rollup -c
- rollup.rollup()


## rollup

#### amd esm umd cjs iife等区别
* amd – 异步模块定义，用于像RequireJS这样的模块加载器
    ```javascript
    define(function () { 'use strict'; });
    ```
* cjs – CommonJS，适用于 Node 和 Browserify/Webpack
* esm – 将软件包保存为 ES 模块文件，在现代浏览器中可以通过 <script type=module> 标签引入
* iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
* umd – 通用模块定义，以amd，cjs 和 iife 为一体
    ```javascript
    (function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('loadsh')) :
  typeof define === 'function' && define.amd ? define(['loadsh'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.loadsh)); }(this, (function (loadsh) { 'use strict'; //code 
  })));//#sourceMappingURL=index.js.map

    ```
## rollup Plugin
### strip
```javascript
function strip(options = {}) {
  const include = options.include || '**/*.js';
  const { exclude } = options;
  const filter = createFilter(include, exclude);
  const sourceMap = options.sourceMap !== false;

  const removeDebuggerStatements = options.debugger !== false;
  const functions = (options.functions || ['console.*', 'assert.*']).map((keypath) =>
    keypath.replace(/\*/g, '\\w+').replace(/\./g, '\\s*\\.\\s*')
  );

  const labels = options.labels || [];

  const labelsPatterns = labels.map((l) => `${l}\\s*:`);

  const firstPass = [...functions, ...labelsPatterns];
  if (removeDebuggerStatements) {
    firstPass.push('debugger\\b');
  }

  const reFunctions = new RegExp(`^(?:${functions.join('|')})$`);
  const reFirstpass = new RegExp(`\\b(?:${firstPass.join('|')})`);
  const firstPassFilter = firstPass.length > 0 ? (code) => reFirstpass.test(code) : () => false;
  const UNCHANGED = null;

  return {
    name: 'strip',

    transform(code, id) {
      if (!filter(id) || !firstPassFilter(code)) {
        return UNCHANGED;
      }

      let ast;

      try {
        ast = this.parse(code);
      } catch (err) {
        err.message += ` in ${id}`;
        throw err;
      }

      const magicString = new MagicString(code);
      let edited = false;

      function remove(start, end) {
        while (whitespace.test(code[start - 1])) start -= 1;
        magicString.remove(start, end);
      }

      function isBlock(node) {
        return node && (node.type === 'BlockStatement' || node.type === 'Program');
      }

      function removeExpression(node) {
        const { parent } = node;

        if (parent.type === 'ExpressionStatement') {
          removeStatement(parent);
        } else {
          magicString.overwrite(node.start, node.end, '(void 0)');
        }

        edited = true;
      }

      function removeStatement(node) {
        const { parent } = node;

        if (isBlock(parent)) {
          remove(node.start, node.end);
        } else {
          magicString.overwrite(node.start, node.end, '(void 0);');
        }

        edited = true;
      }

      walk(ast, {
        enter(node, parent) {
          Object.defineProperty(node, 'parent', {
            value: parent,
            enumerable: false,
            configurable: true
          });

          if (sourceMap) {
            magicString.addSourcemapLocation(node.start);
            magicString.addSourcemapLocation(node.end);
          }

          if (removeDebuggerStatements && node.type === 'DebuggerStatement') {
            removeStatement(node);
            this.skip();
          } else if (node.type === 'LabeledStatement') {
            if (node.label && labels.includes(node.label.name)) {
              removeStatement(node);
              this.skip();
            }
          } else if (node.type === 'CallExpression') {
            const keypath = flatten(node.callee);
            if (keypath && reFunctions.test(keypath)) {
              removeExpression(node);
              this.skip();
            }
          }
        }
      });

      if (!edited) {
        return UNCHANGED;
      }

      code = magicString.toString();
      const map = sourceMap ? magicString.generateMap() : null;

      return { code, map };
    }
  };
}
```

## esbuild

[why fast](https://esbuild.github.io/faq/#why-is-esbuild-fast)

- 用go编写，并且编译成native code；JS JIT即时编译性能不高；
- go是为并行设计的，而JS不是。GO可以在线程之间共享内存；
- esbuild从零开始，避免了引用第三方库带来的不同ast之间转译的问题。
- 高效利用内存

cmd/esbuild/main.go主入口文件，cli.Run(osArgs)
pkg/cli/cli.go
pkg/api/api_impl.go

### esbuild plugin

#### 基本概念

##### Namespaces/Virtual Module

每个模块都有一个命名空间。

- 默认是file，对应的是是文件系统内的真实文件。
- esbuild额外提供了一个概念：虚拟模块（virtual module），也就是，即使import导入的文件A不真实存在于文件系统内，也能被解析；插件提供了一种创建虚拟模块的能力。

##### onResolve/onLoad

<font color="orange">onResolve</font>
解析每个模块的import导入时执行；可以用来标记需要特殊处理的模块，比如标记命名空间，或者更改文件路径。

<font color="orange">onLoad</font>
加载文件路径/命名空间，并指定不同的loader来编译该文件。

#### Vite中esbuild插件的用法

##### vite:dep-scan

```js
return {
  name: 'vite:dep-scan',
  setup(build) {
    const scripts: Record<string, OnLoadResult> = {}

    // external urls
    build.onResolve({ filter: externalRE }, ({ path }) => ({
      path,
      external: true
    }))

    // local scripts (`<script>` in Svelte and `<script setup>` in Vue)
    build.onResolve({ filter: virtualModuleRE }, ({ path }) => {
      return {
        // strip prefix to get valid filesystem path so esbuild can resolve imports in the file
        path: path.replace(virtualModulePrefix, ''),
        namespace: 'script'
      }
    })

    build.onLoad({ filter: /.*/, namespace: 'script' }, ({ path }) => {
      return scripts[path]
    })

    // extract scripts inside HTML-like files and treat it as a js module
    // const htmlTypesRE = /\.(html|vue|svelte|astro|imba)$/
    build.onLoad(
      { filter: htmlTypesRE, namespace: 'html' },
      async ({ path }) => {
        let raw = fs.readFileSync(path, 'utf-8')
        
        // ...省略
        return {
          loader: 'js',
          contents: js
        }
      }
    )
    
    // ... bare imports
    // css & json & wasm
  }
}
```

**TODO 学习下GO**