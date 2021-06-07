##### 结合项目管理中的内容来看
[lerna](https://github.com/lerna/lerna#readme)
lerna init
lerna create package1
lerna add babel

lerna bootstrap --hoist

yarn install

lerna publish

* 项目构建
    * 增量构建 git diff --name-only {git tag / commit sha} --{package path}
    * 多级依赖-lerna changed 拓扑结构
* 单测
    * 增量
* **部署** lerna publish
    * 可参考vite/release.js
    * 单个package如何部署
    * 单个package有依赖关系时如何部署
        * lerna changed找到修改过的包，如有依赖关系，相应依赖的包也需要打包一遍----自己开发整套流程的时候需要
    * package部署时如何自动计算版本号
        * git log 5b1d9732073dadc4a086091b605f595dcb4a8f06 HEAD -E --format=%H=%B (结果： 5b1d9732073dadc4a086091b605f595dcb4a8f06=first commit)---这个没太明白用来干啥
        * 获取package.json中的currentversion，再prompt 命令行提示选择major minor patch中一个
        * 再通过semver.inc计算版本号

```javascript
// lerna.json
{
  "version": "1.1.3",
  "npmClient": "npm",
  "command": {
    "publish": {
      "ignoreChanges": ["ignored-file", "*.md"],
      "message": "chore(release): publish",
      "registry": "https://npm.pkg.github.com"
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  },
  "packages": ["packages/*"]
}
```

* vue-cli-dev package.json
```javascript
"workspaces": // yarn workspace 
[
    "packages/@vue/*",
    "packages/test/*",
    "packages/vue-cli-version-marker"
  ],
   "resolutions": { // 解决不同的依赖版本问题
    "puppeteer": "1.11.0",
    "vue-template-compiler": "^2.6.12",
    "vue-server-renderer": "^2.6.12"
  },
```