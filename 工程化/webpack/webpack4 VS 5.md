大致流程一致：

区别：
- 如何获取命令行参数？ 4: yargs  5: webpack-cli用了commander库，用commander api获取
- 入口webpack命令是否缓存？ 4 没有 5 memorize做了缓存
- compile等内部过程是否logger？ 4 没有 5 加了logger
- compilation.js seal 函数内不太相同 4 buildChunkGraph   5  new ChunkGraph    buildChunkGraph 多了codeGeneration
