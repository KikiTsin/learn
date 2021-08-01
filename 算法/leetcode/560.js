
// 和为K的子数组
// 解题思路：pre - k 存在的时候，说明这一段新阶段的数字和==k
var subarraySum = function(nums, k) {
    let map1 = new Map()
    let count = 0
    let pre = 0
    map1.set(0, 1) // 设置这个 是为了pre===k的时候，获取到1
    for (let item in nums) {
        pre += item
        if (map1.has(pre - k)) {
            count += map1.get(pre - k)
        }
        if (map1.has(pre)) {
            // 不能map1.get(pre)++
            map1.set(pre, map1.get(pre) + 1)
        } else {
            map1.set(pre, 1)
        }
    }
};
subarraySum([1,1,1], 2)
subarraySum([1,2,3], 3)
subarraySum([1,-1, 0], 0)