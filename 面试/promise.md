promise

```javascript
// 方法一 取消promise方法 promise.race方法
function wrap(p) { 
    let obj = {}; 
    let p1 = new Promise((resolve, reject) => { 
        obj.resolve = resolve; 
        obj.reject = reject; 
    }); 
    obj.promise = Promise.race([p1, p]); 
    return obj; 
} 
let promise = new Promise((resolve, reject) => { 
    setTimeout(() => { 
        resolve(123); 
    }, 1000); 
}); 
let obj = wrap(promise); 
obj.promise.then(res => { console.log(res); }); 
obj.resolve("请求被拦截了"); 
obj.reject("请求被拒绝了");
```
