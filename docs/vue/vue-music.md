# 用 vuejs 仿网易云音乐（实现听歌以及搜索功能）

####**前言**
前端时间学了 vue，一开始看了 vue1.0，后来实在觉得技术总得实践，就直接上手 vue2.0。然后花了将近一周时间做了一个网易云音乐的小项目。一开始觉得项目比较小，没必要用 vuex 所以就没有使用，但是后来发现数据流传输有点麻烦，后续会使用 vuex。 ####**技术栈**

- vue+vue-router（核心框架）
- [better-scroll](https://github.com/ustbhuangyi/better-scroll)（使移动端滑动体验更加流畅）
- [vue-lazyload](https://www.npmjs.com/package/vue-lazyload)（用户图片懒加载）
- [nprogress](https://www.npmjs.com/package/nprogress)（用于加载过渡）
- [ axios](https://www.npmjs.com/package/axios)（请求）

####**功能分析与设计**
首先我先参考了现有的一些 APP 的设计与开发，然后决定做了歌单和搜索两个模块，本身主要以前端为主，后端代码并没有研究，这里要感谢这位同学写的[API](https://github.com/zvenshy/venmusic)。
如果你没有 API 也没有关系，这并不影响我们的开发，你可以写如下形式的 json 数据进行模拟：
![这里写图片描述](https://s3.mdedit.online/blog/1579506284320.png)

**vuejs**

路由结构如下

![这里写图片描述](https://s3.mdedit.online/blog/1579506284503.png)

以下是组件

![这里写图片描述](https://s3.mdedit.online/blog/1579506284409.png)

1.歌单部分：
数据主要由 API 提供，源码中有具体地址。需要了解 audio 标签，不熟悉的同学看[audio](http://www.cnblogs.com/tianma3798/p/6033108.html)

2.搜索部分：
通过绑定@keydown 来绑定事件，实现实时查询。

**better-scroll**

使用： 1.一定要用一个空层来承载

```
<div ref="helloWrapper">
	<div>
	//你的代码
	</div>
</div>
```

2.在 vue 中使用前必须引入

```
import BScroll from 'better-scroll';

this.helloScroll = new BScroll(this.$refs.helloWrapper, {
  click: true
});
```

一定要在数据渲染完成后使用 better-scroll，

```
this.$nextTick(() => {
  //调用
});
```

最后上几张效果图
![这里写图片描述](https://s3.mdedit.online/blog/1579506285676.gif)

![这里写图片描述](https://s3.mdedit.online/blog/1579506284321.gif)

![这里写图片描述](https://s3.mdedit.online/blog/1579506285018.gif)

github 项目地址：
[https://github.com/hua1995116/musiccloudWebapp/](https://github.com/hua1995116/musiccloudWebapp/)
在线演示地址：
[http://www.qiufengh.com/#/](http://www.qiufengh.com/#/)
需要改进的有很多，请大家可以多提提意见。后续我会不断改进，如果觉得还可以，请 star，你们的 star 是我前进的动力。
