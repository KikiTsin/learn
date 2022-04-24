const { generateRandomJS } = require("eslump");

const randomJSString = generateRandomJS({
  sourceType: "module",
  maxDepth: 7,
  comments: false,
  whitespace: false,
});
console.log(randomJSString)