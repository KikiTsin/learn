##### 搭建脚手架 需要，vue-cli  webpack-cli一般都用这个

[阮一峰的文章](https://www.ruanyifeng.com/blog/2015/05/command-line-with-node.html)

根据 Unix 传统，程序执行成功返回 0，否则返回 1 。
```javasctipt
if (err) { process.exit(1) } else { process.exit(0) }
```
简单代码： 运行 node ./commander.js -d ; node ./commander.js rmdir tt  name=qqq ; node ./commander —help

package.json里加入bin，再npm link 即可hello -d

process.argv ——> [ '/usr/local/bin/node', '/usr/local/bin/hello', '-qini' ]

```javascript

"bin": {
     "hello": "./commander.js"
},

#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
program.version('0.0.1');

program
    .option(‘-d, --debug', 'output extra debugging')
    .option('-s, --small', 'small pizza size')
    .option('-p, --pizza-type <type>', 'flavour of pizza')

    .command('rmdir <dir> [otherDirs...]')
    .action(function (dir, otherDirs) {
        console.log('rmdir %s', dir);
        if (otherDirs) {
            otherDirs.forEach(function (oDir) {
                console.log('rmdir %s', oDir);
            });
         }
    })


program.parse(process.argv);
```