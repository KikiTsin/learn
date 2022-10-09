import sourceMap from 'source-map';    //source-map库
import fs from 'fs'                    //fs为nodejs读取文件的库
import rp from 'request-promise'

/**
 * @description:  用来解析 sourcemap 的函数方法
 * @param {*} sourceMapFile 传入的 .map 源文件
 * @param {*} line  报错行数
 * @param {*} column  报错列数
 * @param {*} offset  需要截取几行的代码
 * @return {*}
 */
export const sourceMapAnalysis = async (sourceMapFile, line, column, offset) => {
// 通过 sourceMap 库转换为sourceMapConsumer对象
  const consumer = await new sourceMap.SourceMapConsumer(sourceMapFile);
  // 传入要查找的行列数，查找到压缩前的源文件及行列数
  const sm = consumer.originalPositionFor({
    line, // 压缩后的行数
    column, // 压缩后的列数
  });
  // 压缩前的所有源文件列表
  const { sources } = consumer;
  // 根据查到的source，到源文件列表中查找索引位置
  const smIndex = sources.indexOf(sm.source);
  // 到源码列表中查到源代码
  const smContent = consumer.sourcesContent[smIndex];
  // 将源代码串按"行结束标记"拆分为数组形式
  const rawLines = smContent.split(/\r?\n/g);
  let begin = sm.line - offset;
  const end = sm.line + offset + 1;
  begin = begin < 0 ? 0 : begin;
  const context = rawLines.slice(begin, end);
  // 可以根据自己的需要，在末尾处加上 \n
  // const context = rawLines.slice(begin, end).join('\n');
  // 销毁
  consumer.destroy();
  return {
    // 报错的具体代码
    context,
    // 报错在文件的第几行
    originLine: sm.line + 1, // line 是从 0 开始数，所以 +1
    // source 报错的文件路径
    source: sm.source,
  }
};

// 请求线上的 .map 文件进行解析
export const loadMapFileByUrl = async (url)=>{
  return await rp(url)
}
const line = 9;
const column = 492621;
const rawSourceMap = JSON.parse(
  // 这里加载在本地的 .map 文件
  fs.readFileSync('./xxxxxxxxxxxxxxx.map','utf-8').toString()    // 路径自拟
);
const inlineSourceMap = JSON.parse(await loadMapFileByUrl('http://xxxxxxxxxxxx.map')) // 路径自换

// 从url获取 sourcemap 文件
// const res = await sourceMapAnalysis(inlineSourceMap,line,column,2)
// 从本地获取 sourcemap 文件
const res = await sourceMapAnalysis(rawSourceMap,line,column,2)

console.log(res);

