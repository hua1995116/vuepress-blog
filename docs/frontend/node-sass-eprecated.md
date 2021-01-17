## Node Sass 弃用，以 Dart Sass 代替

![1603799589156](https://s3.qiufengh.com/blog/1603799589156.jpg)

就在今天，Sass 官方团队正式宣布 Libsass 将弃用，以及基于它的 Node Sass 和 SassC，并且建议用户使用 Dart Sass。

首先我们看下官方博客的一些回复（前半部分均来自官方博客 https://sass-lang.com/blog/libsass-is-deprecated），然后我们再来对 Node Sass 和 Dart Sass 做一个基准测试。读完本文以下问题将会得到解答。

- 那么为什么会有这次改动呢？

- 之后 Node Sass 还维护吗？

- Dart Sass 能满足我们的需求吗？

- Dart Sass 的性能如何？

- Dart Sass 带来的好处和坏处。

### 背景说明

此次改动是在 Sass 核心团队进行了大量讨论之后，得出的结论，现在是时候正式宣布弃用 LibSass 和基于它构建的包(包括 Node Sass)。多年来，LibSass 显然没有足够的工程带宽来跟上 Sass 语言的最新发展 (例如，最近的语言特性是在 2018 年 11 月添加的)。尽管我们非常希望看到这种情况有所改善，但即使 LibSass 长期贡献者 Michael Mifsud 和 Marcel Greter 的出色工作也无法跟上 CSS 和 Sass 语言开发的快速步伐。

主要包括以下四点说明

- 不再建议将 LibSass 用于新的 Sass 项目， 改为使用 [Dart Sass](https://sass-lang.com/dart-sass)。

- 建议所有现有的 LibSass 用户制定计划，最终迁移到 Dart Sass，并且所有 Sass 库都制定计划 最终放弃对 LibSass 的支持。

- 不再计划向 LibSass 添加任何新功能，包括与新 CSS 功能的兼容性。

- LibSass 和 Node Sass 将在尽力而为的基础上无限期维护，包括修复主要的错误和安全问题以及与最新的 Node 版本兼容。

### 为什么弃用？

几年来，Sass 一直处于一种模棱两可的状态，LibSass 在理论上是官方支持实现，但实际上从它的功能表现来看是静止的。 随着时间的流逝，越来越清楚感受到这种状态对 Sass 用户已经造成了切实的问题。 例如，经常让用户感到困惑，[为什么原生 CSS 的 min() 和 max() 无法正常工作](https://github.com/sass/sass/issues/2849)，可能会认为 Sass 整体存在问题，但是实际上是因为 LibSass 不支持该功能。

官方支持的 LibSass 不仅会给个别用户带来痛苦，由于 LibSass 不支持去年启动的 [Sass 模块系统](https://sass-lang.com/blog/the-module-system-is-launched)，主要相关的 Sass 库由于担心其下游用户不兼容而无法使用它， 明确指出所有 Sass 用户应该放弃使用 LibSass，我们希望使这些 library 的作者能够更加切实地使用更多现代的功能特性。

LibSass 甚至抑制了 Sass 语言本身的发展。 我们无法继续推进有关 [treating `/` as a separator](https://github.com/sass/sass/blob/master/accepted/slash-separator.md) 的提议，因为他们编写的任何代码都会在 Dart Sass 中产生弃用警告或无法在 LibSass 中编译。 通过将 LibSass 标记为已弃用，情况会变得更好，并且 Sass 在支持最新版本的 CSS 方面会变得更好。

### "弃用"意味着什么？

我们之所以选择使用"弃用"一词，是因为它在编程社区中具有很大的分量，并强烈表明用户应该开始计划放弃 LibSass。 但是，这并不意味着该项目已经完全死了。 LibSass 和 Node Sass 的首席维护者 Michael Mifsud 确认他计划继续进行与过去几年相同级别的维护。 **这意味着尽管将不再添加任何功能**（并且这样 LibSass 会慢慢地逐渐偏离与最新 CSS 和 Sass 语法的兼容性 ）**，但将继续无限期地发布维护版本**。

### 可移植性和性能呢

LibSass 与 DartSass 相比有两个主要优点：

- 可移植性：由于它是用 C++ 编写的，因此可以轻松地将 LibSass 嵌入其他编程语言中并提供原生(native-feeling) API。
- 性能：通过 C++ API 调用 LibSass 与使用脚本语言直接编写代码的速度相比非常快。 特别是，这意味着 LibSass 在 JavaScript 中比 Dart Sass 编译为 JS 的库速度要快得多（尽管它可与 Dart Sass 的命令行可执行文件相媲美）。

我们正在使用 [Sass 嵌入式协议](https://github.com/sass/embedded-protocol)来解决这两个问题，该协议将 Sass 编译器作为子进程运行，可以通过消息传递与任何主机语言进行通信。 嵌入式协议支持本地 Sass API 的所有功能，包括定义自定义导入程序和 Sass 函数的能力，同时还提供高性能的 CLI 应用程序。 Dart Sass 已经实现了嵌入式协议的编译器端，并且正在积极开发 JavaScript 端。

### Dart Sass

Dart Sass 可以编译为纯 JavaScript 编写的 sass 软件包上传到 npm 。 纯 JS 版本比独立的可执行文件慢，但易于集成到现有工作流程中，并且允许你在 JavaScript 中定义自定义函数和导入器。

当通过 npm 安装时，Dart Sass 目标是实现一个与 Node Sass 兼容的 JavaScript API 库。完全兼容还在开发中，但是 Dart Sass 目前支持 render() 和 renderSync() 函数。但是请注意，在默认情况下，由于异步回调的开销，renderSync() 的速度是 render() 的两倍以上。

```js
// 使用示例
var sass = require("sass");

sass.render(
  {
    file: scss_filename,
  },
  function(err, result) {
    /* ... */
  }
);

// OR

var result = sass.renderSync({
  file: scss_filename,
});
```

### 基准测试

测试脚本仓库: https://github.com/hua1995116/sass-benchmark

接下来我们分别来测试一下，Node Sass 以及 Dart Sass 同步以及异步的性能。

测试 Sass 文件: https://github.com/ElemeFE/element/blob/dev/packages/theme-chalk/src/date-picker/date-picker.scss

测试机型: `MacBook Pro (Retina, 15-inch, Mid 2014)`

Node 版本: `v12.16.0`

基准测试库: `benchmark`

**速度测试**

说明: 利用 `benchmark` 进行基准测试

结果:

> sass async x 14.01 ops/sec ±27.72% (55 runs sampled)
> sass sync x 28.83 ops/sec ±7.24% (63 runs sampled)
> node-sass async x 47.50 ops/sec ±3.10% (58 runs sampled)
> Fastest is node-sass async

**说明: 值越大，代表速度越快，性能越好。**

![image-20201027215648632](https://s3.qiufengh.com/blog/image-20201027215648632.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

**内存测试**

说明: 三个方法各操作 50 次后的情况。

结果:

![image-20201027220422892](https://s3.qiufengh.com/blog/image-20201027220422892.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

可以看到 Node Sass 性能确实非常好，也是官方提到的优势。而 Dart Sass 同步的方法 比 异步方法 性能略高 2 倍左右。

### 总结

总体来看 Dart Sass 面向未来，支持各种新的特性。Dart Sass 纯 JS 的方式也可以让我们摆脱被 Node Sass 编译支配的恐惧，不用再担心 Node Sass 安装不成功的问题了，并且 Dart Sass 也在积极地处理它的性能问题。
