// 无重复字符的最长子串
// 输入: s = "abcabcbb"
// 输出: 3 
// 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
let lengthOfLongestSubstring = function (s) {
    let map = new Map()
    let start = 0;
    let l = s.length;
    let max = 0
    for (let i = 0; i < l; i++) {
        let item = s.charAt(i)
        let pos = map.get(item)
        // pos >= start 这个判断很重要
        if (map.has(item) && pos >= start) {
            start = pos + 1
        }
        // start=pos+1  i-start+1 一些异常情况：''
        max = Math.max(max, i - start + 1)
        map.set(item, i)
    }
    return max
}
console.log(lengthOfLongestSubstring("abcabcbb"))
console.log(lengthOfLongestSubstring(""))