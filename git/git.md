# GIT不常见用法

## git rev-parse

可以把git rev-parse 理解为一个主要用于操作的辅助管道的命令。一个最常见的用法是使用它来打印SHA1哈希值。

- --verify 验证是否有效，是则返回值。
- --git-dir 展示.git的相对/绝对路径。
- --show-toplevel 显示顶级目录的绝对路径。
- --is-inside-work-tree 当前工作目录位于存储库目录下方时，打印'true'； 否则打印'false'

```js
const commitHash = require('child_process')
  .execSync('git rev-parse --short feat/aria-label-breadcrumbs', { encoding: 'utf-8' })
  .trim();

// git rev-parse HEAD   这个命令会 返回某个分支最近一条commit记录的hash值：a952d5f9b07f9cbbcd2887b7d0611ea729f308d8
// git rev-parse --short HEAD a952d5f9b 返回简短值，一般是完整commit的前8位

console.log(commitHash);
```

## git shortlog

[git shortlog](https://git-scm.com/docs/git-shortlog)

对git log信息进行分组，比如 git shortlog -n --after="2023-03-01" --before '2023-03-31' --all --no-merges 这个命令，就表示: 根据提交者的提交数倒叙排列（而非作者名字首字母排序），从2023-03-01到2023-03-31这个时间段内所有分支（--all 不加的只展示当前分支）的排除 git merge产生的commit外的所有commits。
