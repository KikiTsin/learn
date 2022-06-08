# 常用npm包

- doctrine 用法见 src/doctrine.js
- joi 用声明式的条件语句 来表达 数据结构，并判断是否符合条件 validate，用法见 src/joi.js
- jsonschema
- base64id: base64id.generateId()--->DStdW-xboAOggfv0AAAA
- ts-node
- memory-fs, A simple in-memory filesystem. Holds data in a javascript object.
- mime: mime.getType('css')--> text/css
- ws
- sockjs
- url
  - url.parse(scripturl)
  - url.format
- hash-sum: hash generator, works in all of node.js, io.js, and the browser
- loader-utils
  - 为 webpack loader 打造
  - loaderUtils.stringifyRequest(this, "./test.js"); // return: "\"./test.js\""
  - loaderUtils.getOptions 处理 query
  - loaderUtils.interpolateName(loaderContext, "js/[contenthash].script.[ext]", { content: ... }); // => js/9473fdd0d880a43c21b7778d34872157.script.js
- markdown-it-anchor
- update-notifier 检查 cli 本地版本与线上版本
- pupa 字符串模版替换

  ```javascript
  pupa("I like {0} and {1}", ["🦄", "🐮"]);
  //=> 'I like 🦄 and 🐮'
  ```

- boxen 在终端命令行中创建 box，虚线框 +---+
- latest-version 获取 npm 包的最新版本, 实际用的是 package-json 这个包
  - [npm-learn 详细信息](./update-notifier.png)
    ![0fc761f10df61f757f8f89ad1c4fbcd7.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p17)
- registry-url 获取镜像
- download-git-repo
- gitbeaker/node
- Metalsmith
<!-- learned from terser-webpack-plugin -->
- source-map
- schema-utils: 校验 schema 是否按照正确格式配置，看官方案例主要是给 loader 和 plugin 做校验
- serialize-javascript
- jest-worker ??? 待学习
<!-- learned from Terser -->
- astring 生成 ESTree 标准的 AS‘T，快速
- eslump ？？奇奇怪怪 没太明白
- esm es module loader 模块打包器
- @ls-lint/ls-lint
- source-map-support 给 nodejs 自动增加 source-map

  ```javascript
  try {
    require("source-map-support").install();
  } catch (err) {}
  ```

- cli-color
- fancy-log
- google-closure-compiler 压缩工具，有三种不同的程度，whitespace\normal\advanced
- shx 支持跨平台命令，比如：shx ls; shx rm
- klaw-sync 递归查找目录内的文件，返回数据：[ { path: '/some/dir/file', stats: {} } ]
- classnames 拼接各种classnames
- @ctrl/tinycolor 颜色处理/转换
- np: a better npm publish
- signale 日志记录器: signale.success('successful');
- gulp-if 用来处理gulp工具中的条件判断: gulpif(condition, uglify());
- history: createBrowserHistory, createHashHistory
- stylis 一个轻量的css预处理器
