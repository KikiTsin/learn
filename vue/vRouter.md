这里主要根据vRouter的用法来分析源码。

vue-router主要分为三部分: vue-router router-view router-link, vue-view router-link是component
- vue-router
  - class VueRouter主要有以下几个主要属性和方法
  - this.app---> Vue
  - this.history---> history还是hash，包含了push go replace setupListeners等方法
    - 注意：如果浏览器支持window.history.pushState的话，hash还是跟history一样，用了pushState方法
    - setupListeners： 主要是监听popstate方法，有变化的话进行transitionTo跳转
  - this.options---> 存储了new VueRouter({})时传入的参数
  - this.beforeHooks afterHooks等[], 存储了 router.beforeEach((to, from, next) => {}）内传入的函数，下面示例代码里有详细解释。
  - install：VueRouter.install = install
    - 在Vue中注册beforeCreate方法，把Vue._route---> this._router.history.current绑定：Vue.util.defineReactive(this, '_route', this._router.history.current)；后续Vue._route变化的时候，会触发object.defineProperty set方法。
    - 注册RouterView  Vue.component('RouterView', View)
    - 注册RouterLink
- router-view
  - 获取当前[matched route](./vue-router:%20matched.png)
  - 获取下属的component
    - const component = matched && matched.components[name]
  - h(component, data, children) // 这里patch的时候会调用createComponent
- router-link
  - 以component的方式，render导出 默认a标签为tag的vnode，click绑定了router.replace/push方法；return h(this.tag, data, this.$slots.default); data: {on: { click: handler }, attrs: { href, 'aria-current': ariaCurrentValue }}

以router.push为例子，主要做了以下几件事：
- 更新this.current当前路由，触发setter， dep.notify watcher.update queueWatcher(this)(把绑定的watcher存放在queue数组里面)，后续app.$nextTick的时候再根据id排序queue数组，依次执行queue里的元素watcher实例run方法，run方法最后会触发_render _update patch方法，render的时候会再次触发router-view里的render方法，获取到与当前route匹配的component，返回最新vnode，最终patchVnode更新视图。
- pushState 更改页面url
- 代码流程：
    - 1. this.transitionTo 
    - 2. confirmTransition: 会获取queue，runQueue遍历，依次执行hook 路由守卫函数, [ leaveGuards, beforeHooks, updatedHooks, beforeEnter, asyncComponents ]
    - 2. confirmTransition 执行成功后，再updateRoute，更新this.current,也就是Vue._route更新了
    - 1. transitionTo执行成功后，再执行pushState, onComplete(也就是这里的increment方法，)
    - 最后 执行Vue.$nextTick this.router.app.$nextTick(() => { handleRouteEntered(route) })

以下是vRouter的使用方法。
```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'

// 1. Use plugin.
// 调用VueRouter.install方法
Vue.use(VueRouter)

// 2. Define route components
const Home = { template: '<div>home</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const Unicode = { template: '<div>unicode</div>' }
const Query = { template: '<div>query: "{{ $route.params.q }}"</div>' }

// 3. Create the router
// 
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    { path: encodeURI('/é'), component: Unicode },
    { path: '/query/:q', component: Query }
  ]
})
// router.beforeEach里的函数，存放在了beforeHooks里，后面confirmTransition里 会获取queue，runQueue遍历，依次执行hook 路由守卫函数, [ leaveGuards, beforeHooks, updatedHooks, beforeEnter, asyncComponents ]
router.beforeEach((to, from, next) => {
  if (to.query.delay) {
    setTimeout(() => {
      next()
    }, Number(to.query.delay))
  } else {
    next()
  }
})

// 4. Create and mount root instance.
// Make sure to inject the router.
// Route components will be rendered inside <router-view>.
const vueInstance = new Vue({
  router,
  data: () => ({ n: 0 }),
  template: `
    <div id="app">
      <h1>Basic</h1>
      <ul>
        <li><router-link to="/">/</router-link></li>
        <li><router-link to="/foo">/foo</router-link></li>
      </ul>
      <button id="navigate-btn" @click="navigateAndIncrement">On Success</button>
      <pre id="counter">{{ n }}</pre>
      <pre id="query-t">{{ $route.query.t }}</pre>
      <pre id="hash">{{ $route.hash }}</pre>
      <router-view class="view"></router-view>
    </div>
  `,

  methods: {
    navigateAndIncrement () {
      const increment = () => this.n++
      if (this.$route.path === '/') {
        this.$router.push('/foo', increment)
      } else {
        // 点击router-link也是触发了router.push方法，见👆分析
        this.$router.push('/', increment)
      }
    }
  }
}).$mount('#app')

document.getElementById('unmount').addEventListener('click', () => {
  vueInstance.$destroy()
  vueInstance.$el.innerHTML = ''
})
```

### 有点意思
```javascript
export function pushState (url?: string, replace?: boolean) {
  saveScrollPosition()
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  const history = window.history
  try {
    if (replace) {
      // preserve existing history state as it could be overriden by the user
      const stateCopy = extend({}, history.state)
      stateCopy.key = getStateKey() // performance.now().toFixed(3)
      history.replaceState(stateCopy, '', url)
    } else {
      // key变化后，window.addEventListener('popstate', handler) 详细见下方👇setupListeners
      history.pushState({ key: setStateKey(genStateKey()) }, '', url)
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url)
  }
}

// setupListeners
    const handleRoutingEvent = () => {
      const current = this.current
      if (!ensureSlash()) {
        return
      }
      this.transitionTo(getHash(), route => {
        if (supportsScroll) {
          handleScroll(this.router, route, current, true)
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath)
        }
      })
    }
    const eventType = supportsPushState ? 'popstate' : 'hashchange'
    window.addEventListener(
      eventType,
      handleRoutingEvent
    )
```