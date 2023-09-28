# font

## font-variant-numeric

该属性控制数字、分数、序号标记的替代字形的使用。

- normal默认值
- slashed-zero： 数字0是否展示斜线
- tabular-nums：启用表格数字显示。使数字等宽
- oldstyle-nums：古典数字展示风格

## font-display

决定了@font-face在不同的下载时间和可用时间下是如何展示的。

```css
@font-face {
    font-family: 'MyWebFont';
    src: url('myfont.woff2') format('woff2'),
         url('myfont.woff') format('woff');
    font-display: swap;
}
```

## 如何实现字体渐变

```html
<p>1212,1212</p>
```

```css
p {
    background-clip: text;
    background-image: linear-gradient(to right, #d84141,#3c26e5);
}
```

## 如何实现一个边框渐变

```html
<a><div></div></a>
```

```css
a {
    background-origin: border-box;
    background-image: linear-gradient(to right, #d84141,#3c26e5);
    border-color: transparent;
    border-width: 1px;
    overflow: hidden;
}
```
