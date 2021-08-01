 function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}
 
let root = {
    val: 4,
    left: {
        val: 1,
        left: {
            val: 0,
            left: null,
            right: null
        },
        right: {
            val: 2,
            left: null,
            right: {
                val: 3
            }
        }
    },
    right: {
        val: 6,
        left: {
            val: 5,
            left: null,
            right: null
        },
        right: {
            val: 7,
            left: null,
            right: {
                val: 8
            }
        }
    }
}
/**
* @param {TreeNode} root
* @return {TreeNode}
*/
// 538. 把二叉搜索树转换为累加树
// 解法1：反向 中序遍历
// 解法2: Morris 遍历???
var convertBST = function(root) {
    function getInorder (root) {
        let stack = []
        let res = []
        let sum = 0
        while (stack.length || root) {
            while (root) {
                stack.push(root)
                root = root.right
            }
            root = stack.pop()
            sum += root.val
            root.val = sum
            root = root.left
        }
        return res
    }
    getInorder(root)
    // function getSum (arr) {
    //     let sum = arr.reduce((sum, item, index) => {
    //         sum += item
    //         return sum
    //     }, 0)
    //     return sum
    // }
    // function convert (root) {
    //     if (root) {
    //         let index = inorderRes.indexOf(root.val)
    //         root.val = getSum(inorderRes.slice(index))
    //         convert(root.left)
    //         convert(root.right)
    //     }
    // }
    // convert(root)
    console.log(JSON.stringify(root))
};
convertBST(root)