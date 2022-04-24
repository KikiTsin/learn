let acorn = require("acorn");
let obj = acorn.parse("1 + 1", {ecmaVersion: 2020})
console.log(JSON.stringify(obj, null, 2));