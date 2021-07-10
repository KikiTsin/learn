// const mime = require('mime')
// console.log(mime.getType('json'))

// const base64id = require('base64id')
// console.log(base64id.generateId())

var MemoryFileSystem = require("memory-fs");
var fs = new MemoryFileSystem(); // Optionally pass a javascript object
 
fs.mkdirpSync("/a/test/dir");
fs.writeFileSync("/a/test/dir/file.txt", "Hello World");
console.log(fs.readdirSync("/a/test"));
// <Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
console.log(fs.readFileSync("/a/test/dir/file.txt")); // returns Buffer("Hello World")
 
// Async variants too
fs.unlink("/a/test/dir/file.txt", function(err) {
    // ...
});
 
console.log(fs.readdirSync("/a/test")); // returns ["dir"]
console.log(fs.statSync("/a/test/dir").isDirectory()); // returns true
fs.rmdirSync("/a/test/dir");

// {
//     isFile: [Function: falseFn],
//     isDirectory: [Function: trueFn],
//     isBlockDevice: [Function: falseFn],
//     isCharacterDevice: [Function: falseFn],
//     isSymbolicLink: [Function: falseFn],
//     isFIFO: [Function: falseFn],
//     isSocket: [Function: falseFn]
//   }
console.log(fs.statSync("/a/test/dir"))

