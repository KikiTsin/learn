* monorepo
* git
    * 提 Pull Request
* commitizen : git cz
* commitlint & husky 检查commit msgs
* changelog如何生成：**conventional-changelog**
    * "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s --commit-path . --lerna-package plugin-vue-jsx"
    ```javascript
  // api方式：https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-writer 
  conventionalChangelog(
      {
        preset: 'angular',
      },
      null,
      null,
      null,
      {
        mainTemplate, // handlebar: https://handlebarsjs.com/zh/guide/expressions.html
        headerPartial,
        commitPartial,
        transform,
      }
    )
      .pipe(createWriteStream(DIST_FILE))
      .on('close', () => {
        spinner.succeed(`Changelog generated at changelog.md`);
        resolve();
      });
    ```
* 还有一种检查方式 git-hooks + 提交代码前eslint校验
```javascript
"gitHooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "node scripts/verifyCommitMsg.js"
  },
  "lint-staged": {
    "*.{js,vue}": "eslint --fix",
    "packages/**/bin/*": "eslint --fix"
  },
```
- 各种配置文件
    - .npmignore
    - .travis.yml