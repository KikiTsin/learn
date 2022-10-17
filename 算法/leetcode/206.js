let a = {
    val: 'a',
    next: {
        val: 'b',
        next: {
            val: 'c',
            next: {
                val: 'd',
                next: null
            }
        }
    }
}

// 反转链表--递归的方式
function reverseLink (node) {
    while (node == null || node.next == null) {
        return node
    }
    let last = reverseLink(node.next)
    node.next.next = node;
    node.next = null;
    return last;
}

// 反转链表--迭代的方式
function reverseLinkIterate(node) {
    let pre = null, cur = node, next = node;
    while (cur !== null) {
        next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    return pre;
}

let successor = {}
// 反转第N个链表
function reverseNLink (node, n) {
    
    while (n == 1) {
        successor = node.next
        return node
    }
    let last = reverseNLink(node.next, n - 1)
    node.next.next = node;
    node.next = successor;
    return last;
}

reverseNLink(a)

// 反转链表的一部分，反转[m, n]间的链表
function reverseBetween (node, m, n) {
    if (m == 1) {
        return reverseNLink(node, n)
    }
    node.next = reverseBetween(node.next, m -1, n -1)
    return node;
}
