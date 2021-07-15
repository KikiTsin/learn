## 代码仓库
- 主干代码：postcss.js precessor.js lazy-result.js
- ast parser
  - parser.js
  - tokenize.js
- ast对象：
  - root.js container.js node.js
  - rule.js
  - declaration.js
  - comment.js
  - at-rule.js

### parser流程
- [生成的node](./postcss-node.png)
- pos=0，初步获取charCodeAt, tokenizer来解析单个字符块，空格 \n tab制表符 word 等类型分类处理
```javascript
    while (!this.tokenizer.endOfFile()) {
      // 当下一个字符不是空格 制表符等 时，进行正则匹配，解析出完整字符串（比如color）
      //   nextToken:
        //   RE_WORD_END.lastIndex = pos + 1
        //   RE_WORD_END.test(css)
        //   if (RE_WORD_END.lastIndex === 0) {
        //     next = css.length - 1
        //   } else {
        //     next = RE_WORD_END.lastIndex - 2
        //   }
        //   currentToken = ['word', css.slice(pos, next + 1), pos, next]
        //   buffer.push(currentToken)
        //   pos = next

      token = this.tokenizer.nextToken()

      switch (token[0]) {
        case 'space':
          this.spaces += token[1]
          break

        case ';':
          this.freeSemicolon(token)
          break

        case '}':
          this.end(token)
          break

        case 'comment':
          this.comment(token)
          break

        case 'at-word':
          this.atrule(token)
          break

        case '{':
          this.emptyRule(token)
          break

        default:
          // other里面，获取单行样式的所有数据，在获取单行数据的时候遇到;就break；
          this.other(token)
          break
      }
    }
```
- 遇到 { 生成Rule实例，继续解析，在this.other方法里 保存后续遇到的token，直到再次遇到; 这时生成declaration实例，生成过程中赋值prop value等字段 first last等方法；
- } this.current = this.current.parent，回退

### process流程
```javascript
  postcss([precss, autoprefixer])
    .process(css, { from: 'src/app.css', to: 'dest/app.css' })
    .then(result => {
      fs.writeFile('dest/app.css', result.css, () => true)
      if ( result.map ) {
        fs.writeFile('dest/app.css.map', result.map.toString(), () => true)
      }
    })
```
看了皮毛：
- new LazyResult(this, css, opts) // this ===> processor类 有属性version plugins--> 就是刚开始传进来的precss autoprefixer；
- then方法： this.async().then(onFulfilled, onRejected)
- this.async ===> runAsync
- prepareVisitors  不断walkSync root对象？
