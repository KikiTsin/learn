[vue-cli文章](https://blog.csdn.net/qq_34086980/article/details/113924954) 后面可以补看下

#### 主要看了
- bin/vue.js;
- vue create;vue add; 
- vue-cli-service serve/build

### vue create流程
- packages/@vue/cli/package.json中bin: "bin/vue.js"
- bin/vue.js 
    - checkNodeVersion 检查node版本，process.version 跟package.json engines.node相对比
    - const program = require('commander')
    - program.command   .action(() => { require('../lib/create')() }) // 不同命令行对应不同action
    - program.on('command:*', ([cmd]) => { suggestCommands(cmd) }) // 如果输入的command命令跟现有的命令之间 差异<3的话，就提示当前的命令
- lib/create.js
    - 处理 vue create . 这种情况
    - validateProjectName 校验name规则
    - new Creator(name, targetDir, getPromptModules()) // 项目名 目标路径 命令行的提示[()=>{}]
    - creator.create(options)
- lib/creator.js
    - constructor
        - 获取presetPrompt featurePrompt outroPrompts 等提示信息
        - const promptAPI = new promptModuleAPI(this); promptModules.forEach(m => m(promptAPI)) ---> 执行promptModules数组内的函数，并把promptAPI实例传进去
    - create: 安装依赖，注入初始代码
        - 获取preset（预设）
        - 获取packageManager: npm yarn
        - const pm = new packageManager({context, ...})
        - 通过presets.plugins 获取devDependencies信息
        - writeFileTree(context, { 'package.json': JSON.stringify(pkg, null, 2) })
        - shouldInitGit
            - hasGIT -----> execSync('git --version', {stdio: 'ignore'})
            - hasProjectGIT---> execSync('git status', {stdio: 'ignore', cwd})
        - pm.install
            - runCommand: setRegistryEnvs + executeCommand
        - 接下来是写入初始代码
        - const plugins = await this.resolvePlugins(preset.plugins, pkg) {id: options} => [{id, apply, options}]
        - const generator = new Generator(context, { pkg, plugins, ... })
        -  await generator.generate({extractConfigFiles})
            - initPlugins 调用各个plugin方法，把各个plugin方法push到fileMiddlewares中
                - for ( const plugin of this.plugins ) { const {id,apply, options} = plugin; const api = new GeneratorAPI(id, this, options, rootoptions); await apply(api, options, rootoptions, ...) }
                - 比如@vue-cli-service/generator/index.js 执行render('./template'); extendPackage等函数
            - resolveFiles
                - 执行fileMiddlewares中各个方法，ejs.render渲染出文件内容
            - sortPkg --- 以固定顺序写package.json
            - writeFileTree 写入文件
        -  pm.install
        -  writeFileTree('readme.md')
        -  run git操作
        ```javascript
            await run('git', ['config', 'user.name', 'test'])
            await run('git', ['config', 'user.email', 'test@test.com'])
            await run('git', ['config', 'commit.gpgSign', 'false'])
            await run('git', ['commit', '-m', msg, '--no-verify'])
        ```
        - generator.printExitLogs


#### 用到的npm库
- leven 判断两个字符串中的不同字符数量
- inquirer 命令行交互界面 inquirer.prompt([{name, type, message}])
- commander
- lru-cache 最近最少使用
- ora node环境的loading
- strip-ansi去掉ANSI转译码
- execa process execution for humans 2333
- ejs ejs.render
- deepmerge
- slash Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
- semver 处理node versions的；semver.satisfies('1.2.3', '1.*')
- is-file-esm 通过package.json中type和文件后缀 判断是module还是script
- port-finder 找到合适的端口
- default-gateway
- address 获取当前机器的IP MAC DNS servers

问题：
- request: headers: application/vnd.npm.install-v1+json;q=1.0, application/json;q=0.9, */*;q=0.8
- semver.satisfies
- 1

```javascript
let obj = {}
Error.captureStackTrace(obj)
```

### vue add

### vue-cli-service serve build
通过new webpack来实现