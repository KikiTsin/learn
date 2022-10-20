// 判断str
function isPanlidrome (str) {

}

// 判断回文链表
function isPanlidromeLink (node) {
    let left = node;

    function traverse (n) {
        if (n == null) {
            return true;
        }

        let res = traverse(n.next)
        res = res && (left.val == n.val)
        left = left.next;
        return res;
    }

    return traverse(node)
}


// todo 用双指针来判断回文链表

