import sourceMap from "source-map";

// 除了source-map可以生成mapping外，还有magicString, webpack-sources可以生成mappings

// magicString没有缓存，需要自己额外做；webpack-sources带了缓存。

// import { ConcatSource, CachedSource, SourceMapSource } from 'webpack-sources';

// const module1Map = {}
// const module1 = new CachedSource(new SourceMapSource('code1'), 'module1.js', module1Map)
// const module2 = new CachedSource(new SourceMapSource('code2'), 'module2.js', module1Map)

// function bundle(){
//     const concatSource = new ConcatSource();
//     concatSource.add(module1)
//     concatSource.add(module2)
//     const { source, map } = concatSource.sourceAndMap();
//     return {
//       code: source,
//       map,
//     };
// }


let SourceMapGenerator = sourceMap.SourceMapGenerator;

var map = new SourceMapGenerator({
  file: "source-map-demo.js",
});

map.setSourceContent(
  "source-map-demo.js",
  ` const doctrine = require('doctrine')
    const fse = require('fs-extra')
    var ast = doctrine.parse(
        [
            "/**",
            " * This function comment is parsed by doctrine",
            " * @param {{ok:String}} userName \n * @param {{qinqi}} test",
            " * @url https://baidu.com.cn",
            "*/"
        ].join('\n'), 
        { 
            unwrap: true,
            sloppy: true,
            lineNumbers: true,
            range: true
            // tags: [
            //     'param'
            // ]
        }
    );

    console.log(ast)
    fse.writeFileSync('doctrine-ast.json', JSON.stringify(ast, null, 2))`
);

// 单次只生成一个字符的source-map
// 如果要像正常项目一样，可以通过遍历node节点的方式生成
map.addMapping({
  generated: {
    line: 11, // 生成的位置
    column: 11,
  },
  source: "source-map-demo.js",
  original: {
    line: 11, // 源代码的位置
    column: 11,
  },
  name: "christopher",
});

// {
//     version: 3,
//     sources: ['source-map-demo.js'],
//     names: ['christopher'],
//     mappings: ';;;;;;;;;;WAUWA',
//     sourceContent: ['...']
// }
console.log(map.toString()); // 生成的mapping

export async function test(sourceMapFile, line, column) {
  const sourceMapAnalysis = async (sourceMapFile, line, column, offset) => {
    // 通过 sourceMap 库转换为sourceMapConsumer对象
    const consumer = await new sourceMap.SourceMapConsumer(sourceMapFile);
    // 传入要查找的行列数，查找到压缩前的源文件及行列数
    const sm = consumer.originalPositionFor({
      line, // 压缩后的行数
      column, // 压缩后的列数
    });

    // {
    //     source: 'source-map-demo.js',
    //     line: 11,
    //     column: 11,
    //     name: 'christopher'
    //   }
    console.log("sm", sm);
    // 压缩前的所有源文件列表
    const { sources } = consumer;
    console.log("consumer", consumer);
    // 根据查到的source，到源文件列表中查找索引位置
    const smIndex = sources.indexOf(sm.source);
    // 到源码列表中查到源代码
    const smContent = consumer.sourcesContent[smIndex];

    // 销毁
    consumer.destroy();
  };
  sourceMapAnalysis(sourceMapFile, line, column);
}

test(map.toString(), 11, 11);
