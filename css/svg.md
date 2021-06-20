svg不用转base64，直接在background中使用，但是ie有些字符不支持，所以需要把svg内的特殊字符("，%，#，{，}，<，>)转译一下
```javascript
var encodeSvg = function (str) {
    return "data:image/svg+xml," + str.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/{/g,"%7B").replace(/}/g,"%7D").replace(/</g,"%3C").replace(/>/g,"%3E");
}
```

设计师导出来的svg有很多冗余信息，可以使用[svgo](https://github.com/svg/svgo)来进行精简。