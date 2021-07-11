- 处理了hmr的module.hot部分
- 处理了cssmodules
- custom blocks
- 等等

### 流程
@vue/compiler-sfc parse解析source code，赋值为[descriptor](./vue-loader.descriptor.png)

```javascript
import { render } from "./Button.vue?vue&type=template&id=1355bdb6&scoped=true"
import script from "./Button.vue?vue&type=script&lang=js"
export * from "./Button.vue?vue&type=script&lang=js"

import "./Button.vue?vue&type=style&index=0&id=1355bdb6&scoped=true&lang=css"
script.render = render
script.__scopeId = "data-v-1355bdb6"
/* hot reload */
if (module.hot) {
  script.__hmrId = "1355bdb6"
  const api = __VUE_HMR_RUNTIME__
  module.hot.accept()
  if (!api.createRecord('1355bdb6', script)) {
    api.reload('1355bdb6', script)
  }
  
  module.hot.accept("./Button.vue?vue&type=template&id=1355bdb6&scoped=true", () => {
    api.rerender('1355bdb6', render)
  })

}

script.__file = "example/Button.vue"
/* custom blocks */
import block0 from "./Button.vue?vue&type=custom&index=0&blockType=docs"
if (typeof block0 === 'function') block0(script)


export default script
```