import { init, parse } from 'es-module-lexer';

(async () => {
  await init;

  const source = `import * as namea from 'name' assert { type: 'json' };import(
    /* foo */
    \`bla.js\`
    /* bar */ /* 11 */ 
  );

    function kiki () {
      console.log('es-module-lexer')
    }
    import { dynamic } from 'dynamic-imports';
    export var p = 5;
    export function q () {
        console.log('q')
    };
    export { x as 'external name' } from 'external';
    export default kiki;
  `;

  const [imports, exports] = parse(source, 'optional-sourcename');
  console.dir(imports)
  console.dir(exports)
})()

// s ==> start
// e ==> end
// ss ==> import语句的开始位置
// se ==> import语句的结束位置
// d ==> 有动态导入的话，(开始的位置；没有的话就返回-1
// a ==> 导入声明开始的位置， 比如import * as namea from 'name' assert { type: 'json' } 中的 {type: 'json'} {的位置；没有的话，就返回-1

// 如果是\`bla.js\`/* bar */ /* 11 */ 这种格式的话，获取到的e(end)会获取到;之前，也就是\`bla.js\`/* bar */ /* 11 */，所以需要额外处理一下，去除comments；
let importsRes = [
  { n: 'name', s: 23, e: 27, ss: 0, se: 28, d: -1, a: -1 },
  { n: undefined, s: 59, e: 94, ss: 33, se: 95, d: 39, a: -1 },
  { n: 'external', s: 364, e: 372, ss: 326, se: 373, d: -1, a: -1 }
];
let exportsRes = [
  { s: 256, e: 257, ls: 256, le: 257, n: 'p', ln: 'p' },
  { s: 283, e: 284, ls: 283, le: 284, n: 'q', ln: 'q' },
  { s: 340, e: 355, ls: -1, le: -1, n: 'external name', ln: undefined },
  { s: 386, e: 393, ls: -1, le: -1, n: 'default', ln: undefined }
]