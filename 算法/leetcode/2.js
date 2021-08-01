function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
// 两数相加
// 时间复杂度O(max(m+n))  空间复杂度O(1)
var addTwoNumbers = function(l1, l2) {
    let resNode = new ListNode()
    let temp = resNode
    let ten = 0
    while (l1 || l2) {
        let val = (l1 && l1.val || 0) + (l2 && l2.val || 0) + ten
        if (val >= 10) {
            // 可以用val%10 。。。
            val = Number((val + '').substr(-1))
            ten = 1
        } else {
            ten = 0
        }
        temp.val = val
        l1 = (l1 && l1.next) || null
        l2 = (l2 && l2.next) || null
        // ten 这里有一种情况是：[9,9,9,9,9,9,9]  [9,9,9,9] 后续超过10，还有1位要加在next上
        if (l1 || l2 || ten) {
            temp = temp.next = new ListNode(ten)
        }
    }
    return resNode
};
// [9,9,9,9,9,9,9]
// [9,9,9,9]
let res = addTwoNumbers({
    val: 9,
    next: {
        val: 9,
        next: {
            val: 9,
            next: {
                val: 9,
                next: {
                    val: 9,
                    next: {
                        val: 9,
                        next: {
                            val: 9
                        }
                    }
                }
            }
        }
    }
}, {
    val: 9,
    next: {
        val: 9,
        next: {
            val: 9,
            next: {
                val: 9,
            }
        }
    }
})
console.log(JSON.stringify(res))