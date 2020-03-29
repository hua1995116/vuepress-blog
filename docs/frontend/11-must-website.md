# 提高前端开发者效率的11个必备的网站

> 本文翻译自 https://blog.bitsrc.io/12-useful-online-tools-for-frontend-developers-bf98f3bf7c63 但是不仅仅是单纯地翻译，替换了原文中一些我觉得不太实用的并加入一些自己的总结。


互联网上有很多很棒的工具，让我们作为前端开发人员的生活更加轻松。在这篇文章中，我将快速回顾一下我在开发工作中经常使用的11种工具。

## Node.green

用来查询当前 Node 版本是否某些功能。例如,对象展开符( Rest/Spread Properties)

![1582372545876.jpg](https://s3.qiufengh.com/blog/1582372545876.jpg)

可以看到在 `Node v8.3.0` 以下是不支持的。分别在 Node `v8.5.0` 和 `v8.2.1` 下运行以下代码片段

```javascript
const a = { foo: 1};
console.log({...a, b: 2});
```

![1582372779948.jpg](https://s3.qiufengh.com/blog/1582372779948.jpg)

当你遇到以上错误，那大多就是 `Node` 版本问题啦。

在线地址: https://node.green/


## CanIUse

当你想要确定某个 Web API 的兼容性的时候，这个在线工具将轻松搞定。

假设我们想知道哪些浏览器及其版本将支持 Web Share API：`navigator.share（...`

![1_pq1UczjJ8dhTsO6hCPntyw.png](https://s3.qiufengh.com/blog/1_pq1UczjJ8dhTsO6hCPntyw.png)

查看结果。浏览器和支持`navigator.share(…)`的版本都列出了。

在线地址: https://caniuse.com/

## Minify

为了减少应用程序代码的包大小，我们在发布到到生产环境的时候，需要使它们最小化。 最小化消除了空格，无效代码等。这能够使应用程序包大小的显着减小，从而节省浏览器上的加载时间。（虽然在当下，有 webpack uglifyJS 等插件，但是当我在开发非打包的简单应用的时候，这个是一个不错的选择。 ）

![1582373652825.jpg](https://s3.qiufengh.com/blog/1582373652825.jpg)

在线地址: https://www.minifier.org/

## Bit.dev

`Bit.dev`是一个非常棒的组件中心。 可以用它来托管，记录和管理来自不同项目的可复用组件。 这是增加代码复用，加速开发并优化团队协作的好方法。

这也是从头开始构建设计系统的不错选择（因为它本质上具有设计系统所需的一切）。 `Bit.dev`与`Bit`完美配合，Bit是处理组件隔离和发布的开源工具。

`Bit.dev`支持`React`，带有`TypeScript`的`React`，`Angular`，`Vue`等。

![1_Nj2EzGOskF51B5AKuR-szw.gif](https://s3.qiufengh.com/blog/1_Nj2EzGOskF51B5AKuR-szw.gif)

在线地址: https://bit.dev/


## Unminify

免费的在线工具，用于最小化（解压，反混淆）JavaScript，CSS和HTML代码，使其可读性强，美观

![1582375400913.jpg](https://s3.qiufengh.com/blog/1582375400913.jpg)

在线地址: https://unminify.com/

## Stackblitz

这是每个人都喜欢的工具。Stackblitz使我们能够使用世界上最流行和使用最多的IDE，即web上的Visual Studio代码。


只需单击一下，`Stackblitz` 即可快速提供`Angular`，`React`，`Vue`，`Vanilla`，`RxJS`，`TypeScript`项目的框架。

当你想从浏览器中尝试一段代码或任何当前JS框架中的功能时，`Stackblitz`非常有用。 假设你正在阅读`Angular`文章，并且遇到了想要尝试的代码。 您可以最小化您的浏览器并快速搭建一个新的Angular项目。

还有其他很棒的在线IDE，但是我相信`Stackblitz`的转折点是使用每个人都喜欢的 `Visual Studio Code`感觉和工具。
(ps: 本人使用体验,非常快速流畅, 附上图，比 sandbox 快很多)

![1582374042909.jpg](https://s3.qiufengh.com/blog/1582374042909.jpg)

在线地址: https://stackblitz.com/

## JWT.io

如果您使用JSON Web令牌（JWT）保护应用程序安全，或者使用JWT允许用户访问后端的受保护资源。

决定是否应访问路线或资源的一种方法是检查令牌的到期时间。 有时候我们想要解码JWT以查看其有效 `payload`，jwt.io恰好提供了这一点。

这个在线工具使我们能够插入令牌以查看其有效 `payload`。 一旦我们粘贴了令牌，`jwt.io`便对该令牌进行解码并显示其有效`payload`。

![1582374387059.jpg](https://s3.qiufengh.com/blog/1582374387059.jpg)

在线地址: https://jwt.io/

## BundlePhobia

您是否曾经不确定过`node_modules`的大小，或者只是想知道将`pakckage.json`安装在您的计算机中的大小？ BundlePhobia提供了答案

![1582374462632.jpg](https://s3.qiufengh.com/blog/1582374462632.jpg)

该工具使我们能够加载package.json文件，并显示将从package.json安装的依赖项的大小，也可以查询单包的体积。

在线地址: https://bundlephobia.com/

## Babel REPL

`Babel`是一个免费的开放源代码JS转编译器，用于将现代ES代码转换为普通的 ES5 JavaScript。

该工具是Babeljs团队在网上建立的Web应用，可以将 ES6 +代码转换为ES5。

本人总结的两个比较方便的使用方式
1. 方面面试时在线写高级语法。
2. 可以快速查看某些 polyfill 是怎么写的。

![1582374539633.jpg](https://s3.qiufengh.com/blog/1582374539633.jpg)

在线地址: https://babeljs.io/en/repl


## Prettier Playground

Prettier是一个自以为是的JS代码格式化程序。 它通过解析代码并使用JS最佳编码实践将其重新打印来实施一致的样式。

该工具已在我们的开发环境中广泛使用，但它也具有一个在线地址，你可以在其中美化您的代码。

![1582375260418.jpg](https://s3.qiufengh.com/blog/1582375260418.jpg)

在线地址: https://prettier.io/playground


## postwoman

`postman` 是一款功能强大的网页调试和模拟发送HTTP请求的Chrome插件，支持几乎所有类型的HTTP请求，操作简单且方便。可用于接口测试，比如测试你用easy-mock生成的接口。

![1582374841427.jpg](https://s3.qiufengh.com/blog/1582374841427.jpg)

在线地址: https://postwoman.io/

## 结论

列表中还有更多，但是这些是我的最爱。

如果您对此有任何疑问或我应添加，更正或删除的任何内容，请随时发表评论。

谢谢 ！！！

## 关注 
![gongzhonghao.png](https://s3.qiufengh.com/blog/gongzhonghao.png)