涉及到的代码目录：
- webpack-dev-server
- webpack-dev-middleware
- webpack/hot
- webpack/lib/web
- webpack/lib/HotModuleReplacement.runtime.js HotModuleReplacementPlugin.js （再看下插件js）

## 大概
webpack-dev-server中，引入webpack, 构建了一个webpack实例：
- 给webpackconfig增加两个entry
  ```javascript
    [
        '/Users/apple/Downloads/webpack-04/node_modules/webpack-dev-server/client/index.js?http://localhost:8081', // 浏览器端 sockjs监听
        '/Users/apple/Downloads/webpack-04/node_modules/webpack/hot/only-dev-server.js' // 监听webpackHotUpdate，调用check apply方法
    ]
  ```
- 注册钩子函数
  ```javascript
    compiler.hooks.done.tap('webpack-dev-server', (stats) => {
        // 触发web socket：hash ok通知浏览器，传递hash值
        // stats: { compiler, hash, starttime, endtime }
        this._sendStats(this.sockets, this.getStats(stats));
        this._stats = stats;
    });
  ```
- compiler.watch监听文件变动，webpack自动构建

同时起了两个服务：
- 一个express，用来处理浏览器请求的静态资源；用了webpack-dev-middleware中间件来处理请求的静态资源，比如请求为目录，自动转成index.html，mime获取当前请求文件的res.header content-type，处理/__webpack_dev_server__等文件； 存进memory-fs 内存系统；
  - http.createServer(new express())
- 另一个sockjs，用来跟浏览器进行通信；webpack-dev-server/client为客户端部分

## 流程：
- compiler = webpack(config);
- server = new Server(compiler, options, log);
- server.listen: this.createSocketServer();

done--> socketServer.send--->hash: currentHash = hash;ok: reloadApp(options, status);-->hotEmitter.emit('webpackHotUpdate', currentHash);---> webpack/hot/only-dev-server.js : check() ---> module.hot.check / module.hot.apply ---> 先来hotCheck: hotDownloadManifest获取 "{\"h\":\"eb186faff65073223071\",\"c\":{\"main\":true}}"--> hotDownloadUpdateChunk: document.head.appendChild(script)加载最新script src---> webpackHotUpdate ---> hotAddUpdateChunk ---> hotUpdateDownloaded ---> hotApply(热更新部分) ---> __webpack_require__(moduleId)

webpack/hot/only-dev-server.js中module.hot是来自：
```javascript
// The require function
 	function __webpack_require__(moduleId) {

 		// Check if module is in cache
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {},
 			hot: hotCreateModule(moduleId), // HotModuleReplacement.runtime.js: hotCreateModule返回一个hot对象{ check, apply, accept }
 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
 			children: []
 		};

 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

 		// Flag the module as loaded
 		module.l = true;

 		// Return the exports of the module
 		return module.exports;
 	}
```

```javascript
// require("./emitter").on('***', () => {})
// TODO webpackHotUpdate("main",{})结构
webpackHotUpdate("main",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);

class App extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
  render() {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, "hello React");
  }

}


react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(App, null), document.getElementById("app"));

if (true) {
  module.hot.accept(/*! ./index.js */ "./src/index.js", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { (function () {
    console.log('Accepting the updated printMe module!');
  })(__WEBPACK_OUTDATED_DEPENDENCIES__); }.bind(this));
}
/***/ })

})
```