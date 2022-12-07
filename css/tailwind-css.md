# Tailwind CSS流程分析

> 之前项目中遇到使用Tailwind CSS和CSS Variables相关问题，在解决问题的过程中初步看了下Tailwind CSS的流程，跟大家分享下～  
> 众所周知，Tailwind CSS可以通过CL、PostCSS、CDN的方式来使用，这篇分享主要是以PostCSS插件的使用方式来讲述的。  
> 不了解Tailwindcss的同学查看官方文档👉[Get started with Tailwind CSS](https://tailwindcss.com/docs/installation)。  

在开始这篇文章之前，请大家先思考几个问题👇：  

1. Tailwind CSS是动态编译出CSS样式，还是统一生成CSS样式再TreeShaking掉多余的classNames？  

2. TSX文件中的classNames最终是编译成JSX函数内参数的，那这些classNames是如何被Tailwind CSS插件检测到并进行编译转换呢？

3. Tailwind CSS的类名和对应的样式是怎样生成的？  

### 入口配置

- 首先做好配置。增加tailwind.config.js/postcss.config.js文件，并在主css文件中引入tailwind。  

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
}

// main.css
@tailwind base;
@tailwind components;
@tailwind utilities;

// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- tailwind.config.js中的content: ['./src/**/*.{js,jsx,ts,tsx}']的字段表示将会扫描的文件路径，检测是否存在匹配的Tailwind CSS className值，如果有的话，再做相应处理。

```javascript
// 声明Tailwind CSS插件
module.exports = function tailwindcss () {
    postcssPlugin: 'tailwindcss',
    plugins: [
        function (root, result) {
            let context = setupTrackingContext(configOrPath)
            // ...省略其他代码
            processTailwindFeatures(context)(root, result)
        }
    ]
}
```

- 在创建tailwindcss插件的时候，setupTrackingContext函数主要是创建了上下文实例：
- context: { classCache  candidates  changedContent }
  - classCache：用来缓存className值；
  - candidates：正则匹配出来的字符串，比如import render classNames等；
  - candidateRuleMap: 保存各个关键字（比如font, text等）的处理函数及相关数据；
  - changedContext: 通过fast-glob函数查找到tailwind.config.js中content对应的文件路径，并读取文件内容。

Tailwind特性处理

- 接下来是processTailwindFeatures函数，主要在这个函数中做了很多特性处理：
  - expandTailwindAtRules
  - partitionApplyAtRules
  - evaluateTailwindFunctions
  - substituteScreenAtRules
  - .etc
- 这里我们只看expandTailwindAtRules函数，它主要做了以下3件事：
  - 匹配Tailwind CSS类名
  - 生成CSS样式
  - 调用postcss.process方法生成Rule、Decl等AST节点

### 匹配Tailwind CSS类名  

- 以App.vue文件为例

```javascript
<template>
  <div id="app">
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
    };
  },
  created() {  
  },
  destroyed() {
  }
};
</script>
```

- getClassCandidates读取到了‘text-3xl font-bold underline’ 这3个Tailwind CSS的className值。
  - 参数content即App.vue文件内容，通过\n换行符，逐行匹配。
  - extractor通过正则匹配到[ 'text-3xl', 'font-bold', 'underline' ]，并保存到candidates中：
  - candidates: new Set(['text-3xl', 'font-bold', 'underline'])

```javascript
function getClassCandidates(content, extractor, candidates, seen) {
    for (let line of content.split("\n")){
        line = line.trim();
        
        let extractorMatches = extractor(line).filter((s)=>s !== "!*");
        let lineMatchesSet = new Set(extractorMatches);
        for (let match1 of lineMatchesSet){
            candidates.add(match1);
        }
        extractorCache.get(extractor).set(line, lineMatchesSet);
    }
}
```

- getExtractor函数

```javascript
export function defaultExtractor(context) {
  let patterns = Array.from(buildRegExps(context))

  return (content) => {
    /** @type {(string|string)[]} */
    let results = []

    for (let pattern of patterns) {
      results.push(...(content.match(pattern) ?? []))
    }

    return results.filter((v) => v !== undefined).map(clipAtBalancedParens)
  }
}
```

### 生成CSS样式

- Tailwind升级到3这个大版本后，是动态生成CSS样式的。
- 它提供了很多【关键字-处理函数】【主题key-值】这样的映射表（详见corePlugins.js）
- 再通过内置的处理函数fn1 fn2，查找某个主题的值，比如：👇，具体可看corePlugins.js/defaultConfig.stub.js。

```javascript
// 关键字key-处理函数utilities
let utilities = {
    text: [
        [
            { 
                options: { 
                    values: { 3xl: ['1.875rem', { lineHeight: '2.25rem' } ] },
                },
                layer: 'utilities' // base utilities
            },
            function fn1() {}
        ],
        [
            {},
            function fn2() {}
        ],
    ]
}

//主题key-value
let map = {
    fontSize: {
        base: ['1rem', { lineHeight: '1.5rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        // ...
    },
}
```

- 从第一步拿到candidates后，再通过generateRules来生成css样式。那到底是怎样生成的呢？

```javascript
function generateRules(candidates, context) {
    let allRules = [];
    for (let candidate of candidates){
        // ...省略代码
        let matches = Array.from(resolveMatches(candidate, context));
        // ...省略代码
        context.classCache.set(candidate, matches);
        allRules.push(matches);
    }
    // ...省略代码
    return allRules.flat(1).map(([{ sort , layer , options  }, rule])=>{
        // ...省略代码
        return [
            sort | context.layerOrder[layer],
            rule
        ];
    });
}
```

- 其中，resolveMatches函数承担了这一工作。以text-3xl为例，通过'-'分隔符将其变换成['text', '3xl']，再根据Tailwind提供的处理函数candidateRuleMap.get('text')，生成 text-3xl

```javascript
let str = `.text-3xl { font-size: 1.875rem, line-height: 2.25rem } `
```

- 黄色部分是通过dlv函数从defaultConfig.stub.js获取到的默认值：

```javascript
// tailwindConfig: { theme: { screens: {}, fontSize: {] } }
dlv(tailwindConfig, ['theme', 'fontSize', ...[]], undefined) 
```

### 生成AST节点

- 最后再调用PostCSS方法生成AST节点，这样就可以配合其他PostCSS插件，比如autoprefixer，一起来使用了。

```javascript
export default function parseObjectStyles(styles) {
  if (!Array.isArray(styles)) {
    return parseObjectStyles([styles])
  }

  return styles.flatMap((style) => {
    return postcss([
      postcssNested({
        bubble: ['screen'],
      }),
    ]).process(style, {
      parser: postcssJs,
    }).root.nodes
  })
}
```

### 总结

- 最后我画了一个简图来辅助梳理思路。

<!-- ![流程图图](../images/articles/tailwindcss-process.png) -->

看到这里，你应该能回答文章开头的几个问题了吧？

- Q: Tailwind CSS是动态编译出CSS样式，还是统一生成CSS样式再TreeShaking掉多余的classNames？  
A: 最新版本的Tailwind CSS是动态编译出CSS样式的。

- Q: TSX文件中的classNames最终是编译成JSX函数内参数的，那这些classNames是如何被Tailwind CSS插件检测到并进行编译转换呢?  
A: 以main.css文件为契机，执行PostCSS插件提供的函数，再通过fast-glob读取文件内容，进而通过正则来进行匹配。

- Q: Tailwind CSS的类名和对应的样式是怎样生成的？  
A: 通过不同的映射，根据不同的默认值和对应的处理函数，生成不同的样式。具体可看corePlugins.js/defaultConfig.stub.js