思考：
* 为什么需要那么多 module 子类？这些子类分别在什么时候被使用？
* dependencies 依赖怎么分析的 process里没有发现dependencies
* __webpack_require___.r 等是怎么拼起来的，mainTemplate.js里没有写明
* inputfilesystem watchfilesystem没有找到入口
* build中_ast一直都是null

## start
* 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数-----已经看完
* 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译---已经看完
* 确定入口：根据配置中的 entry 找出所有的入口文件----compilation.js addEntry方法
* 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
* 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
* 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
* 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

1. node_modules中bin下查找webpack.sh
    webpack.sh: 
          process.exitCode = 0
          // 执行命令
          const runCommand = () => {}      const cp = require('child_process') cp.spawn(command, args, {})
          // 是否安装
          const isInstalled = packagename => {
              try {
                   require.resolve(packagename)
                   return true
               } catch (err) {
                   return false
               }
             }
              const CLIs= [{name: 'webpack-cli', binName: 'webpack-cli' ...}, { name: 'webpack-command' ...}]
              const installedClis = CLIs.filter(() => {})
              if (installedClis.length === 0) {
                   // 提示命令行 是否安装
                   const readLine = require('readLine')
                   // 判断是yarn还是npm安装
                   const isYarn = fs.existSync(path.resolve(process.cwd(), 'yarn.lock'))
                   const question = 'here is the question context'
                   const questionInterface = readLine.createInterface({
                        input: process.stdin,
                        output: process.stderr
                     })
                   questionInterface.question(question, answer = > {
                        questionInterface.close()
                         // 各种逻辑判断 answer的值 就是用户输入的值
                    })
             } else if (installedClis.length === 1) {
                   require(path.resolve(path.dirname(pkgPath), pkg.bin[installedClis[0].binName]))
             }
2.   接着，找到node_modules中的 webpack-cli先执行，import-local判断是否是本地包，优先使用本地包------__filename返回当前文件的绝对目录；pkg-dir（npm包）返回根目录；

2 yargs 分析node命令行 parse arguments ，并解析出webpack.config.js内设置的参数。
    

3 function processOptions 处理options
    - 处理argv后的变量
    - let compiler = webpack(options)
    - compiler.run(() => { //...   compilerCallerback()})
    - compilerCallback--> if (!options.watch || err) {  this.purgeInputFileSystem()  // 清除缓存 }
4 webpack.js
    - array or object? 不同的数据结构 不同的处理方式
          - array:  let compiler = new MultiCompiler(Array.from(options).map((opt) => {   webpack(option)  }))
          - object: let compiler = new Compiler(options.context)
    - if (options.plugins && Array.isArray(options.plugins))   plugin.apply(compiler)
       这里就到了plugin里的apply方法了
     - compiler.hooks.environment.call()
     - compiler.hooks.afterEnvironment.call()
     - compiler.options = new WebpackOptionsApply().process(options, compiler)
     - return compiler
4.1 ----学到的 如何批量导出方法
    exportPlugins: (obj, mappings) => {
          for (const name of Object.keys(mappings)) {
              Object.defineProperty(obj, name, {
                   enumerable: true,
                   configurable: false,
                   get: mappings[name]
               })
          }
     }
     exportPlugins(exports, {
          definePlugin: () => require('./definePlugin')
     })
4.2 WebpackOptionsApply
         将options内的参数，转化成plugins，比如：
         new CommonJsPlugin(option.module).apply(compiler)
         new LoaderPlugin().apply(compiler)
         new EntryOptionPlugin().apply(compiler)
         compiler.hooks.entryOption.call(options.context, options.entry) ----> 指的是4.3？？？
4.3 EntryOptionPlugin
      compiler.hooks.entryOption.tap('EntryOptionPlugin', (context, entry) => {
             // 判断typeof entry是 string array object 还是function
             // string array object 使用itemToPlugin(context, entry, 'main')函数来处理
             // function 使用new DynamicEntryPlugin来处理
      })
      function ItemtoPlugin(context, item, name) {
            if (Array.isArray(item)) {
               return new MultiEntryPlugin(context, item, name)
             }
             return new SingleEntryPlugin(context, item, name)
      }
5 compiler.js
        接着，开始执行第3步的compiler.run方法
        this.hooks.beforeRun.callAsync(this, err => {
               this.hooks.run.callAsync(this, err => {
                    this.readRecords(err => { // readRecords 读取inputPath，this.records = parseJson(content.toString('utf-8'))
                         this.compile(onCompiled)
                      })
                })
          })
5.1 compile(callback)方法
      this.hooks.beforeCompile----> this.hooks.compile----> 生成compilation实例，const compilation = this.newCompilation(params)----> this.hooks.make---->  compilation.finish----> compilation.seal----> this.hooks.afterCompile-------> callback(null, compilation), 执行onCompiled方法
5.2 onCompiled方法
     this.emitAssets : outputFileSystem 把文件内容写入文件
---> this.emitRecords：outputFileSystem.mkdirp(recordsOutputPathDirectory, err => {
                                        writeFile()
                                             }) // 写入output目录
6 触发make钩子之后，以addEntry为例，开始读取文件，根据文件类型和配置的loader对文件进行编译，编译完成后再找出该文件依赖的文件，递归地编译和解析

    singleEntryPlugin 中，compiler.hooks.make.tapAsync('singleEntryPlugin', (compilation, callback) => {
           // createDependency依赖moduleDependency---> dependency.js
          const dp = singleEntryPlugin.createDependency(entry, name) // entry name 在constructor中已经被赋值
          compilation.addEntry(context, dep, name, callback)
})

7 compilation.js
   - addEntry函数：
         this.hooks.addEntry.call(entry, name)
         this._addModuleChain(context, entry, module => {this.entries.push(module)}, (err, module) => {
               this.hooks.succeedEntry.call(entry, name, module)
               return callback(null, module)
          })
    - _addModuleChain
          this.buildModule(() => {
                  afterBuild()// 这里 processModuleDependencies，根据module.dependencies对象查找该module依赖，并把module和需要加载的资源 作为参数 传给addModuleDependencies; 判断该module的资源路径作为key是否被加载过cached，没有就build
           })
          方法：buildModule(module, optional, origin, dependencies, thisCallback) {
               this.hooks.buildModule.call(module)
               // module.js 内 Module.prototype.build = null; 然后normalModule extends Module, 并重写了build方法
               module.build(this.options, this, this.resolveFactory.get('normal', module.resolveOptions), this.inputFileSystem, error => {
                     const originalMap = module.dependencies.reduce((map, v, i) => {
                         map.set(v, i)
                         }, new Map());
                       module.dependencies.sort()
                       this.hooks.succeedModule.call(module);
               })
          }
7.1 NormakModule.js
    - build (options, compilation, resolver, fs, callback) {
               this._ast = null
               this._source = null
               this.buildInfo = { cacheable: false, assets: undefined, assetsInfo: undefined }
               return this.doBuild(options, compilation, resolver, fs, err => {
                    try {
                         // parser: const acorn = require("acorn"); const acornParser = acorn.Parser
                         // 这里返回了ast语法树
                         const result = this.parser.parse(this._ast || this._source.source(), {
                              current: this,
                              module: this,
                              compilation: compilation,
                              options: options
                              }, (err, result) => {
                              handleParseResult(result)
                              })
                     }
                })
     }
    - doBuild
          doBuild(options, compilation, resolver, fs, callback) {
               const loaderContext = this.createLoaderContext()
               // const { runLoaders } = require('loader-runner') // 是一个第三方库
               runLoaders({
                    resource: this.resource,
                    loaders: this.loaders,
                    readResource: fs.readFile.bind(fs)
               }, (err, result) => {
                    // 处理result     
                    const source = result.result[0]
                    const sourceMap = result.result.length >= 1 ? result.result[1] : null
                    const extraInfo = result.result.length >= 2 ? result.result[2] : null
                    this._source = this.createSource(this.binary ? asBuffer(source) : asString(source), ...) // 判断是buffer还是string，转化后的数据格式{_name: '/../../..路径/index.js', _value: '\nlet abc = "qin" \nfunction......'}
                    this._ast = typeof extraInfo === 'object' && extraInfo !== null && extraInfo.webpackAST !== undefined ? extraInfo.webpackAST: null; // 试了 import 和正常的声明语句，都是null，不知道什么时候会调用它。。。
                    return callback()
               })
8 seal
               所有模块及其依赖的模块通过loader转换完成，根据依赖关系生成chunk； seal做了大量的优化工作，进行hash创建和生成内容
               this.createHash()
               this.createChunkAssets()
8.1 createChunkAssets
             - 遍历chunks
             - 1）判断是mainTemplate还是chunkTemplate
             - 2）获取manifest数组，const manifest = template.getRenderManifest() // 
             - 3）遍历manifest，单个元素fileManifest  —>{  render(), fileNameTemplate, pathOptions, identifier (chunkHtmlWebpackPlugin_0) , hash } ——> 判断是否cached——> source = fileManifest.render() ——>没cached的话，保存在cached中———> this.emitAssets() 
    

9 Watch
    cli.js —— compiler.watch(watchOptions, compilerCallback)
    Watch() {  return new Watching(this, watchOptions, compilerCallback)  }
9.1 Watching.js
*     this.compiler.readRecords(() => {  this._go() }
*     _go() {
                     this.compiler.compile(onCompiled)
                }
       -      _done() {
                      this.watch( Array.from(compilation.fileDependencies), Array.from(compilation.contextDependencies), Array.from(compilation.missingDependencies) )
                    // this.watch方法内部调用this.compiler.watchFileSystem.watch
              }
9.2 this.compiler.watchFileSystem.watch 这里没找到watchFileSystem.watch
      监听到每个文件的最后修改时间，把该对象存放在this.compiler.fileTimestamps，然后触发_go方法去构建
