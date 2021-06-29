条件的选择具有优先级的时候，使用 BFS + 优先级队列更加方便。
一些类似动态规划的题目，使用 DFS + 记忆化搜索更加方便。

DFS 连通域问题
```javascript
// 明天做一下：https://leetcode-cn.com/problems/surrounded-regions/
// 上下左右相邻的元素为一体的话， 1为黑色 0为白色 有几块白色？
var a = [
    [1,1,0,0],
    [1,1,0,0],
    [1,1,0,0],
    [1,1,0,0],
]
function getabc (arr) {
    let num = 0
    function dfs (i, j) {
        debugger
        if (i < 0 || j < 0 || i > (arr.length -1) || j>(arr[0].length -1) || arr[i][j] !== 0)  {
            return false
        }
        
        if (arr[i][j] === 0) {
            arr[i][j] = 2;
            dfs(i-1, j);
            dfs(i+1, j);
            dfs(i, j-1);
            dfs(i, j+1);
        }
        
    }
    for (let i = 0; i< arr.length;i++) {
        for (let j = 0; j< arr[0].length; j++) {
            if (arr[i][j] === 0) {
                num += 1;
                dfs(i, j)
            }
        }
    }
    return {arr, num}
}
```
DFS最优解 学完回溯再来看 TODO
```javascript
```

BFS代码模版     
```javascript
var levelOrder = function(root) {
    let ret = []
    let q = []
    if (!root) {
        return []
    }
    q.push(root)
    while (q.length) {
        ret.push([])
        let l = q.length
        for (let i = 0; i < l; i++) {
            let node = q.shift()
            ret[ret.length -1].push(node.val)
            if (node.left) q.push(node.left) 
            if (node.right) q.push(node.right) 
        }
    }
    return ret
};
```

没学：最短路径 https://github.com/lagoueduCol/Algorithm-Dryad/blob/main/13.DFS.BFS/1091.%E4%BA%8C%E8%BF%9B%E5%88%B6%E7%9F%A9%E9%98%B5%E4%B8%AD%E7%9A%84%E6%9C%80%E7%9F%AD%E8%B7%AF%E5%BE%84.py?fileGuid=xxQTRXtVcqtHK6j8

【最安全的路径】【最优解】