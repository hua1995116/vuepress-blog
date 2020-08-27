# 图解webpack(二) —— ES Modules 和 Code Splitting

先讲原理再将实践
会异步请求一个额外的 js 

分析 code splitting 后的 chunk 代码

模块是如何注册的？

需要注意的是，如果这个模块之前注册了，那么将不进行打包。


----module
        ----module
            -----module



你可以理解为两段同步的代码


但是要考虑到网络等因素，模块的注册并不是一定成功的。只有模块注册成功了，才能正常使用


上一讲中我们讲到了 webpack 的 CommonJS 的打包模式，CommonJS 的形态也是一种非常简单的模式，如果你还不熟悉，请先看上一讲。
今天我们来讲一讲 ES Modules 的打包方式 以及 Code Splitting 的原理，讲完原理后，我们再来继续完善我们的 tiny-webpack ，希望能够一步步完善，做一个五脏俱全的 tiny-webpack 。

ES Modules 
    AST
    @babel/parser
    @babel/traverse
    @babel/core
    babel 套餐
Code Splitting
    JSONP
    JS

ES Modules 的方式与 CommonJS 的主题思路都是差不多的。

解析文件
    寻找子依赖
        解析文件
结束
构建树
|
扁平数组
|
chunk
|
bundle

