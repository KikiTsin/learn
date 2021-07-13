loader执行顺序，从右到左，从下到上

pitch执行顺序，从左到右，有return值的话，中断loader执行链

```javascript
module.exports.raw = true; // source为二进制

// 见runloader.md
module.exports = function (source) {
     // this.query  ----> webpack.config.js 里rules loader options传过来的对象
     // this.async() ----> 告诉loader runner 这里有一个异步方法，在异步函数拿到结果后 this.async()(null, result)
     // this.data -----> 在pitch和normal execution间传递的数据
}

module.exports.pitch= function (remainingRequest, precedingRequests, data) {
     // /src/index.js       上一个loader.js      {}
}
```

