# CSS box-shadow

## 基本用法

box-shadow 可以设置 5 个值：x偏移量  y偏移量  阴影模糊半径  阴影扩散半径  阴影颜色

```css
box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
```

第一、二个参数表示从中心点开始的x轴、y轴偏移量

![x-y.jpg](http://tva1.sinaimg.cn/large/008tHWAOgy1h8v8hp08j6j312906w75q.jpg)

第三个参数：阴影模糊半径

![shadow-ambiguous.jpg](http://tva1.sinaimg.cn/large/008tHWAOgy1h8v8hbaficj304803pq2t.jpg)

第四个参数：阴影扩散半径

![shadow-diffusion.png](http://tva1.sinaimg.cn/large/008tHWAOgy1h8v8hiy32dj303b03gjra.jpg)

所以，box-shadow画出来的阴影的半径=width/2 + 扩散半径 + 模糊半径；
box-shadow也可以设置多个，用逗号分隔。

![multiple.png](http://tva1.sinaimg.cn/large/008tHWAOgy1h8v8h5nblsj315s078jv8.jpg)

## 用DIV画一张图片

![demo.png](http://tva1.sinaimg.cn/large/008tHWAOgy1h8v8gooccaj312a0el4nm.jpg)

```html
<body>
    <div class="box_shadow1">
    </div>
    <canvas id="boxShadow" width="180" height="132" style="display: none;"></canvas>
    <script>
        let img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = './imgs/moves_pic_2.png';
        
        let canvas = document.getElementById('boxShadow');
        let ctx = canvas.getContext('2d');
        let boxShadowArr = [];
        img.onload = function () {
            const imgWidth = img.width;
            const imgHeight = img.height;

            ctx.drawImage(img, 0, 0);
            img.style.display = 'none';

            // 获取像素值
            let imgData = ctx.getImageData(0, 0, imgWidth, imgHeight)

            let data = imgData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                let color = `rgba(${data[i]}, ${data[i+1]}, ${data[i+2]}, ${data[i+3] / 255})`;
                let line = Math.floor(i/ (imgWidth * 4));
                let t = i / 4;
                let col = t % imgWidth == 0 ? 0 : t % imgWidth;
                boxShadowArr.push(`${col * 4}px ${line * 4}px 4px 4px ${color}`);
            }
            document.getElementsByClassName('box_shadow1')[0].setAttribute('style', `box-shadow: ${boxShadowArr.join(',')}`)
        }
    </script>
</body>
```

## 参考资料

- https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData?qs=getimagedata