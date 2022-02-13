## webpack loader 和 plugin 的区别

loader 是一个转化器

例如：

- 样式：style-**loader**、css-**loader**、less-**loader**、sass-**loader**等
- 文件：raw-**loader**、file-**loader** 、url-**loader**等
- 编译：babel-**loader**、coffee-**loader** 、ts-**loader**等

plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务

![](https://i.loli.net/2020/04/10/DHi8YULbw1fzcMW.jpg)

插件生命周期

1. `Compile` 开始进入编译环境，开始编译
2. `Compilation` 即将产生第一个版本
3. `make`任务开始
4. `optimize`作为`Compilation`的回调方法，优化编译，在`Compilation`回调函数中可以为每一个新的编译绑定回调。
5. `after-compile`编译完成
6. `emit`准备生成文件，开始释放生成的资源，**最后一次添加资源到资源集合的机会**
7. `after-emit`文件生成之后，编译器释放资源





webpack 插件系统  https://github.com/webpack/tapable#tapable



插件第一个写法

https://webpack.js.org/concepts/plugins/#anatomy

可以参考文章

https://beacelee.com/2018-01-18-%E8%A7%A3%E6%9E%90webpack%20plugin%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%EF%BC%8C%E4%B9%A6%E5%86%99%E8%87%AA%E5%B7%B1%E7%9A%84%E7%AC%AC%E4%B8%80%E4%B8%AAplugin/





常见考题：

https://juejin.cn/post/6844904094281236487
