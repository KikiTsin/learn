import {
  compile,
  serialize,
  stringify,
  middleware,
  COMMENT,
  prefixer,
} from "stylis";
// rulesheet, prefixer, emotion还使用了这两个，但是并没有导出

// {
//     value: 'h1',
//     type: 'rule',
//     children: [],
//     props: ['h1'],
//     root: null,
//     parent: null,
//     column: 5,
//     length: 0,
//     line: 1,
//     return: ''
// }
const compileRes = compile(
  `h1 { font-size: 10px; font-weight: 700; color: pink; }`
);
// {
//     children:'#ffffff'
//     column:16
//     length:5
//     line:1
//     parent:null
//     props:'--foo'
//     return:''
//     root:null
//     type:'decl'
//     value:'--foo:#ffffff;'
// }
const compileVarRes = compile(`--foo: #ffffff;`);

const serializeFn = serialize(compileRes, stringify); // returns: 'h1{font-size:10px;font-weight:700;color:pink;}'

// prefixer是给样式加兼容性前缀
const prefixerRes = serialize(
  compile("div{display:flex;}"),
  middleware([prefixer, stringify])
);

serialize(
  compile("h1{all:unset}"),
  middleware([
    (element, index, children) => {
     // element指的是compile后的当前节点
     // index 0
     // children 就是element.children
     // 👇 console的值是false
      console.log(
        children === element.children &&
          children[index] === element.children
      );
    },
    stringify,
  ])
)

// !IMPORTANT tips: 在middleware中间件函数中更改 element.return 属性的值就可以。
// "h1{color:red;all:unset;}";
const formattedRes = serialize(
  compile("h1{all:unset}"),
  middleware([
    (element, index, children, callback) => {
      if (
        element.type === "decl" &&
        element.props === "all" &&
        element.children === "unset"
      )
        element.return = "color:red;" + element.value;
    },
    stringify,
  ])
)
