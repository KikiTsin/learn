## 疑问
1. 通过伪类before content:'\e08f' 渲染出来的""（元素 computed中），这个怎么直接生成到css文件中，而不是 \e08f 16制字符？

### svg生成iconfont字体文件 todo
gulp-iconfont gulp-iconfont-css

### icon生成不同大小的图片
```javascript
let offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = 180;
offscreenCanvas.height = 180;

let offscreenCtx = offscreenCanvas.getContext('2d');
// 画背景
offscreenCtx.textBaseline = 'top';
offscreenCtx.fillStyle = '#fff';
offscreenCtx.fillRect(0, 0, 180, 180);
// 画icon 设置icon颜色
offscreenCtx.fillStyle = '#000';
// .font 需要写大小 和 所对应的字体文件 font-family
offscreenCtx.font = `40px poppy-icon`;
// 渲染 0 0 left top的位置 10 10 宽高
offscreenCtx.fillText("", 0, 0);
console.log(offscreenCanvas.toDataURL('image/jpeg'))
```