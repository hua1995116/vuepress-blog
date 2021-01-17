# 请查收 2020 全球 JS 调查结果

> 完整报告地址: https://2020.stateofjs.com/zh-Hans/
> 润色/翻译: 蓝色的秋风(github/hua1995116)

千呼万唤的全球2020的JS报告终于出来了。顺便附上2020全球CSS报告地址 [2020年度全球CSS报告新鲜出炉](https://segmentfault.com/a/1190000038427691)

![image-20210114001259007](https://s3.qiufengh.com/blog/image-20210114001259007.png)

我们来看看这一个糟糕却又不平凡的一年，JS发生了什么样的变化。

![image-20210114001739976](https://s3.qiufengh.com/blog/image-20210114001739976.png)

尽管2020年很糟糕，但 JavaScript 作为一个整体仍然设法向前发展。随着语言本身的不断改进，得益于诸如**可选链操作符**和**空值合并操作符**并等新特性，TypeScript静态类型的普及更是将JS带到了一个全新的高度。

在框架方面，就在我们认为一切都已解决的时候，Svelte 横空出世以全新方式给前端注入新的血液。 在多年的webpack统治下，甚至构建工具也显示出新活动的迹象。

但是这次的区别是，相对而言，“老”后卫什么都没走。 Svelte和Snowpack很棒，但是React和webpack也很棒。 可以肯定的是，它们最终也会成为JavaScript大流氓的牺牲品，但是不会持续很多年。

所以，让我们享受我们所拥有的: 一个不断变得更好的伟大的生态系统！

## 访问对象统计

采样对象一共为 20744 位开发者。

![image-20210114003014449](https://s3.qiufengh.com/blog/image-20210114003014449.png)

## 特性

虽然大多数受访者都知道调查中提到的大多数JavaScript特性，但很多人还没有真正使用它们。

这图表显示了按类别分组的所有特性的不同采用率。外圈的大小对应于了解某项功能的用户总数，而内圈则代表实际使用过该功能的用户。

![image-20210114003419236](https://s3.qiufengh.com/blog/image-20210114003419236.png)

## 技术现状

2016年 - 2020年 趋势图

每条线从2016年到2020年（粗部为2020）。纵轴越高，表示一项技术被更多的人使用，横轴越大，表示有更多的用户想要学习，或者曾经使用过，还会再次使用。

![image-20210114004041187](https://s3.qiufengh.com/blog/image-20210114004041187.png)

可以看出随着年限的的增长。webpack、Express、TypeScript、Jest、React 可以说是非常强势了。

### 风味（Flavors）

![image-20210114011042569](https://s3.qiufengh.com/blog/image-20210114011042569.png)

可以看出 TypeScript 依旧独领风骚，其次就是 Elm ，但是 PureScript 也是一个值得关注的增强类型语言。

![image-20210114004722545](https://s3.qiufengh.com/blog/image-20210114004722545.png)

对 TypeScript 的熟悉度一片叫好。

**其他工具**

![image-20210114004757675](https://s3.qiufengh.com/blog/image-20210114004757675.png)

### 前端框架

![image-20210114011217904](https://s3.qiufengh.com/blog/image-20210114011217904.png)

正如开头所说，svelte 的出现真的是对前端行业的冲击，原以为三大框架（React、Vue.js、Angular）包揽所有的时候，它出现了，一度成为了第四名（使用量），但是从兴趣度和满意度来看，它未来的潜力不可估量。

兴趣度

![image-20210114011448248](https://s3.qiufengh.com/blog/image-20210114011448248.png)

满意度

![image-20210114011511595](https://s3.qiufengh.com/blog/image-20210114011511595.png)

### 数据层

![image-20210114011556857](https://s3.qiufengh.com/blog/image-20210114011556857.png)

使用排名比较高的状态管理依旧是Redux、Vuex、Mobx。 数据管理为 GraphQL 和 Apollo，并且 XState 横空出世。

**其他工具**

![image-20210114005333559](https://s3.qiufengh.com/blog/image-20210114005333559.png)

### 后端框架

![image-20210114011713944](https://s3.qiufengh.com/blog/image-20210114011713944.png)

Express 依旧是统治地位，而 Next 和 Nuxt 这些服务端渲染的框架也逐渐成为大家的所选的框架。

**其他工具**

![image-20210114005400642](https://s3.qiufengh.com/blog/image-20210114005400642.png)

### 测试框架

![image-20210114011830965](https://s3.qiufengh.com/blog/image-20210114011830965.png)

Jest和 Mocha 在使用量上依旧是统治地位，但是新增了 Testing Libray 很强劲。

以下是满意度排行。

![image-20210114005427559](https://s3.qiufengh.com/blog/image-20210114005427559.png)

什么是 `Testing Library` ？用于 DOM 和 UI 组件测试的一系列工具，主要 API 包含 DOM 查询，更可以和其他测试工具(jest、cypress)配合，用于更多场景(react、vue、svelte)。而它是 React 的官方推荐。

> 我们推荐使用 [React Testing Library](https://testing-library.com/react)，它使得针对组件编写测试用例就像终端用户在使用它一样方便。
>
> ----摘自 React 官网(https://zh-hans.reactjs.org/docs/test-utils.html)

### 打包工具

![image-20210114011945951](https://s3.qiufengh.com/blog/image-20210114011945951.png)

虽然短时间内 webpack 使用量还处于霸主地位，这一年打包工具的发生了巨大的变化。

以下为满意度

![image-20210114010039881](https://s3.qiufengh.com/blog/image-20210114010039881.png)

可以说这里发生了天翻地覆的变化。从 Parcel 到 Snowpack ，再到后来的 esbuild ，每一个都是打包的好手，至于 Vite 为什么没有在其中，我猜想，Vite 最开始只是为了解决 Vue 单个框架的方向，受众面不够广泛（现在它已经支持了多种框架的打包了）。

放张图来看看这些 bundleless 工具的速度吧。

![image-20210114010649085](https://s3.qiufengh.com/blog/image-20210114010649085.png)

**其他工具**

![image-20210114010412943](https://s3.qiufengh.com/blog/image-20210114010412943.png)

移动和桌面端

![image-20210114012121186](https://s3.qiufengh.com/blog/image-20210114012121186.png)

Electron 依旧是桌面端的第一选择， Cordova 和 React Native 也是移动跨端的热门选择。但是新出的 Capacitor 值得关注。

## 其他工具

**常用的工具函数库有？**

![image-20210114012305700](https://s3.qiufengh.com/blog/image-20210114012305700.png)

**其他工具函数库**

![image-20210114012350566](https://s3.qiufengh.com/blog/image-20210114012350566.png)

**JavaScript 运行时选择**

![image-20210114012435704](https://s3.qiufengh.com/blog/image-20210114012435704.png)

**经常使用那（些）文字編輯器？**

![image-20210114012456227](https://s3.qiufengh.com/blog/image-20210114012456227.png)

**常用用于开发的浏览器有哪些？**

![image-20210114012519560](https://s3.qiufengh.com/blog/image-20210114012519560.png)

## 资料

**常用的 blog 和杂志？**

![image-20210114012556370](https://s3.qiufengh.com/blog/image-20210114012556370.png)

**关注了哪些网站和课程？**

![image-20210114012616128](https://s3.qiufengh.com/blog/image-20210114012616128.png)

