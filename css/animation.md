[requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)
** 请确保总是使用第一个参数(或其它获得当前时间的方法)计算每次调用之间的时间间隔，否则动画在高刷新率的屏幕中会运行得更快。**

返回值：
一个 long 整数，请求 ID ，是回调列表中唯一的标识。是个非零值，没别的意义。你可以传这个值给 window.cancelAnimationFrame() 以取消回调函数。
```javascript
// requestAnimationFrame的回调函数，默认传入一个时间戳=== performance.now() 时间精度：5微秒
let start = undefined
function step (timestamp) {
    if (start === undefined) { start = timestamp }

    const elapsed = timestamp - start;

    //这里使用`Math.min()`确保元素刚好停在200px的位置。
    element.style.transform = 'translateX(' + Math.min(0.1 * elapsed, 200) + 'px)';

    if (elapsed < 2000) { // 在两秒后停止动画
        window.requestAnimationFrame(step);
    }
}
let id = requestAnimationFrame(step) // 测试的时候，返回id=1

cancelAnimationFrame(id)
```