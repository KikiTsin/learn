import resolve from 'resolve'

let path = resolve.sync('joi', {
    basedir:  process.cwd() + '/src',
    extensions: '.js'
})
// 只能返回module path，比如module.exports = abb 的文件。
// /Users/kikitsin/learn/node_modules/joi/lib/index.js
console.log(path)