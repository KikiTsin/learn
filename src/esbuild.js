import { build, transformSync } from 'esbuild'

// transform的话，转换后的代码中还有require，需要做额外的处理

// let transformCode = transformSync(`const dynamicImport = () => {
//     return import('./kiki');
// }

// dynamicImport()

// const kiki = 'kiki123'

// export default kiki`, {
//     loader: 'js',
//     target: [
//     'es2017',
//     'chrome58',
//     'edge16',
//     'firefox57',
//     'node12',
//     'safari11',
//     ],
// })

// console.log(transformCode.code)

let esbuildScanPlugin = {
    name: 'esbuild-scan',
    setup(build) {

        // A callback added using onResolve will be run on each import path in each module that esbuild builds.
        // 只过滤import引入
        build.onResolve({
            filter: /kiki/
        }, args => {
            // IMPORTANT!!!
            // args = {
            //     importer: '/users/kikitsin/learn/src/esbuild-test.js', 引用的源文件
            //     kind: 'import-statement',
            //     namespace: 'file',
            //     path: 'https://unpkg.com/lodash-es@4.17.15/lodash.js', // 引用包的链接
            //     pluginData: undefined,
            //     resolveDir: '/users/kikitsin/learn/src'
            // }
            console.log(args)
            return {
                path: args.path,
                namespace: 'kiki-test' // 重命名给kiki-test --- virtual modules虚拟模块，file对应的file system中的文件模块
            }
        })


        // A callback added using onLoad will be run for each unique path/namespace pair that has not been marked as external.
        build.onLoad({
            filter: /.*/,
            namespace: 'kiki-test'
        }, (args) => {
            // onloadArgs = {
            //     namespace: 'kiki-test',
            //     path: 'https://unpkg.com/lodash-es@4.17.15/lodash.js',
            //     pluginData: undefined,
            //     suffix: ''
            // }
            console.log('onload', args)
            // if (!hasImports && !exports.length) {
            //     // cjs
            //     contents += `export default require("${relativePath}");`
            //   } else {
            //     if (exports.includes('default')) {
            //       contents += `import d from "${relativePath}";export default d;`
            //     }
            //     if (hasReExports || exports.length > 1 || exports[0] !== 'default') {
            //       contents += `\nexport * from "${relativePath}"`
            //     }
            //   }
            // 重写contents后打包出来的代码 会替换掉原来的import * from 'https://lodash.js' 为 kiki-contents;
            return {
                contents: `import d from "${args.path}";export default d;`
            }
            // the res.outputFiles[0].text turns to :
            // kiki-test:https://unpkg.com/lodash-es@4.17.15/lodash.js
            // kiki - contents;

            // // src/esbuild-test.js
            // console.log((void 0)([1, 2], ["a", "b"]));
            // var kiki2 = "kiki123";
            // var esbuild_test_default = kiki2;
            // export {
            // esbuild_test_default as default
            // };
        })
    }
}

let regFib = /^fib((\d*))/;

let virtualModuleFn = {
    name: 'esbuild-virtual-module-fn',
    setup(build) {
        build.onResolve({ filter: regFib }, args => {
            console.log('fn args', args)
            return { path: args.path, namespace: 'fib' }
        })
        build.onLoad({ filter: regFib, namespace: 'fib' }, args => {
                let match = regFib.exec(args.path), n = +match[1]
                let contents = n < 2 ? `export default ${n}` : `
                    import n1 from 'fib(${n - 1}) ${args.path}'
                    import n2 from 'fib(${n - 2}) ${args.path}'
                    export default n1 + n2`
                return { contents }
        })
    }
}

let envPlugin = {
    name: 'env',
    setup(build) {
      // Intercept import paths called "env" so esbuild doesn't attempt
      // to map them to a file system location. Tag them with the "env-ns"
      // namespace to reserve them for this plugin.
      build.onResolve({ filter: /^env$/ }, args => {
          console.log('args')
          return {
            path: args.path,
            namespace: 'env-ns',
          }
      })
  
      // Load paths tagged with the "env-ns" namespace and behave as if
      // they point to a JSON file containing the environment variables.
      build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => {
          console.log('load---->')
          return {
            contents: JSON.stringify({
                NODE_ENV: 'NODE_ENV_STG'
            }),
            loader: 'json',
          }
      })
    },
  }
  

let esbuildResults = build({
    absWorkingDir: process.cwd(),
    write: false, // 不写入磁盘，in-memory buffers
    entryPoints: ['src/util.js'],
    bundle: true,
    format: 'cjs',
    logLevel: 'error',
    plugins: [
        // envPlugin,
        // virtualModuleFn
        // esbuildScanPlugin // 这个插件处理了html文件，否则会报错：No loader is configured for ".html" files: src/esbuild-test.html
    ]
})
esbuildResults.then((res) => {
    // res = {
    //     errors: [],
    //     warnings: [],
    //     outputFiles: [
    //         {
    //             path: '<stdout>',
    //             contents: 'buffers',
    //             text: `// src/esbuild-test.js
    //             var kiki = "kiki123";
    //             var esbuild_test_default = kiki;
    //             export {
    //               esbuild_test_default as default
    //             };`
    //         }
    //     ]
    // }
    console.log('esbuild results:', res.outputFiles[0].text)
})