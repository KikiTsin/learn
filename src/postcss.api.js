import postcss from "postcss";
import autoprefixer from 'autoprefixer'
import postcssNested from 'postcss-nested'
// `.text-3xl: {'font-size': '1.875rem', 'line-height': '2.25rem'}`
postcss([postcssNested({
    bubble: ['screen'],
  })]).process(
      // todo 文档和tailwind上都可以接口object，这里为啥不行呢。。奇怪
      {
      '.text-3xl': {
        'font-size': '1.875rem', 'line-height': '2.25rem'
      }
  }
  , {
    from: undefined
})
.then((res) => {
    console.log(res)
})