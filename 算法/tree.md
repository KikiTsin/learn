# 思路

是否可以通过遍历一遍二叉树得到答案？如果不能的话，是否可以定义一个递归函数，通过子问题（子树）的答案推导出原问题的答案? 如果需要设计到子树信息, 建议使用后续遍历.

## 中序遍历

```javascript
// 三种方式
// 1. 递归
// 2. 迭代
// 3. Morris
var morrisFn = function (root) {
    let res = []
    let pre = null;
    while (root) {
        if (!root.left) {
            res.push(root.val);
            root = root.right
        } else {
            // predecessor 
            pre = root.left
            while (pre.right && pre.right !== root) {
                pre = pre.right
            }
            if (!pre.right) {
                pre.right = root
                root = root.left
            } else {
                res.push(root.val)
                pre.right = null;
                root = root.right
            }
        }
    }
}
var inorderBST = function (root) {
    function generateRes (root) {
        let stack = []
        let inorder = -Infinity
        while (stack.length || root) {
            while (root) {
                stack.push(root)
                root = root.left
            }
            root = stack.pop()
            if (root.val < inorder) {
                return false
            }
            inorder = root.val
            root = root.right
        }
    }
    return generateRes (root)
}
```

二叉树中插入操作
```javascript
var insertIntoBST = function(root, val) {
    if (!root) {
        return new TreeNode(val)
    }
    let res = root
    while (res) {
        if (res.val < val) {
            if (res.right) {
                res = res.right
            } else {
                res.right = new TreeNode(val)
                break
            }
        } else {
            if (res.left) {
                res = res.left
            } else {
                res.left = new TreeNode(val)
                break
            }
        }
    }
    // 这里不能return res，而是root  内存地址指向问题
    return root
};
```