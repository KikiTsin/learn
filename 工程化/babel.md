## TODO
5+9 还没看
代码仓库看了前三个parameter acorn tracker
vue-template-compiler
postcss
htmlparser2

## ？？？
- @babel/template 待用
- @babel/code-frame 待用
- @babel/helpers 待用
- source-map生成那里没太看明白
- plugin测试，babel-plugin-tester code那里 如何写复杂的测试逻辑呢 fixture等都是什么意思？
jest生成代码的快照？？？  expect(code).toMatchSnapshot();

## 知识点
表达式语句解析成 AST 的时候会包裹一层 ExpressionStatement 节点，代表这个表达式是被当成语句执行的。
![ce0686fb7e0f8959ed835371682602cf.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p4)
小结：表达式的特点是有返回值，有的表达式可以独立作为语句执行，会包裹一层 ExpressionStatement。


program 是代表整个程序的节点，它有 body 属性代表程序体，存放 statement 数组，就是具体执行的语句的集合。**还有 directives 属性，存放Directive 节点，比如"use strict" 这种指令会使用 Directive 节点表示。**
![554b3ee0f2f8b0ae4e4994d5ca10a3ce.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p5)



babel 的 **AST 最外层节点是 File**，它有 program、comments、tokens 等属性，分别存放 Program 程序体、注释、token 等，是最外层节点。
**注释分为块注释和行内注释，对应 CommentBlock 和 CommentLine 节点。**


	•	start、end、loc：start 和 end 代表该节点对应的源码字符串的开始和结束下标，不区分行列。**而 loc 属性是一个对象，有 line 和 column 属性分别记录开始和结束行列号**。
	•	leadingComments、innerComments、trailingComments： 表示开始的注释、中间的注释、结尾的注释，因为每个 AST 节点中都可能存在注释，而且可能在开始、中间、结束这三种位置，通过这三个属性来记录和 Comment 的关联。


当需要批量创建 AST 的时候可以使用** @babel/template** 来简化 AST 创建逻辑。

中途遇到错误想打印代码位置的时候，使用 **@babel/code-frame** 包
```javascript
const { codeFrameColumns } = require("@babel/code-frame");

try { 
    throw new Error("xxx 错误");
} catch (err) {  
    console.error(codeFrameColumns(`const name = guang`, 
    {        
        start: { line: 1, column: 14 }  
    }, 
    {    
        highlightCode: true,    
        message: err.message  
    }));
}
```
babel parser 叫 babylon，两个api：parse 和 parseExpression

@babel/core 包还有一个 createConfigItem 的 api，用于 plugin 和 preset 的封装

讲了path scope block等的api 用法

source-map 那里有一块生成sourcemap的代码 npm包，没怎么懂

测试： jest babel-plugin-tester

babel 的 plugin，就 @babel/plugin-syntax-xxx, @babel/plugin-syntax-transform-xxx、@babel/plugin-proposal-xxx 3种。

@babel/helper
	•	一种是注入到 AST 的运行时用的全局函数
	•	一种是操作 AST 的工具函数，比如变量提升这种通用逻

**comat-table**: 提供了每个特性在不同环境中的支持版本

**browserlist** npx browserlist “last 1 version”
https://github.com/browserslist/browserslist#queries


想知道最终使用的 transform plugin 和引入的 core-js 模块是否对，那就可以把 debug 设为 true，这样在控制台打印这些数据。
```javascript
presets: [        
    ['@babel/env', {            
        debug: true,            
        useBuiltIns: 'usage',            
        corejs: 3        
     }]    
]
```

babel8 优化了babel7 @baben-transform-plugin 与preset-env 配合时， 指定高版本，但是多引入了pollyfill的问题


## Date 05-07
@babel/parser, acorn, terser 

看过了babel各种api，初步了解了babel编译原理，看了不少plugin的生成代码，需要再看下terser，acorn看了下没看明白。。。

**the-super-tiny-compiler**详细讲了parse traverser transformer code-generator的过程
这个[插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-stages-of-babel)，讲了visitors path scopes state等操作的细节: parse —> transform—> generate

学习参考文章：
https://juejin.cn/post/6956602138201948196 （这个还需要再看下）
https://juejin.cn/post/6958347736924192782 （这个是简单科普）

#### PARSE
antlr 来生成parser
js: spider monkey parser api和ast标准———> estree ——> acorn
acorn:
```javascript
        const acorn = require(‘acorn')
        const Parser = acorn.Parser;
        const TokenType = acorn.TokenType // 关键字，比如const import等，是一个TokenType实例
        Parser.acorn.keywordsTypes[‘abc’] = new TokenType(‘abc’, {keyword: ‘abc’}) // TokenType(label, conf) { this.label = label; this.keyword = conf.keyword }
        let abcKeyword = function (Parser) {
            return class extends Parser {
                parse () {
                    var newKeywords = ‘abc break case catch continue debugger…'
                    this.keywords = wordsRegexp(newKeywords) // 重设关键字，可看dist/acorn.js中Parser构造函数
                    return (super.parse())
                }
                
                parseStatement (context, topLevel, exports) {
                    // 这个函数 参考dist/acorn.js 中pp$1.parseStatement函数
                    var starttype = this.type
                    if (start type === Parser.acorn.keywordsTypes(‘abc’)) {
                        var node = this.startNode()
                        return this.parseABCStatement(node)
                    } else {
                        return ( super.parseStatement(...) )
                    }
                }
                parseABCStatement (node) {
                    // 参考const对应的parsestatement---> pp$1.parseVarStatement
                    this.next()
                    return this.finishNode(node, ‘abc')
                }
            }
        }
        
        const newParser = Parser.extend(abcKeyword)
        let test = ‘abc; const ttt = 1212’
        let parser test = newParser.parse(test)
        // 打印出来，Node对象 start:0 end:126 body:[ {Node对象}]
```
## TODO:
- css: postcss
    调试 看下postcss.js
- html: htmlparser2 看下各个模版引擎如何编译成html的； vue-template-compiler