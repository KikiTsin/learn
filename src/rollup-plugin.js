export default function rollupPlugin () {
    return {
        name: 'rollup-plugin-hello',
        resolveId(source) {
            console.log('source', source) // 处理的文件名 source src/source-map.js
        },
        load(id) {
            console.log('load id', id) // 全路径 load id /Users/kikitsin/learn/src/source-map.js
            // 这里return的代码会改变tranform函数内接收的code
            // return `export default "${id}"`
            return null;
        },
        // transform的执行时机在load之后
        transform(code, id) {
            console.log('transform id', id) // transform id /Users/kikitsin/learn/src/source-map.js
            console.log('transform code', code)
            return code;
        },
        buildEnd () {

        }
    }
}