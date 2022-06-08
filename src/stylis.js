import {
  compile,
  serialize,
  stringify,
  middleware,
  COMMENT,
  prefixer,
} from "stylis";
// rulesheet, prefixer, emotion还使用了这两个，但是并没有导出

const compileRes = compile(
  `h1 { font-size: 10px; font-weight: 700; color: pink; }`
);
const compileVarRes = compile(`--foo: #ffffff;`);
const serialize = serialize(compileRes, stringify);

const prefixerRes = serialize(
  compile("div{display:flex;}"),
  middleware([prefixer, stringify])
);

serialize(
  compile("h1{all:unset}"),
  middleware([
    (element, index, children) => {
      console.log(
        children === element.root.children &&
          children[index] === element.children
      );
    },
    stringify,
  ])
) === "h1{all:unset;}";

// "h1{color:red;all:unset;}";
serialize(
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
