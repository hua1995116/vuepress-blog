# CodePen vue SFC 、flutter 在线玩耍来袭

首先介绍下，CodePen 是一个在线社区，用于测试和展示用户创建的 HTML，CSS 和 JavaScript 代码段。在上面有非常多的代码片段，以及 CSS 的各种有创意的 demo。我可以说很多各种奇幻的效果都产自于它，例如用 CSS 画出一幅油画，以及 CSS 画出各种卡通人物，这也是我第一个用的在线编辑网站。

接下来我们介绍，CodePen 新出的这两个在线功能，真的是爱了爱了，无论是对分享代码片段，还是快速尝鲜来说，都是非常好的体验。

## vue SFC

什么是 vue SFC ? 即`Single File Components` 一个` .vue 文件`。 `.vue` 文件是一个自定义的文件类型，用类 HTML 语法描述一个 Vue 组件。每个 .vue 文件包含三种类型的顶级语言块 `<template>`、`<script>` 和 `<style>`，还允许添加可选的自定义块.

在以前 CodePen 的在线编辑只支持 `html` 形式，因此在 `codepen` 上写代码，是这个样子的。

![WechatIMG838](https://s3.qiufengh.com/blog/WechatIMG838.png)

由于我们本地都是 `.vue` 形式开发， 对于这种形式比较无感觉，看上去也比较麻烦。因此像我，后来就转向 codesanbox.

![image-20200508235256926](https://s3.qiufengh.com/blog/image-20200508235256926.png)

因为他提供了像本地开发一样的模式，但是缺点就是慢，以及我们看他的交互方式，最初是三列的，虽然各个列可以收起，但是还是给我们提供了选择，用户其实对于选择和二次操作的事情是比较头疼的。虽然有缺点，但是我觉得他也是一个比较好的在线编辑器，很长的一段时间，我都用他来进行测试。

**但是！！今天！！我选择了 CodePen，他支持了 `vue SFC`。**

- 默认的两列布局，没有多余的东西需要去选择，
- 编写后实时编译的速度快。
- 单文件修改（很多时候，其实我们只需要一个 `.vue` 文件来进行在线测试。）

以下就是展示 Vue2 SFC (https://codepen.io/hua1995116/pen/xxwWjYj) 

![WechatIMG839](https://s3.qiufengh.com/blog/WechatIMG839.png)

来到左上角的设置换个` vue3` 来看看

![image-20200509001234514](https://s3.qiufengh.com/blog/image-20200509001234514.png)

Vue3 SFC https://codepen.io/hua1995116/pen/MWaVXGP

![image-20200509001322428](https://s3.qiufengh.com/blog/image-20200509001322428.png)

## flutter

这个功能，可以说对新人或者想要调试某个示例来说，非常方便了，直接可以上代码，先体验效果。

不需要安装环境，也不用再等待缓慢的构建。

我们使用 flutter 的官方列表 demo 来体验一把这个 online coding。

代码地址：https://flutterchina.club/catalog/samples/animated-list/

体验地址：https://codepen.io/pen/editor/flutter


![WechatIMG836](https://s3.qiufengh.com/blog/WechatIMG836.png)

<video src="/Users/huayifeng/Downloads/flutter.mp4"></video>


整个过程写代码非常流畅，编译速度也非常快。

更多例子:

https://codepen.io/zoeyfan/pen/mdeebvy

https://codepen.io/zoeyfan/pen/ExVaXGK

## 最后

推荐一波我收藏的在线编辑网站吧

https://codepen.io/ (支持 js 、html、vue、flutter 等)

https://jsfiddle.net/ (支持 js 、html )

https://jsbin.com/ (支持 js 、html )

https://babeljs.io/repl （支持 js 以及各种高级语法、带 console）

https://codesandbox.io/ （支持vue、angular、react、nest.js、svelte等）

https://stackblitz.com/ （支持angular、react、ionic、svelte等）