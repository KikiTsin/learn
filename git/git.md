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

// git rev-parse HEAD   a952d5f9b07f9cbbcd2887b7d0611ea729f308d8
// git rev-parse --short HEAD a952d5f9b

console.log(commitHash);
```
