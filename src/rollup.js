import { rollup } from "rollup";
import rollupPlugin from './rollup-plugin.js'
// see below for details on the options
const inputOptions = {
    input: 'src/source-map.js',
    plugins: [rollupPlugin()],
    external: [
      'source-map'
    ]
};
const outputOptions = {
    format: 'iife',
    file: 'src/test.js',
    globals: {
      'source-map': 'sourceMap'
    },
    name: 'kiki',
    rollupOptions: {
      output: {
        // docs: https://rollupjs.org/guide/en/#outputmanualchunks
        // 1. 对象配置
        // 没有vendor包了，把vendor拆分成 lodash react-vendor library三个包
        // dist/assets/lodash.0b61700c.js         199.99 KiB / gzip: 43.84 KiB
        // dist/assets/react-vendor.defb7da5.js   195.36 KiB / gzip: 48.54 KiB
        // dist/assets/library.38114fa4.js
        // manualChunks: {
        //   // 将 React 相关库打包成单独的 chunk 中
        //   'react-vendor': ['react', 'react-dom'],
        //   // 将 Lodash 库的代码单独打包
        //   'lodash': ['lodash-es'],
        //   // 将 组件库的代码打包
        //   'library': ['antd', '@arco-design/web-react'],
        // },
        // 2. 函数配置
        // manualChunks(id) {
        //   if (id.includes('antd') || id.includes('arco')) {
        //     return 'library';
        //   }
        //   if (id.includes('lodash-es')) {
        //     return 'lodash';
        //   }
        //   if (id.includes('node_modules/react')) {
        //     return 'react';
        //   }
        //   return 'vendor';
        // },
        // 会把react react-dom都打包进react-vendor.js这个文件内，但是lodash antd acro就会被打包进index.js，如果没有特殊处理的话
        // 3. 函数配置，解决循环依赖的问题
        manualChunks(id, { getModuleInfo }) { 
          console.log('id', id)
          console.log('getModuleInfo', getModuleInfo)
          for (const group of Object.keys(chunkGroups)) {
            const deps = chunkGroups[group];
            if (id.includes('node_modules') && isDepInclude(id, deps, [], getModuleInfo)) { 
              return group;
            }
          }
        },
      },
    },
};

async function build() {
  // create a bundle
  const bundle = await rollup(inputOptions);

  console.log('bundle', bundle)
  // generate code and a sourcemap
  const data = await bundle.generate(outputOptions);

  const [chunk] = data.output; // chunk: { imports: ['source-map'], exports: ['test'], type: 'chunk', code: '', map: null, fileName: 'test.js'(输出的文件名), facadeModuleId: '/Users/kikitsin/learn/src/source-map.js'（entry的文件名） }
  console.log(chunk.imports); // an array of external dependencies
  console.log(chunk.exports); // an array of names exported by the entry point
  console.log(chunk.modules); // an array of module objects
  
  // chunk.mudles = {
  //   // 不仅包括本文件，还包括import的文件
  //   // 比如源文件utils.js: export * from 'multi.js'; export function add () { console.log('add') }
  //   '/users/kikitsin/packages/src/multi.js': {
  //     code: 'codes....',
  //     originalLength: 51,
  //     renderedLength: 11,
  //     renderedExports: ['multi']
  //   },
  //   '/users/kikitsin/packages/src/util.js': {
  //     code: 'codes....',
  //     originalLength: 51,
  //     renderedLength: 11,
  //     renderedExports: ['add']
  //   },
  // }

  console.log(data.output)
  // or write the bundle to disk
  await bundle.write(outputOptions);
}

build();


function watch () {
  const watcher = rollup.watch({
    input: '',
    output: [
      {
        dir: '',
        format: 'esm'
      }
    ]
  })

  watcher.on('restart', () => {
    console.log('restart...')
  })

  watcher.on('change', (id) => {
    console.log(`发生变动的模块id: ${id}`)
  })

  watcher.on('event', (e) => {
    // e = {
    //   code: 'BUNDLE_END',
    //   duration: 31,
    //   input: './src/index.js',
    //   output: [
    //     'users/kikitsin/.../dist/es',
    //     'users/kikitsin/.../dist/cjs'
    //   ],
    //   result: {
    //     cache: {},
    //     closed: false,
    //     close: [],
    //     watchFiles: [''],
    //     ...
    //   }
    // }
    if (e.code === 'BUNDLE_END') {
      console.log(`打包信息:`, e)
    }
  })
}
