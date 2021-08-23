- zlib: zlib.gzip

#### vue
- initGlobalAPI
```javascript
  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
```
- intUse
```javascript
Vue.use = function (plugin: Function | Object) {
    ...

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    return this
  }
```
- **core/instance/index.js**
- initMixin(Vue)
    - 给vue原型增加_init方法 Vue.prototype._init
- stateMixin(Vue)
    - 给vue原型增加$data $props $set $del $watch方法 $watch方法没怎么看懂，new watcher() blablabla
- eventsMixin(Vue)
    - 给vue原型增加$on(一个事件 可以绑定好几个函数[]) $once $off $emit等方法
- lifecycleMixin(Vue)
    - // _update $forceUpdate  $destroy
- renderMixin(Vue)
    - _render
- this._init(options)
    - $options
    - initProxy
    - initLifecycle(vm)
    - initEvents(vm)
    - initRender(vm)
        - 设置vm._c vm.$createElement
        - defineReactive$$1(vm, '$attrs') // '$listeners'
    - callHook(vm, 'beforeCreate')
    - initInjections(vm) // resolve injections before data/props
    - initState(vm)
        - initProps
        - initMethods
        - initData
            - initData 判断data中key是否与props method等key冲突；再在vm中代理data[key] proxy(vm, '_data', key); 再observe(data, true); observe这里设置了defineReactive getter setter 并且 new Dep 通知observer；递归处理了每个参数
        - initWatch
            - watch key: value value可以是string or object{handler: fn}
    - initProvide(vm) // resolve provide after data/props
    - callHook(vm, 'created')
    - vm.$mount(vm.$options.el) // vm.$options.el: #app
        - 获取template： outerHTML 或者 innerHTML
        - compileToFunctions(template, options, this); template是目标div；会生成render函数 staticRenderFns；赋值在options里options.render; options.staticRenderFns
        - 调用mount方法
- ![76a1db0360ed577c91f9c09ea2de2382.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p3)
- ![ab36eba1f37805194ce964246f5646d1.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p8)

## _render
执行render渲染方法
```javascript
const { render, _parentVnode } = vm.$options
vnode = render.call(vm._renderProxy, vm.$createElement) // 这里_renderProxy没太看明白，要把proxy has方法传过去？
return vnode
```

## $mount
### compileToFunctions
该方法之后，options里多了render 等方法
- compileToFunctions, 获取到render后new Function(render)
    - compile，获取{ ast render staticRenderFns tips errors }
        - baseCompile, 获取{ast render staticRenderFns}
            - const ast = parse(template.trim(), options)
                - parse: convert html string to ast
                - parseHTML: 利用matchReg分析startTag(start end) endTag comment；并把标签存在stack中，出现闭合标签的时候，推栈；
                - ![48e9842095d89e822b3fa04329f0b91e.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p6)
            - optimize 表明是否static
                - markStatic$1： isStatic(node): mark non-static nodes
                - markStaticRoots: mark static nodes
            - var code = generate(ast, options)
                - var state = new CodegenState(options) 主要是初始化一些参数
                - var code = ast ? genElement(ast, state) : '_c("div")';
                    - genElement: genStatic genChildren genData genIf等函数帮助生成：![5aecee2d1855639edba25991e430d356.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p7) 
                - return { render: ("with(this){return " + code + "}"), staticRenderFns: state.staticRenderFns }
            - return { ast, render: code.render, staticRenderFns: code.staticRenderFns }

### mount
- mountComponent
    - new Watcher()后，constructor中执行了 updateComponent方法： vm._update(vm._render(), hydrating)
    - _update
        - 获取最新vnode，替换prevVnode；没有prevVnode的话，用__patch__方法创建新的node
        - vm.$el = vm.__patch__(prevVnode, vnode)； prevVnode:vm._vnode
        - vm.__patch__(patch.js) ---> createPatchFunction({ nodeOps, modules })
    - _render(details seen above)

## patch
Virtual DOM patching algorithm based on Snabbdom
```javascript
// nodeOps : 一些node操作，比如document.createElement
// modules: platformModules.concat(baseModules)
// baseModules: [
//     ref,
//     directives
//   ]
// platformModules: [ 
//   attrs: { create: updateAttrs, update: updateAttrs }, 这就是一些真实的dom操作了
//   klass,
//   events,
//   domProps,
//   style,
//   transition]
export const patch: Function = createPatchFunction({ nodeOps, modules })
```
1. 是否相同vnode，相同的话patchVnode
2. 否则，createElm
createElm
```javascript
// create new node
createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
)

function createElm (vnode, insertedVnodeQueue, parentElm, ...) {
    // if isDef(tag)
    vnode.elm = nodeOps.createElement(tag, node) // 生成dom元素
    createChildren(vnode, children, insertedVnodeQueue)
    // 调用各个module的create函数，给vnode.elm增加attrs classes等
    invokeCreateHooks(vnode, insertedVnodeQueue)
    insert(parentElm, vnode.elm, refElm)
    
    // if iscomment
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
    
    // else
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
}
```

remove
```javascript
removeVnodes([oldVnode], 0, 0)
```
## virtual dom diff
core/vdom/patch.js
### patchVnode (oldVnode,vnode)
- 判断vnode.data是否更改，是的话，先调用data.hook.prepatch方法；再调用styles attrs classes等module的update方法，更改vnode的属性；
```javascript
const data = vnode.data
if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
     i(oldVnode, vnode)
}
``` 
cbs= { create: [ ... // attrs styles classes refs等各种module中create函数的集合 ], update: [] , ...}
```javascript
if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    }
```
- 再判断内容：1 是否有文本 2 没有文本的话，对比子节点
    - updateChildren
    - addVnodes：遍历children，调用createElm方法
    - removeVnodes：removeNode, 而且触发cbs中的remove方法，destroy方法
```javascript
// 新vnode没有text节点： 1: 有子节点 2: 空
    if (isUndef(vnode.text)) {
      // 对比新旧vnode的children节点
      // 如果新旧vnode都有children，updatechildren
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        // 如果只有新vnode有children，而老vnode没有children，则新增addvnodes
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        // 如果只有老vnode有children，而新的vnode没有children，则删除之前的children vnodes
        removeVnodes(oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text)
    }
```
### updateChildren
对比新0/旧0 新end/旧end 新0/旧end 新end/旧0，四种情况是否是sameVnode
都不是sameVnode的话，看新vnode是否在旧vnodelist中
- 新vnode有key：旧vnode的所有key生成map；看新vnode的key是否在map中
- 新vnode没有key，遍历旧vnodelist 看单个vnode是否sameVnode

如果是纯新vnode，则createElm
否则，继续patchVnode
```javascript
  // updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh)
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else {
          vnodeToMove = oldCh[idxInOld]
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
  }
```
## nextTick
src/core/util/index.js
- 先保存cb
- 再执行timerFunc()
- timerFunc里再在promise.then里遍历执行cb stack里的cbs
- timerFunc针对不同平台的微任务做了相应的处理

在vue2.5使用了微任务+宏任务的方式，但当页面重绘之前 立刻改变state会导致一些问题；而且使用宏任务在某些场景下会导致诡异的问题。所以在2.6之后就只采用微任务了。而采取这种权衡带来的一个缺点，就是微任务的权重太高了，可能几个连续的事件会冲突

MutationObserver比promise的浏览器支持情况更好，但是它在ios 9.3以上的UIWebview上在touch event回调里触发的话会造成严重bug
```javascript
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}

// timerFunc
const callbacks = []
let pending = false

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++){
    copies[i]()
  }
}
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```
## Dep Observer Watcher
三者关系：
Observer defineReactive给每个对象getter setter里 dep = new Dep()； 当Dep.target有值的时候，就调用dep.depend()方法；dep.depend方法又给当前Watcher的newDeps里增加了dep实例，给dep实例的subs增加了当前watcher实例； 当setter方法调用的时候，dep就可以通过dep.notify 批量通知管辖的watcher去update；
new Watcher的时候，get方法给Dep.target赋值当前this(watcher);
![72ce0c119523bfd63724fd03070bac03.png](evernotecid://E1014288-8A6B-4300-BE41-9C3A0650317D/appyinxiangcom/34793898/ENResource/p9)

**TODO: 目前不知道Watcher里的newDeps是干啥用的？？？**

##### Dep
包括：
- 属性： static target(Watcher)/ subs(watcher的集合) /id(number类型)；
- 方法：addSub removeSub depend notify（通知watcher里的update方法）
- 同时有一个targetStack栈来管理Dep.target
```javascript
depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
```

##### Observer
收集依赖，分发更新：the observer converts the target object's property keys into getter/setters that collect dependencies and dispatch updates.

- constructor
    - value
        - __ob__ 给value增加__ob__，value: this
    - dep: new Dep()
    - vmCount: 0
    - value是数组的话，observe每个元素，判断是否含有__ob__, 是的话，返回__ob__;判断单个元素是数组|对象，是的话，再new Observer进行观察；否则return 不处理
    - value是对象的话，给每个key defineReactive增加getter setter方法
- 方法
    - defineReactive Object.defineProperty重新设置obj的set get方法，并在get set方法调用的时候，调用dep进行收集（dep.depend） 通知(dep.notify)
```javascript
let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
```
##### Watcher
constructor 初始化了很多属性,也获取了this.value的值，比如deps []/ id ++uid / depIds new set() / newDepIds new set() / this.value = this.lazy ? undefined : this.get()

方法：
**update**
```javascript
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
```
run
```javascript
const value = this.get()
if (value !== this.value) {
    const oldValue = this.value
    this.value = value
    this.cb.call(this.vm, value, oldValue)
}
```

**addDep**
```javascript
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
```
get
```javascript
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
```

##### array.js 覆写了原生Array方法
- 那为什么只对vue内的数据生效呢？不会影响框架外的数组处理呢？
```javascript
// observer时处理了value的原型对象
protoAugment(value, arrayMethods)
function protoAugment (target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}
```
- array处理
```javascript
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [ 'push','pop','shift','unshift','splice','sort','reverse']

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  // def: Object.defineProperty(obj, key, {value: val}})
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 通知更新
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
```

### v-model
data数据更改如何通知view视图，看👆的数据绑定；
input输入改动，如何触发data里的数据变化？
- 在compile generate的时候，已经分析出的[ast语法树](./v-model1.png)，监测到directives model 生成code，[如下：](./v-model1.1.png)
```javascript
"_c('div',{attrs:{\"id\":\"demo\"}},[_c('input',{directives:[{name:\"model\",rawName:\"v-model\",value:(currentBranch),expression:\"currentBranch\"}],attrs:{\"name\":\"branch\"},domProps:{\"value\":(currentBranch)},on:{\"input\":function($event){if($event.target.composing)return;currentBranch=$event.target.value}}})])"
```
$emit的时候，获取绑定的events事件vm._events[event]，再执行它
invokeWithErrorHandling

### 父子组件渲染顺序：

渲染过程： ❝从父到子，再由子到父；（由外到内再由内到外）❞
父 beforeCreate->父 created->父 beforeMount->子 beforeCreate->子 created->子 beforeMount->子 mounted->父 mounted

子组件更新过程：
父 beforeUpdate->子 beforeUpdate->子 updated->父 updated

父组件更新过程：
父 beforeUpdate->父 updated

销毁过程：
父 beforeDestroy->子 beforeDestroy->子 destroyed->父 destroyed
## Vuex

## build
**TODO**: 用ts写的？没看到ts构建config
esnext--> js的配置config没看到，再在config plugin里找下

## 有意思的代码：
压缩成zip包
```javascript
zlib.gzip(code, (err, zipped) => {
    if (err) return reject(err)
    report(' (gzipped: ' + getSize(zipped) + ')')
})

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
```
延迟函数
```javascript
const noop = _ => _

const defer = typeof process !== 'undefined' && process.nextTick
  ? process.nextTick
  : typeof Promise !== 'undefined'
    ? fn => Promise.resolve().then(fn)
    : typeof setTimeout !== 'undefined'
      ? setTimeout
      : noop
```