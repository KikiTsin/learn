# 聊聊颜色

## RGBA

是通过红、绿、蓝三个颜色通道的变化以及它们相互之间的叠加来得到各式各样的颜色。

0-255

```css
#RRGGBB/rgba(r, g, b, a)
```

缺点：比较抽象

## HSL

HSV与HSL的表示方法比较相似，这里单讲HSL. HSL是另一种颜色标准，通过对色相、饱和度、明亮度三个颜色通道的变化以及相互叠加来得到各种各样的颜色。

Hue色彩 Saturation饱和度 Lightness明亮度

![hue.png](http://tva1.sinaimg.cn/large/008tHWAOgy1h8v9dfu2wyj30fj0bpwfr.jpg)

```css
hsl(hue saturation lightness)
background: hsl(50 80% 40%)
```

**Hue**色彩的取值，0-360，是根据这个360度的颜色转盘来取的。红0、黄60、绿120、蓝绿色180、蓝240、洋红300。 0===360、120 == -240<br>
**Saturation**，色彩饱和度，0-100%，100%指的是完全饱和，0指的是完全不饱和，灰色。<br>
**Lightness**，明亮度，0-100%， 100%色彩最亮，接近于白色；0色彩最暗，接近于黑色。
在实际使用中，CSS、Canvas支持HSL，WebGL需要做一次转换。

## RGB/HSL转换

做颜色选择器组件的时候，少不了RGB/HSL等之间的转换。

**从RGB转换到HSL/HSV**
![rgb-to-hsl:hsv.png](http://tva1.sinaimg.cn/large/008tHWAOgy1h8v9dsonyvj30l90dngow.jpg)

```js
const rgb2hsv = function (r, g, b) {
  r = r/255
  g = g/255
  b = b/255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h
  const v = max

  const d = max - min
  const s = max === 0 ? 0 : d / max

  if (max === min) {
    h = 0 // achromatic
  } else {
    switch (max) {
      case r: {
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      }
      case g: {
        h = (b - r) / d + 2
        break
      }
      case b: {
        h = (r - g) / d + 4
        break
      }
    }
  }

  return { h: h * 60, s: s * 100, v: v * 100 }
}
```

**从HSL转换到RGB**
![hsl-to-rgb.png](http://tva1.sinaimg.cn/large/008tHWAOgy1h8v9d9i4jpj30ha0kp455.jpg)

```js
//输入的h范围为[0,360],s,l为百分比形式的数值,范围是[0,100] 
//输出r,g,b范围为[0,255],可根据需求做相应调整
function hsltorgb(h,s,l){
        var h=h/360;
        var s=s/100;
        var l=l/100;
        var rgb=[];

        if(s==0){
                rgb=[Math.round(l*255),Math.round(l*255),Math.round(l*255)];
        }else{
                var q=l>=0.5?(l+s-l*s):(l*(1+s));
                var p=2*l-q;
                var tr=rgb[0]=h+1/3;
                var tg=rgb[1]=h;
                var tb=rgb[2]=h-1/3;
                for(var i=0; i<rgb.length;i++){
                        var tc=rgb[i];
                        console.log(tc);
                        if(tc<0){
                                tc=tc+1;
                        }else if(tc>1){
                                tc=tc-1;
                        }
                        switch(true){
                                case (tc<(1/6)):
                                        tc=p+(q-p)*6*tc;
                                        break;
                                case ((1/6)<=tc && tc<0.5):
                                        tc=q;
                                        break;
                                case (0.5<=tc && tc<(2/3)):
                                        tc=p+(q-p)*(4-6*tc);
                                        break;
                                default:
                                        tc=p;
                                        break;
                        }
                        rgb[i]=Math.round(tc*255);
                }
        }
        
        return rgb;
}
```

## Display P3

The Display P3 color space, created by Apple.  
从色域来看，sRGB---> Adobe RGB  P3 ---> Rec 2020，目前最常用的还是sRGB.

**DCI P3**
![color-range.png](http://tva1.sinaimg.cn/large/008tHWAOgy1h8v9crbetwj30js0j9wpm.jpg)

Display P3比普通颜色更加明亮。<br>
**Display P3:**
![display-p3.png](http://tva1.sinaimg.cn/large/008tHWAOgy1h8v9cw5t87j309c02hglt.jpg)
**正常颜色：**
![normal-color.png](http://tva1.sinaimg.cn/large/008tHWAOgy1h8v9dmp3nsj30a702mt8r.jpg)

```js
// [<ident> | <dashed-ident>] 预先声明好的色域
// [<number-percentage>+ | <string> ] 色域中的位置
// / <alpha-value> 0-1 1表示完全透明
color(display-p3 1 0.5 0);
```

目前只有iOS设备、Safari浏览器支持。
![can-i-use.png](http://tva1.sinaimg.cn/large/008tHWAOgy1h8v9cd20slj30zk0crgua.jpg)

**如何降级容错？**<br>
判断浏览器是否支持P3色：

```css
@supports(color: color(display-p3 1 1 1)) {
    :root {
        --test-display-p3: color(display-p3 1 0.282353 0);
    }
    div {
        color: #ff4800;
        color: var(--test-display-p3);
    }
}
```

### 参考资料：
1. https://en.wikipedia.org/wiki/DCI-P3
2. https://developer.apple.com/documentation/coregraphics/cgcolorspace/1408916-displayp3
3. https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color
4. https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4
