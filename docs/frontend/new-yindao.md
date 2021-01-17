# 王者荣耀是如何手把手让你上瘾的

王者荣耀这款游戏之所以能让人上瘾，是因为它的教学简单。

为什么这么说呢？我们先来看几张图。

![WechatIMG11731](https://s3.qiufengh.com/blog/WechatIMG11731.jpg)

没错，上面的就是王者荣耀的新手引导，手把手教学，还有妲己美妙的声音。

整个过程大约 **2分钟**。它使用了多种引导方式，**蒙层引导、气泡引导、视频引导、操作引导还有预设任务**，可以说在新手引导方面，真的很"细"，用了各种各样的花样。但是它用了仅仅 2 分钟的指引就让你快速体验到了整个产品的使用方式，让你感受到打败敌人是如此满足，赢得一场游戏是如此简单。你收获了大量的快乐同时产生对它的依赖。

而如果说，没有新手指引，让一个没有从来没有玩过此类游戏的新人，就上手一个 5v5 的战斗，在自己还没弄懂操作，就上手实战，那么新人肯定会被打的很惨，受到队友的抱怨不说，很快会输掉一场比赛，从而产生挫败感，觉得这个游戏垃圾，更不用说从游戏中体验快感。

![WechatIMG11761](https://s3.qiufengh.com/blog/WechatIMG11761.jpg)

**所以说新手引导是一种能让用户在短时间内快速了解产品特色以及产品使用方式。**

**它是非常重要也是非常有必要学习的一个功能！这也是本篇文章想要介绍的重点内容。下面就进行原理实战讲解**

我先介绍一下常见的几种类型新手引导效果图。

## 1.引导页

引导页一般出现在首次打开APP的时候，由3-5个页面组成。

![8种引导方式，7个设计要点，让你全面了解新手引导！](https://image.uisdc.com/wp-content/uploads/2018/04/uisdc-yd-20180418-8.jpg)

## 2.蒙层引导

在产品的整个界面上方用一个黑色半透明蒙层进行遮罩，这种引导方式可以让用户聚焦了解被圈注的功能点或手势说明。

![image-20201103222848321](https://s3.qiufengh.com/blog/image-20201103222848321.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

## 3.气泡/弹窗提示

在操作按钮旁边弹出一个气泡提示框或者直接弹出弹窗。

![image-20201103222946696](https://s3.qiufengh.com/blog/image-20201103222946696.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

## 4.动画/视频引导

用户可以根据动态演示，很快地理解整个产品。

![image-20201103222839640](https://s3.qiufengh.com/blog/image-20201103222839640.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

## 5.操作式引导

一步一步地引导你进行操作，鼓励用户参与其中，边学边用。

![image-20201103222855636](https://s3.qiufengh.com/blog/image-20201103222855636.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

## 6.预设任务

预设任务是指在用户进入产品后，自动为用户创建了一些和产品形态相关的示例，而不是留给用户一个空页面。

![image-20201103225508773](https://s3.qiufengh.com/blog/image-20201103225508773.png)

人将降大任于斯人也，所以最近我就遇到了这样的一个需求。不过我需要实现的也比较简单，只需要实现蒙层引导。

今天我们就来实现一下这个功能。先来看一下我们目标的样子。核心代码大概只需要花 5 分钟就能学会，只需 9 行 js 代码，60 行 css 代码。所以接着往下看吧 ~ 高亮部分会有不一样的收获哦 ~

![image-20201102235430928](https://s3.qiufengh.com/blog/image-20201102235430928.png)

主要包括三个部分: 蒙层、气泡、高亮。

![image-20201103223327737](https://s3.qiufengh.com/blog/image-20201103223327737.png)蒙层和气泡对于很多同学来说，真的是太熟悉了。这里就只贴代码了，没有什么过多的可以讲解，主要是利用了绝对定位。

```html
// 蒙层实现
<style>
.guide-mask {
  z-index: 999999;
  background-color: #000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  opacity: 0.8;
}
</style>
<div class="guide-mask"></div>
```

```html
// 气泡实现
<style>
.tooltip-box:before {
  content: "";
  position: absolute;
  right: 100%;
  top: -10px;
  left: 20%;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 13px solid white;
}
</style>
<div class='tooltip-box'>
  秋风的技能
</div>
```

### 图层拼接

而这个高亮怎么实现呢？如何能让蒙层中间产生一个空白框呢？在我所知的 CSS 属性中并没有相关的属性可以实现这个特性，如果不能这样实现。那意味着我是不是需要自己将这个高亮区块给空出来呢，自己通过拼接的方式来实现。如下所示，这是我第一直觉想到的方案。

![image-20201103222804567](https://s3.qiufengh.com/blog/image-20201103222804567.png)

这一种方法比较傻瓜式，但是就是比较繁琐。

### z-index

`z-index` 属性设定了一个定位元素及其后代元素或 flex 项目的 z-order。 当元素之间重叠的时候， z-index 较大的元素会覆盖较小的元素在上层进行显示。

![image-20201104225256952](https://s3.qiufengh.com/blog/image-20201104225256952.png)

因为我们可以利用 `z-index` 这个特性，只要将我们目标元素的 `z-index` 设置成比我们的蒙层高就行。



![image-20201103224007763](https://s3.qiufengh.com/blog/image-20201103224007763.png)

![1604418064799](https://s3.qiufengh.com/blog/1604418064799.jpg)

通过图层分解，我们可以看到，目标的元素那一行`秋风的技能`是处于最高层，而不是和 `秋风的笔记`文字处于同一层。因此采取的方案是，我们没办法让蒙层在中间空出来，但是，我们可以通过`z-index`让我们的目标元素置于蒙层之上，然后再在蒙层和目标元素之间加入一个白色的背景框，这样就达到了高亮的效果。如果还看不明白可以看下图。

![image-20201104230122314](https://s3.qiufengh.com/blog/image-20201104230122314.png)

有了以上的知识就差定位了，我们通过 `getBoundingClientRect` 属性来获取目标元素的大小及其相对于视口的位置。然后通过绝对定位来进行布局。以下就是这个实现的主要逻辑（代码比较粗糙，主要是意思表达

```html
<style>
  ...
  .guide-helper-layer {
    position: absolute;
    z-index: 9999998;
    background-color: #FFF;
    background-color: rgba(255, 255, 255, .9);
    border-radius: 4px;
  }
  .guide-content {
    position: absolute;
    z-index: 10000000;
    background-color: transparent;
  }
  .guide-mark-relative {
    position: relative;
    z-index: 9999999 !important;
  }
  ...
</style>
</head>
<body>
    <h2>秋风的笔记</h2>
    <div class="skill guide-mark-relative">
        ...
    </div>
    <div class="guide-mask"></div>
    <div class="guide-helper-layer" style="width: 472px; height:58px; top:55px;left: 36px;">
        <div class='tooltip-box'>
            秋风的技能
        </div>
    </div>
    <script>
        const guideTarget = document.querySelector('.skill')
        const tooltip = document.querySelector('.tooltip-box')
        var rect = guideTarget.getBoundingClientRect()
        const helperLayer = document.querySelector('.guide-helper-layer')
        helperLayer.style.left = rect.left - 3 + 'px'
        helperLayer.style.top = rect.top - 3 + 'px'
        helperLayer.style.width = rect.width + 3 * 2 + 'px'
        helperLayer.style.height = rect.height + 3 * 2 + 'px'
        tooltip.style.top = rect.height + 3 * 2 + 10 + 5 + 'px'
</script>
```

以上就是实现一个蒙层引导的实现方案。当然这么精妙的设计也是离不开伟大的开源项目，以上就是参考了开源项目 `introjs` 来实现的。

### box-shadow

![image-20201104210129919](https://s3.qiufengh.com/blog/image-20201104210129919.png)

这个方案除了兼容性问题(不兼容低版本ie8以及以前版本)，也是比较简单的一个方法。来看看 box-shadow 的方法介绍。

```
/* x偏移量 | y偏移量 | 阴影模糊半径 | 阴影扩散半径 | 阴影颜色 */
box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
```

核心思路为我们可以通过设置一个比较大的阴影扩散半径，来实现，再设置一个半透明的背景色。

```css
box-shadow: 0 0 0 2000px rgba(0,0,0,.5);
```

### canvas

先通过 canvas 绘制出全屏的半透明遮罩，然后绘制出高亮部分，通过 `globalCompositeOperation` 中的 `xor`选项，将重叠部分变透明。

![image-20201104210448475](https://s3.qiufengh.com/blog/image-20201104210448475.png)

```js
const canvas = document.getElementById('guide-mask')
const width = window.innerWidth;
const height = window.innerHeight;
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);
const ctx = canvas.getContext("2d");
ctx.globalCompositeOperation = 'source-over';
ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
ctx.fillRect(0, 0, width, height);
ctx.fill();
ctx.fillStyle = 'rgb(255, 255, 255)';
ctx.globalCompositeOperation = "xor";
ctx.fillRect(rect.left - 3, rect.top - 3, rect.width + 3 * 2 + 10 + 5, rect.height + 3 * 2);
```

![image-20201102235430928](https://s3.qiufengh.com/blog/image-20201102235430928.png)

|          | 图层拼接 | 兼容性 | Box-shadow | Canvas |
| -------- | -------- | ------ | ---------- | ------ |
| 兼容性   | 非常好   | 非常好 | 一般       | 一般   |
| 难易程度 | 略复杂   | 简单   | 简单       | 略复杂 |
| 总评价   | ⭐️⭐️⭐️      | ⭐️⭐️⭐️⭐️⭐️  | ⭐️⭐️⭐️⭐️       | ⭐️⭐️⭐️⭐️   |

以上所有完整代码仓库: [github.com/hua1995116/…](https://github.com/hua1995116/node-demo/tree/master/guide)

我顺便来介绍一下目前我看到新手引导比较好的几个开源项目。

**[jquery-pagewalkthrough](https://github.com/jwarby/jquery-pagewalkthrough)**

优势: 手绘风，适用于特定的网站风格。

缺点: 需要依赖 jQuery。

![image-20201103112705958](https://s3.qiufengh.com/blog/image-20201103112705958.png)

**[intro.js](https://github.com/usablica/intro.js)**

优势: 拥有丰富的蒙层引导示例，可自定义主题

缺点: 个人免费，商业需要付费。

![image-20201103112854822](https://s3.qiufengh.com/blog/image-20201103112854822.png)

**[driver.js](https://github.com/kamranahmedse/driver.js)**

优势: MIT 开源，拥有与 intro.js 差不多的功能。

缺点: 示例没有 intro.js 丰富。

![image-20201103113117404](https://s3.qiufengh.com/blog/image-20201103113117404.png)

至此，本文就到此结束了。

### 参考

https://zhuanlan.zhihu.com/p/33508501

https://www.zhihu.com/question/20295898

http://www.woshipm.com/ucd/3506054.html

https://juejin.im/post/6844903859786104839

https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Compositing