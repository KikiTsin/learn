# NodeJs

## 基础和架构

- nodejs 组成
  - V8 还支持自定义扩展
  - Libuv 跨平台的异步IO库, 还包括进程 线程 信号 定时器 进程间通信 线程池等
  - 第三方库：异步DNS解析 HTTP解析器 HTTP2解析器 解压压缩库 加密解密库等
- 代码架构
- 启动过程
- 事件循环
- 核心模块的实现
  - 进程和进程间通信
  - 线程和线程间通信
  - Cluster
  - Libuv 线程池
  - 信号处理
  - 文件
  - TCP
  - UDP
  - DNS

## Node api

- process.chdir 切换当前操作目录