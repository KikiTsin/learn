- doctrine 用法见src/doctrine.js
- joi 用声明式的条件语句 来表达 数据结构，并判断是否符合条件 validate，用法见src/joi.js
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
  - 为webpack loader打造
  - loaderUtils.stringifyRequest(this, "./test.js"); // return: "\"./test.js\""
  - loaderUtils.getOptions 处理query
  - loaderUtils.interpolateName(loaderContext, "js/[contenthash].script.[ext]", { content: ... }); // => js/9473fdd0d880a43c21b7778d34872157.script.js
- markdown-it-anchor
- update-notifier 检查cli本地版本与线上版本
- pupa 字符串模版替换
```javascript
pupa('I like {0} and {1}', ['🦄', '🐮']);
//=> 'I like 🦄 and 🐮'
```
- boxen 在终端命令行中创建box，虚线框 +---+
- latest-version 获取npm包的最新版本, 实际用的是package-json这个包
  - [npm-learn详细信息](./update-notifier.png)
  ![0fc761f10df61f757f8f89ad1c4fbcd7.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p17)
  
- registry-url 获取镜像
- download-git-repo
- gitbeaker/node
- Metalsmith