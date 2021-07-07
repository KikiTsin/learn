const doctrine = require('doctrine')
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
fse.writeFileSync('doctrine-ast.json', JSON.stringify(ast, null, 2))