## vant-cli

## QA
- esmodule和cjs打包代码一样，是哪里区分出来的最终代码呢？
```javascript
presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          modules: useESModules ? false : 'commonjs',
          loose: options.loose,
        },
      ]
    ],
```
```javascript
import { readFileSync } from 'fs';
import { declare } from '@babel/helper-plugin-utils';
// .vue结尾且用了ts的文件
module.exports = declare(() => ({
  overrides: [
    {
      test: (filePath: string) => {
        if (/\.vue$/.test(filePath)) {
          const template = readFileSync(filePath, { encoding: 'utf8' });
          return (
            template.includes('lang="ts"') || template.includes("lang='ts'")
          );
        }

        return false;
      },
      plugins: [require('@babel/plugin-transform-typescript')],
    },
  ],
}));
```
## commands
- commander 
- commands:
    - lint
        - runCommand: eslint stylelint
    - release
        - releaseit--> build() changelog()
    - changelog  详细见【项目管理】
    - dev
        - new webpackDevServer(new webpack(config)) 通过webpack-dev-server起服务
    - build
        - 清除之前打包好的缓存文件es lib等目录 await clean();
            - remove(ES_DIR),    remove(LIB_DIR),    remove(DIST_DIR),    remove(VETUR_DIR),    remove(SITE_DIST_DIR)
    - 安装依赖，判断是yarn还是npm；await installDependencies();
    - 监听文件变化watchFileChange
        - await copy(path, esPath);      await copy(path, libPath);      await compileFile(esPath);      await compileFile(libPath);      await genStyleDepsMap();      genComponentStyle({ cache: false });
    - 开始处理打包任务：await runBuildTasks();
        - 遍历执行tasks
        - tasks: copySourceCode/ buildPackageScriptEntry/ buildStyleEntry/ buildPackageStyleEntry/ buildTypeDeclarations/ buildESMOutputs/ buildCJSOutputs/ buildBundledOutputs
        - copySourceCode 把src目录copy到es lib目录下
        - **buildPackageScriptEntry** **在es和lib目录下生成index.js文件，index.js内容**：import ** from './'; export * ; export default { install, version} 等
        - buildTypeDeclarations 打包.d.ts文件
        - buildESMOutputs/buildCJSOutputs 构建src/components/ts文件, 读取目录，遍历各个文件，针对js less/sass .vue文件做相应的compileJS compileStyle compileSfc等
            - isSfc ? compileSfc
            - isScript ? compileJS
                - fs.readFileSync读取出code
                - 正则匹配出import的css js文件，改后缀为.css等
                - @babel/core的transformAsync转换code，写入文件
            - isStyle ? compileStyle
                - 判断是less还是sass，先把less sass转译成css；
                    - import { renderSync } from 'sass';
                    -   const { css } = renderSync({ file: filePath, importer: tildeImporter });
                - compileCSS，用postcss加autoprefixer
                    - const config = await postcssrc({}, POSTCSS_CONFIG_FILE);
                    - const { css } = await postcss(config.plugins as any).process(source, { from: undefined, });
            - remove未编译的文件
        - buildBundledOutputs: compilePackage.ts 打包出lib/vant.js lib/vant.min.js文件
            - 获取webpack.config信息，new webpack(config) 打包


## Components

#### 主要是jsx的写法，函数式提取封装，vue.install vue3(defineComponent) 把下面的问题解决后，还是先看下vue的源码吧。。。

目前看了几个简单的组件：
- button
- action-bar
- dialog
```javascript
// dialog封装成function-call
export function mountComponent(RootComponent: Component) {
  const app = createApp(RootComponent);
  const root = document.createElement('div');

  document.body.appendChild(root);

  return {
    instance: app.mount(root),
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    },
  };
}
```

### QA
```javascript
export default Button;
export { Button };
export type { ButtonType, ButtonSize } from './Button';

defineComponent({
    setup: () => {}
})

Record: https://www.tslang.cn/docs/handbook/advanced-types.html 定义了键值对的类型
export type AreaList = {
  city_list: Record<string, string>;
};

PropType  from 'vue'
loadingType: String as PropType<LoadingType>,

type: String as PropType<keyof HTMLElementTagNameMap>,

export function trigger(target: Element, type: string) {
  const inputEvent = document.createEvent('HTMLEvents');
  inputEvent.initEvent(type, true, true);
  target.dispatchEvent(inputEvent);
}

export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === 'object';
}
```