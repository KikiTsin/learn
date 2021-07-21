map 与 obj普通对象有什么区别？应用场景？
- 键的类型：map可以是任意值，包括函数 对象等；object的键必须是string或者symbol
- size：map.size()获取属性个数；object需要通过keys
- 性能：map在频繁增删键值对的场景下表现更好；obj 在这种场景下 未作出优化。
  这个是不是跟内存优化有关？内联缓存 快属性 慢属性；最好不用delete方法