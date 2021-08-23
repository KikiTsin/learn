- 提取第三方公共代码：optimization: splitChunks: all还有什么配置？
- 缓存：cacheGroups，感觉用cdn更好些。

动态导入：
chunkFilename: '[name].bundle.js',
import(‘a.js’).then(module => module.exports)
or: async await const module=require(‘a.js’)

/* webpackPrefetch abc*/ 其他导航栏需要，在浏览器空闲时候加载
webpackPreload 注释，当前导航栏需要

与 prefetch 指令相比，preload 指令有许多不同之处：
* preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。
* preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
* preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。
* 浏览器支持程度不同。
对比一下：
defer 并行下载，在html parse解析完成后 再执行。
async 并行下载，会中断html parser；下载完就立即执行。

thread-loader多进程
terser-webpack-plugin  {parallel: true}

增量打包