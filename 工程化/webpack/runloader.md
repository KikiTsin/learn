``` javascript
module.exports = function (source) {
     // this.query  ----> webpack.config.js 里rules loader options传过来的对象
     // const callback = this.async() ----> 告诉loader runner 这里有一个异步方法，在异步函数拿到结果后                         
    // callback(null, result)
     // this.data -----> 在pitch和normal execution间传递的数据
}
module.exports.pitch= function (remainingRequest, precedingRequests, data) {
     // /src/index.js       上一个loader.js {}
}
```
## 流程：
* 获取options callback 
* 赋值 resource loaders resourcepath等参数；Object.defineProperty复写request remainingrequest等参数
* 迭代执行pitch函数：iteratePitchingLoaders
* iteratePitchingLoaders函数：loaderIndex pitchExecuted控制是否再次迭代；loadLoader  处理module模块和cmd模块， 读取各个loaders内pitch和default函数 (:loader.normal = typeof module === ‘function’ ? module : module.default; loader.pitch = module.pitch; loader.raw = module.raw;) 
* runSyncOrAsync 执行pitch函数，如果pitch有返回值，则直接跳过后续的loader 直接执行iterateNormalLoaders 否则 继续执行iteratePitchingLoaders


#### runSyncOrAsync 绕了一下:

``` javascript
context.async = function async () {
    if (isdone) { throw new Error('aaaa') }
    isSync = false
    return innerCallback
}

const innerCallback = context.callback = function () {
    if (isdone) { throw new Error('12121') }
    isdone = true
    isSync = false
    try {
        callback.apply(null, arguments)
    }
}
try {
    // 先执行fn函数，如果是同步函数 直接callback；如果是异步函数，则在外层函数先获取context.async方法，再等外层异步函数执行完成之后，再调用内部的innercallback函数
    var result = (function loader_execution() {  return fn.apply(context, args)  })()
    if (issync) { callback() }
}
```

#### 以下是loadLoader函数代码：
```javascript 
var LoaderLoadingError = require("./LoaderLoadingError");
var url;

module.exports = function loadLoader(loader, callback) {
	if(loader.type === "module") {
		try {
			if(url === undefined) url = require("url");
			var loaderUrl = url.pathToFileURL(loader.path);
			var modulePromise = eval("import(" + JSON.stringify(loaderUrl.toString()) + ")");
			modulePromise.then(function(module) {
				handleResult(loader, module, callback);
			}, callback);
			return;
		} catch(e) {
			callback(e);
		}
	} else {
		try {
			var module = require(loader.path);
		} catch(e) {
			// it is possible for node to choke on a require if the FD descriptor
			// limit has been reached. give it a chance to recover.
			if(e instanceof Error && e.code === "EMFILE") {
				var retry = loadLoader.bind(null, loader, callback);
				if(typeof setImmediate === "function") {
					// node >= 0.9.0
					return setImmediate(retry);
				} else {
					// node < 0.9.0
					return process.nextTick(retry);
				}
			}
			return callback(e);
		}
		return handleResult(loader, module, callback);
	}
};

function handleResult(loader, module, callback) {
	if(typeof module !== "function" && typeof module !== "object") {
		return callback(new LoaderLoadingError(
			"Module '" + loader.path + "' is not a loader (export function or es6 module)"
		));
	}
	loader.normal = typeof module === "function" ? module : module.default;
	loader.pitch = module.pitch;
	loader.raw = module.raw;
	if(typeof loader.normal !== "function" && typeof loader.pitch !== "function") {
		return callback(new LoaderLoadingError(
			"Module '" + loader.path + "' is not a loader (must have normal or pitch function)"
		));
	}
	callback();
}

```