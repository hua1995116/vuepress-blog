# 只用 Markdown 就写出好看的简历，在线简历应用闪亮登场！

## 前言

大家都知道金三银四是招聘的季节，各大互联网公司都开始了春招。最近有很多人来找我帮忙看简历，简历的模板可谓参差不齐，有过分炫酷，还有一些朋友直接把  word 丢了过来，排版就显得比较乱。

一番调研后，大家还是大多数使用简历最常用的方式还是 word、其次是 Markdown。

作为互联网的一名打工人，Markdown 可以说在平时的写文档常用的方式。心想，我能否设计一个在线站点通过抒写 Markdown，并且能够赋予 Markdown 多样化的主题。

做东西总是要站在巨人的肩膀上，网上搜到比较好的 Markdown 简历编辑器就是<冷熊简历>了，但是他的模板比较单一，并且貌似维护力度比较一般了。还调研了我平时基于写文章的排版工具<mdnice>，可以说用一份简洁的Markdown 来实现不同的排版会让整个流程变得更加简单。

并且我去市场上调研了一些常用的方案

|            | 木及简历 | 冷熊简历 | markdown-resume | Word     | 五百丁/超级简历 |
| ---------- | -------- | -------- | --------------- | -------- | --------------- |
| 付费       | 免费     | 免费     | 开源            | 付费激活 | 付费导出        |
| 是否开源   | 是       | 否       | 开源            | 否       | 否              |
| 编辑方式   | Markdown | Markdown | 网格化+Markdown | word     | 网格化          |
| 容易度     | ⭐⭐️⭐️⭐️⭐️    | ⭐⭐️⭐️⭐️⭐️    | ⭐️⭐️⭐️             | ⭐️        | ⭐️⭐️⭐️             |
| 导出pdf    | 支持     | 支持较差 | 支持较差        | 支持     | 支持            |
| 模板       | 多样化   | 单一     | 多样化          | 多样化   | 多样化          |
| 自定义模板 | 即将推出 | 不支持   | 不支持          | 支持     | 不支持          |

总结一下，现阶段简历编辑具有以下取舍:

- 简单的模板，排版不好看
- 复杂的模板，好看但是非常花时间

基于以上背景，所以我开发了 [木及简历](https://resume.mdedit.online/) 。只需要通过纯 Markdown ，就能用很简单的方式制作出好看的简历。

在线地址: https://resume.mdedit.online/

在线地址: https://resume.mdedit.online/

在线地址: https://resume.mdedit.online/

重要的事情说三次！

## 概览

### 基础方式

下面就让大家欣赏一下这个应用到底有多方便！假如我们有以下这么个 Markdown 简历文件。

```markdown
# 秋风 - 前端工程师

博客: [https://qiufeng.blue](https://qiufeng.blue)

Gihtub: [https://github.com/hua1995116](https://github.com/hua1995116)

掘金: [https://juejin.cn/user/923245497557111](https://juejin.cn/user/923245497557111) 

邮箱: [qiufenghyf@163.com](mailto:qiufenghyf@163.com)

微信: qiufengblue

## 介绍
于2015年开始接触前端，喜欢编码，有Geek精神，对代码有洁癖，喜欢接触前沿技术，爱折腾。

获得省、国家级竞赛奖项xx项，(包含浙江省大学生多媒体竞赛一等奖xx项)。
  
主持参与省、国家级项目xx项；发表论文xx篇，其中xx篇EI索引。

## 工作
### xxxx
打工中..

### xxxx
前端架构组
- 前端错误监控系统(基建)(负责人) 接入量pv:3000w
  - web端js-sdk开发,无侵入式接入,压缩后仅2kb。
  - 收集端Node开发,分布式存储日志。
  - 阿里云日志服务分析,以及常用的数据分析。
  - echart搭建可视化平台。
- 前端性能监控系统(负责人) 接入pv: 1000w
  - web端js-sdk开发,支持自定义上报以及自动上报,无侵入式。
  - 收集端Node开发,Elasticsearch集群存储日志。
  - Elasticsearch的Node模块开发，封装按时间维度的查询聚合模块。
  - 可视化平台,利用redis缓存优化查询,淘汰算法共同协作。
- 落地页截图(Node项目)
  - 利用puppeteer开发截图。
  - 利用clustor多线程开发,速度从原来60分钟提高至8分钟，提高约7倍（300张截图）。
  - 开发自定义队列模式,避免Node端丢失请求。
- webpack插件(webpack-plugin-inner-script)地址
  - 自动将外链形式改写成内敛形式。

## 技能
### Web基础
- 熟练掌握HTML5/CSS3,响应式布局和移动端开发
- 了解ES6/ES7,Webpack
- 有Antd Design,Element UI,Muse UI搭建项目经验
- 了解Hybrid开发以及Electron桌面开发,liunx服务器搭建经验,Nginx配置
- Mac开发用户，熟悉Git进行团队协作，对PS有一定基础

```

基于以上`Markdown` 便能快速生成以下的模板样式，并且能够导出 Markdown + pdf。

![](https://s3.qiufengh.com/blog/image-20210315003811485.png)

**但是需要注意的是，由于模板的限制，需要大家写出规范的标题层级。**

建议在写简历过程中，使用**一级标题**来写在开头，常用来描述整体的主旨与标题，常用的就是，求职者的姓名 + 求职岗位的模式

例如:

\# 秋风 - 前端工程师

这样不仅能能让面试官一眼就看到你这份简历的用途，因为在实际过程中，有很多同学没有很好地注明投递的方向，很容易造成投递方向错误。

在写内容过程中，建议使用**二级标题**来写。

例如:

\## 教育背景

\## 工作经验

\## 项目经验

\## 基础技能

### 丰富的模板

本项目提供了默认的4种方式供大家来进行选择，后续也会推出更多的模板。

![](https://s3.qiufengh.com/blog/image-20210315004555255.png)

### 主题色更换

不仅我们能更换模板，当含有`可换色`的模板中，还可以更换模板整体的主题色。

<img src="https://s3.qiufengh.com/blog/image-20210315000636862.png" width="300">

![](https://s3.qiufengh.com/blog/image-20210315000619789.png)

更换一下主题色是不是也是非常好看呢？

### 左右结构

为了能够突破传统 `Markdown` 的纵向的布局方式，引入了自定义容器，该方案的灵感来源于` vuepress`。

<img src="https://s3.qiufengh.com/blog/image-20210314235147407.png" alt="image-20210314235147407" style="zoom: 25%;" />

在我们的编辑器中，使用左右容器对，就能轻松实现左右布局的方式。

```markdown
:::left
xxxx
:::
:::right
xxx
:::
```

![](https://s3.qiufengh.com/blog/WechatIMG30782.png)

### 丰富的icon

![](https://s3.qiufengh.com/blog/image-20210315000047285.png)

目前支持了一些图标的快捷写法，帮助大家能够，能够帮助大家放上好看 icon，来美化自己的简历。

```markdown
[icon:blog https://qiufeng.blue](https://qiufeng.blue)

[icon:github https://github.com/hua1995116](https://github.com/hua1995116)

[icon:juejin 掘金](https://juejin.cn/user/923245497557111) 

[icon:email qiufenghyf@163.com](mailto:qiufenghyf@163.com)

icon:weixin qiufengblue
```

![](https://s3.qiufengh.com/blog/image-20210315000132262.png)

### 自定义html

#### 插入图片

本项目中开启了对 `html `的解析，因此我们也可以使用像[gihtub-readme-stats](https://github.com/anuraghazra/github-readme-stats)这类服务，给我们文档插入一张图片。

```markdown
# 秋风 - 前端工程师

::: left

<img style="display:block; margin: 0 0 0 30px" src="https://github-readme-stats.vercel.app/api?username=hua1995116&show_icons=true&icon_color=79ff97&text_color=fff&bg_color=39393a&hide_title=false&title_color=fff&disable_animations=true&hide_border=true">

:::

::: right
[icon:blog https://qiufeng.blue](https://qiufeng.blue)

[icon:github https://github.com/hua1995116](https://github.com/hua1995116)

[icon:juejin 掘金](https://juejin.cn/user/923245497557111) 

[icon:email qiufenghyf@163.com](mailto:qiufenghyf@163.com)

icon:weixin qiufengblue

:::
```

![](https://s3.qiufengh.com/blog/image-20210314235535988.png)

你也可以把这张图片放到任意你喜欢的位置。

![](https://s3.qiufengh.com/blog/image-20210314235944581.png)

#### 自定义标签

也可以加入自定义的一些标签样式，让 Markdown 的编写变得更加自由~ ，例如实现自定义样式的 `Tag`

```markdown
<span style="background: #ddd; padding: 5px">前端</span>
```

<img src="https://s3.qiufengh.com/blog/image-20210315011330476.png" />

### 导出方式

支持 md 导入导出，同时也支持 pdf 的导出方式。后端采用了 `puppeteer` 的方式，能最大限度地还原出 html 的展现方式。相对传统的前端导出图片式 pdf 具有以下优点：

- 文字能够复制、链接能够点击
- 分页更加友好
- 内容更加清晰

## 原理实现

前端使用了`codemirror`作为编辑器， `markdown-it` 进行 `Markdown` 的渲染。

后端采用了 `serverless` +` puppeteer` 的方式，按量计费，唯一的缺点就是会有函数销毁的情况（最低1实例存活，待研究配置），导致导出的时候，如果实例销毁了，会有一定概率会导出失败，如果失败情况建议多尝试一次。（此问题会尽快解决）

## 后续规划

- 支持A4纸上的预览模式
- 云端存储与同步
- 分享协作修改简历
- 在线查看简历（兼容移动端）
- 扩充官方模板（4个）
- 能够自定义增加模板（用户能够贡献模板）
- 模板广场（每个人能分享自己DIY的模板至广场）



## 写在结尾

最后非常感谢女朋友[@楠溪](https://juejin.cn/user/4230576475472573)一起参与项目的建设，全权编写了后端的所有接口。

开源地址：https://github.com/hua1995116/react-resume-site

这个项目是年轻，还有很多问题，希望大家多多提出宝贵的意见。

也欢迎大家给个⭐️给予支持和鼓励。 

希望这个项目能够帮助到`金三银四`找工作的各位(不找的也可以收藏以后使用。❤️

