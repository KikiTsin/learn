#### dependencies
* [esbuild](https://esbuild.github.io/getting-started/)
* resolve 返回文件的绝对路径
* rollup
* @rollup/pluginutils: dataToEsm
* @vue/compiler-dom
* @vue/compiler-sfc
* @vue/compiler-core
* chokidar 监听文件变化
* etag---> Generate a strong ETag
* magic-string 处理一些string
* convert-source-map 把那些source-map转成{source: file: mappings}等
* connect 
    * Connect is an extensible HTTP server framework for node using "plugins" known as middleware
    * let middlewares = connect() as Connect.Server; require('http').createServer(middlewares)

##### packages/playground一些测试用例


#### 流程
* vite/bin/vite.js: require('../dist/node/cli') ----> src/node/cli.ts
* dev command
    ```javascript
    const { createServer } = await import('./server')
    try {
      const server = await createServer({
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
        logLevel: options.logLevel,
        clearScreen: options.clearScreen,
        server: cleanOptions(options) as ServerOptions
      })
      await server.listen()
    } catch (e) {
    }
    ```
* **createServer**:
    * resolveConfig处理config
    * const middlewares = connect() as Connect.Server; 这里用connect这个npm库 使用middlewares来处理各种html js文件
    * 生成httpServer---> require('http').createServer(app) // require('https') require('http2') app--->middlewares
    * watcher监听文件变化；chokidar.watch
    * plugins插件；assets esbuild css html等；统一格式 包括resolveId transform 等函数
    * const container = await createPluginContainer(config, watcher)
    * moduleGraph
    * 各种参数，middlewares.use不同的middleware，比如baseMiddleware/ servePublicMiddleware **<u>transformMiddleware</u>**(main transform middleware) / indexHtmlMiddleware / vite404Middleware
        * transformMiddleware---主要转换中间件
        * indexHtmlMiddleware----处理html
        * vite404Middleware----404
    * 重写httpServer.listen方法
    ```javascript
    httpServer.listen = (async (port: number, ...args: any[]) => {
      try {
        await container.buildStart({})
        await runOptimize()
      } catch (e) {
        httpServer.emit('error', e)
        return
      }
      return listen(port, ...args)
    }) as any
    ```
* **server.listen()**
    * 调用httpServer.listen方法 起3000端口，处理一些业务逻辑，比如chalk打印信息，openBrowser等
* indexHtmlMiddleware
    * let html = fs.readFileSync(filename, 'utf-8')
    * html = await server.transformIndexHtml(url, html, req.originalUrl)
        * applyHtmlTransforms 函数里遍历处理各个plugins里的transformIndexHtml方法
    * return send(req, res, html, 'html')
* **transformMiddleware** 
    * 处理url
    * if isJSRequest(url) || isImportRequest(url) || isCSSRequest(url) || isHTMLProxy(url)
    * 根据req.headers['if-none-match'] 和 etag ===ifnonematch 判断是否304；是的话res.end()
    * const result = await transformRequest(url, server, { html: req.headers.accept?.includes('text/html') })
        * 通过这个函数获得code map，步骤：
        * 判断这个文件是否在缓存中
        ```javascript
        const module = await moduleGraph.getModuleByUrl(url)
        const cached = module && (ssr ? module.ssrTransformResult : module.transformResult)
        ```
        * 获取id； const id = (await pluginContainer.resolveId(url))?.id || url // '/Users/apple/vite/packages/playground/html/shared.js' // resolve 轮询 处理plugins里的resolveId函数
        * const loadResult = await pluginContainer.load(id, ssr) // 轮询 处理plugins里的load函数
        * loadResult为null
            * code = await fs.readFile(file, 'utf-8')
            * map = (
          convertSourceMap.fromSource(code) ||
          convertSourceMap.fromMapFileSource(code, path.dirname(file))
        )?.toObject()
        * loadResult为object
            * code = loadResult.code
            * map = loadResult.map
        * code = loadResult
        * 获取到code后，transform处理code，  const transformResult = await pluginContainer.transform(code, id, map, ssr) // 轮询 处理plugins里的transform函数
        * 重新赋值code map; code = transformResult.code!; map = transformResult.map
        * return { code, map, etag: getEtag(code, { weak: true }) }
