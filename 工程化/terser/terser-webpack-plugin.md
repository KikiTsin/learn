# Terser-webpack-plugin 运行机制

## 学习到的知识点

- npm 包：
  - source-map
  - schema-utils: 校验 schema 是否按照正确格式配置，看官方案例主要是给 loader 和 plugin 做校验
  - serialize-javascript
- 判断 os.cups() 可能存在 undefined
- 如何判断是否是一个 sourcemap
- 如何判断 ECMA 版本

## 在哪里进行的压缩呢？

```javascript
compilation.hooks.processAssets.tapPromise(
  {
    name: pluginName,
    stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
    additionalAssets: true,
  },
  (assets) =>
    this.optimize(compiler, compilation, assets, {
      availableNumberOfCores,
    })
);
```

## 打印信息的 hooks？

statsPrinter

```javascript
compilation.hooks.statsPrinter.tap(pluginName, (stats) => {
  stats.hooks.print
    .for("asset.info.minimized")
    .tap("terser-webpack-plugin", (minimized, { green, formatFlag }) =>
      minimized
        ? /** @type {Function} */ (green)(
            /** @type {Function} */ (formatFlag)("minimized")
          )
        : ""
    );
});
```
