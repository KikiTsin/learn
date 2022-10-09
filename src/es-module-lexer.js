import { init, parse } from 'es-module-lexer';

(async () => {
  await init;

  const source = `import { name } from 'name';

    export var p = 5;
    export function q () {
        console.log('q')
    };
    export { x as 'external name' } from 'external';
  `;

  const [imports, exports] = parse(source, 'optional-sourcename');
  console.log('imports', imports)
  console.log('exports', exports)
})()