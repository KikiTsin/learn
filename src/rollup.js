import { rollup } from "rollup";
// see below for details on the options
const inputOptions = {
    input: 'src/source-map.js',
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
    name: 'kiki'
};

async function build() {
  // create a bundle
  const bundle = await rollup(inputOptions);

  console.log('bundle', bundle)
  // generate code and a sourcemap
  const data = await bundle.generate(outputOptions);

  const [chunk] = data.output;
  console.log(chunk.imports); // an array of external dependencies
  console.log(chunk.exports); // an array of names exported by the entry point
  console.log(chunk.modules); // an array of module objects
  
  console.log(data.output)
  // or write the bundle to disk
  await bundle.write(outputOptions);
}

build();

