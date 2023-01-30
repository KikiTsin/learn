# Array

## flat

flat() 指定嵌套数组的结构深度，默认值为1.

```js
const arr1 = [ 0, 1, 2, [ 3, 4, 5, [ 6, 7, 8 ] ] ]

console.log(arr1.flat()) // [ 0, 1, 2,  3, 4, 5, [ 6, 7, 8  ] ]

console.log(arr1.flat(2)) // [ 0, 1, 2,  3, 4, 5, 6, 7, 8  ]
```
