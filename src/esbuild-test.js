// import { esbuild2 } from 'esbuild2'

// console.log(typeof esbuild2)
// import { zip } from 'https://unpkg.com/lodash-es@4.17.15/lodash.js'
// console.log(zip([1, 2], ['a', 'b']))

// 普通导入
// import fns from './kiki'
// fns()

// 动态导入
const dynamicImport = () => {
    return import('./kiki');
}

dynamicImport()

const kiki = 'kiki123'

export default kiki