// k个一组翻转链表
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

function reverseIterate(a, b) {
    let pre = null, cur = a, next = a;
    while (cur !== b) {
        next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    return pre;
}

function reverseGroup (node, k) {
    if (node == null) {
        return null;
    }
    let a, b;
    a = b = node;
    for (let i = 0; i < k; i++) {
        if (b == null) {
            return node;
        }
        b = b.next
    }

    let newHead = reverseIterate(a, b)
    a.next = reverseGroup(b, k)
    return newHead;
}

reverseGroup(a, 2)