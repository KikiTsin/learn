// 理解题意

// 数据被读取了，就是被使用了，所在的位置要刷新，浮到“顶部”。
// 写入数据时：
// 之前就存在的：更新数据，刷新位置。
// 之前不存在的：有位置就直接写入，没有位置，就删掉最久没有使用的条目，再写入。
// 要求 get 和 put 为 
// O
// (
// 1
// )
// O(1)，这俩操作都可能导致条目的移动(有删除操作)，所以删除操作也要是 
// O
// (
// 1
// )
// O(1)。
// 选择什么数据结构？

// O
// (
// 1
// )
// O(1) 的快速查找，就哈希表了。
// 光靠哈希表可以吗？
// 哈希表是无序的，无法知道里面的键值对哪些最近访问过，哪些很久没访问。
// 快速删除，谁合适？
// 数组？元素的插入/移动/删除都是 
// O
// (
// n
// )
// O(n)。不行。
// 单向链表？删除节点需要访问前驱节点，只能花 
// O(n)
// O(n) 从前遍历查找。不行。
// 双向链表，结点有前驱指针，删除/移动节点都是纯纯的指针变动，都是 
// O(1) O(1)。
// 双向链表、哈希表，各自的角色

// 双向链表的结点：存 key 和 对应的数据值。
// 哈希表的存在意义：快速访问【存储于双向链表】的数据，不是它自己存数据
// key：双向链表中存的 key
// value：链表结点的引用。
// 定义 ListNode 节点


// class ListNode {
//   constructor(key, value) {
//     this.key = key     
//     this.value = value
//     this.next = null
//     this.prev = null
//   }
// }
// 定义 LRUCache


// class LRUCache {
//   constructor(capacity) {     
//     this.capacity = capacity  // 容量
//     this.hash = {}            // 哈希表
//     this.count = 0            // 缓存数目
//     this.dummyHead = new ListNode() // 虚拟头结点
//     this.dummyTail = new ListNode() // 虚拟尾节点
//     this.dummyHead.next = this.dummyTail
//     this.dummyTail.prev = this.dummyHead // 还未添加真实节点，将虚拟头尾节点相连
//   }
// }
// 设计 dummyHead 和 dummyTail 的意义

// 虚拟头尾节点，只是为了让对真实头尾节点的操作，和对其他节点的操作一致，方便快速访问头尾节点。
// get 方法实现

// 哈希表中找不到对应的值，则返回 -1。被读取的节点，要刷新它的位置，移动到链表头部

// get(key) {
//   let node = this.hash[key]      // 从哈希表中，获取对应的节点
//   if (node == null) return -1    // 如果节点不存在，返回-1
//   this.moveToHead(node)          // 被读取了，该节点移动到链表头部
//   return node.value              // 返回出节点值
// }
// moveToHead方法实现

// moveToHead(node) {         
//   this.removeFromList(node) // 先从链表中删除
//   this.addToHead(node)      // 再加到链表的头部
// }
// removeFromList(node) {        
//   let temp1 = node.prev     // 暂存它的后继节点
//   let temp2 = node.next     // 暂存它的前驱节点
//   temp1.next = temp2        // 前驱节点的next指向后继节点
//   temp2.prev = temp1        // 后继节点的prev指向前驱节点
// }
// addToHead(node) {                 // 插入到虚拟头结点和真实头结点之间
//   node.prev = this.dummyHead      // node的prev指针，指向虚拟头结点
//   node.next = this.dummyHead.next // node的next指针，指向原来的真实头结点
//   this.dummyHead.next.prev = node // 原来的真实头结点的prev，指向node
//   this.dummyHead.next = node      // 虚拟头结点的next，指向node
// }
// put 方法实现

// 写入新数据，要先检查容量，看看是否要删“老家伙”，然后创建新的节点，添加到链表头部(最不优先被淘汰)，哈希表也更新一下。
// 写入已有的数据，则更新数据值，刷新节点的位置。

// put(key, value) {
//   let node = this.hash[key]            // 获取链表中的node
//   if (node == null) {                  // 不存在于链表，是新数据
//     if (this.count == this.capacity) { // 容量已满
//       this.removeLRUItem()             // 删除最远一次使用的数据
//     }
//     let newNode = new ListNode(key, value) // 创建新的节点
//     this.hash[key] = newNode          // 存入哈希表
//     this.addToHead(newNode)           // 将节点添加到链表头部
//     this.count++                      // 缓存数目+1
//   } else {                   // 已经存在于链表，老数据
//     node.value = value       // 更新value
//     this.moveToHead(node)    // 将节点移到链表头部
//   }
// }
// removeLRUItem 方法实现

// removeLRUItem() {               // 删除“老家伙”
//   let tail = this.popTail()     // 将它从链表尾部删除
//   delete this.hash[tail.key]    // 哈希表中也将它删除
//   this.count--                  // 缓存数目-1
// }
// popTail() {                      // 删除链表尾节点
//   let tail = this.dummyTail.prev // 通过虚拟尾节点找到它
//   this.removeFromList(tail)      // 删除该真实尾节点
//   return tail                    // 返回被删除的节点
// }



class ListNode {
  constructor(key, value) {
    this.key = key
    this.value = value
    this.next = null
    this.prev = null
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity
    this.hash = {}
    this.count = 0
    this.dummyHead = new ListNode()
    this.dummyTail = new ListNode()
    this.dummyHead.next = this.dummyTail
    this.dummyTail.prev = this.dummyHead
  }

  get(key) {
    let node = this.hash[key]
    if (node == null) return -1
    this.moveToHead(node)
    return node.value
  }

  put(key, value) {
    let node = this.hash[key]
    if (node == null) {
      if (this.count == this.capacity) {
        this.removeLRUItem()
      }
      let newNode = new ListNode(key, value)
      this.hash[key] = newNode
      this.addToHead(newNode)
      this.count++
    } else {
      node.value = value
      this.moveToHead(node)
    }
  }

  moveToHead(node) {
    this.removeFromList(node)
    this.addToHead(node)
  }
  
  removeFromList(node) {
    let temp1 = node.prev
    let temp2 = node.next
    temp1.next = temp2
    temp2.prev = temp1
  }

  addToHead(node) {
    node.prev = this.dummyHead
    node.next = this.dummyHead.next
    this.dummyHead.next.prev = node
    this.dummyHead.next = node
  }

  removeLRUItem() {
    let tail = this.popTail()
    delete this.hash[tail.key]
    this.count--
  }

  popTail() {
    let tail = this.dummyTail.prev
    this.removeFromList(tail)
    return tail
  }
}