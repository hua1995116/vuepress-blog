# Chrome 89 更新事件触发顺序，导致99%的文章都错了（包括MDN）

大家好，我是秋风。

嗯...我又来了，这次又是在...楠溪和的讨论中产生的问题。

那事情是怎么样的呢？

## 起因

最近楠溪在看事件相关的文章，然后就跑来和我讨论说以下代码的执行效果和网上的文章不一致，代码如下:

```html
<div>
	<button>123</button>
</div>
<script>
  var btn = document.querySelector('button');
  var div = document.querySelector('div');
  btn.addEventListener('click', function () {
    console.log('bubble', 'btn');
  }, false);
  btn.addEventListener('click', function () {
    console.log('capture', 'btn');
  }, true);
  div.addEventListener('click', function () {
    console.log('bubble', 'div');
  }, false);
  div.addEventListener('click', function () {
    console.log('capture', 'div');
  }, true);
</script>
```

以上是一段很简单的事件注册的代码，然后我们点击 `button`。

先不看结果，思考一下。

![image-20210521001552341](https://s3.qiufengh.com/blog/image-20210521001552341.png)

然后我们来看看结果

![2021-05-21-00.14.55](https://s3.qiufengh.com/blog/2021-05-21-00.14.55.gif)

对于绝大多数前端老鸟来说，会脱口而出地说出以下顺序。

```
capture div
bubble btn
capture btn
bubble div
```

## 探索

但是不管是MDN，还是网上大多数的教程而言说的都是这个顺序。

![image-20210521002720918](https://s3.qiufengh.com/blog/image-20210521002720918.png)

![image-20210523200131631](https://s3.qiufengh.com/blog/image-20210523200131631.png)

![image-20210521002556311](https://s3.qiufengh.com/blog/image-20210521002556311.png)

对于这个现象，我感到很迷惑，我依稀记得，在几个月前，Chrome 还不是这样的行为，盲猜是不是因为 Chrome 版本的问题呢？

以上动图的 Chrome 版本是 90.0.4430.212

因此我找了个 Chrome 版本为 84.0.4109.0 进行测试。

![image-20210523200535044](https://s3.qiufengh.com/blog/image-20210523200535044.png)

果然是版本的问题，但是事情的追踪依然很难，由于搜索了规范以及查了谷歌上的一些资料，并没有很好地帮助我解决这个疑惑，我不确定是因为 Chrome 引入的 bug 还是出现了什么问题。

因此我就向 chromium 报告了这个问题。

![image-20210523200757839](https://s3.qiufengh.com/blog/image-20210523200757839.png)

最终在 Chrome 开发人员的帮助下，找到了这两个讨论

 https://github.com/whatwg/dom/issues/685

![image-20210523200912482](https://s3.qiufengh.com/blog/image-20210523200912482.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

https://github.com/whatwg/dom/issues/746

![image-20210523201105578](https://s3.qiufengh.com/blog/image-20210523201105578.png)

在上述 issues 中可以看到， 起因是在 https://bugs.webkit.org/show_bug.cgi?id=174288 中，有人指出，在 webkit 中当前的事件模型，会导致含有 Shadow DOM 的情况下，子元素的捕获事件会优先于父元素的捕获事件触发。

![image-20210523194802633](https://s3.qiufengh.com/blog/image-20210523194802633.png)

而在旧模型中，一旦达到 AT_TARGET ，所有注册的监听器就将按照顺序被触发，而不管他们是否被标记为捕获。由于 Shadow DOM 会创建多个 targets ，导致了事件执行顺序的错误。

而上述问题在 Gecko （Mozilla Firefox 的排版引擎）却运行正常（先捕获再冒泡）。为此 [whatwg](https://github.com/whatwg) 提出了一个新的模型结构来解决这个问题。

![image-20210523195228563](https://s3.qiufengh.com/blog/image-20210523195228563.png)

## 结论

所有的疑问到此都迎刃而解了，到现在为主我们梳理一下我们的问题。

|      | 1.按照旧版本事件触发机制                       |
| ---- | ---------------------------------------------- |
| 表现 | 目标元素触发事件顺序和注册事件顺序有关         |
|      | **2.新的的事件触发机制**                       |
| 表现 | 目标元素触发事件顺序按照先捕获再冒泡的顺序触发 |

而这个版本分界线是在 Chrome 89.0.4363.0  和 89.0.4358.0。

而 Chrome 89.0.4363.0 是在 2020-12-22 发布的，也就是最近几个月的事情，因此近几个月如果你的Chrome 更新了就会遇到和我一样的现象。

在 Chrome 89.0.4363.0 以及之后版本中，**目标元素的触发事件顺序不再按照注册顺序触发**！**而是按照先捕获再冒泡的形式依次执行！**

然后我们再来看看这样修改会给我们带来怎么样的影响。

1. 首先我们要明确是的，网上以前的大部分文章已经不适用于当下的 Chrome 新版本了！
2. 如果我们业务中有依赖相关的事件触发顺序，请仔细检查！

举个🌰

```html
<div>
	<button>123</button>
</div>
<script>
  var a = [];
  var btn = document.querySelector('button');
  var div = document.querySelector('div');
  btn.addEventListener('click', function () {
    console.log('bubble', 'btn');
    a.push(1);
  }, false);
  btn.addEventListener('click', function () {
    console.log('capture', 'btn');
    a.push(2);
  }, true);
  div.addEventListener('click', function () {
    console.log('bubble', 'div');
  }, false);
  div.addEventListener('click', function () {
    console.log('capture', 'div');
  }, true);
</script>
```

在新版本中，当 button 元素被点击后，最终 a 的结果为 [2,1]，而在旧版本中，这个结果则为 [1,2]。

那对于现阶段一些线上代码改如何改造呢？

## 改进方案

那么现在我们无法控制用户使用哪个版本的浏览器，该如何解决这个问题而来避免遇到线上问题呢？

其实很简单。

我们只需要将所有目标元素代码的顺序都按照先书写捕获事件代码，再书写冒泡事件代码，就可以兼容本次的更新。

## 思考

所有的事情都不是一成不变的，不管是对于一些相对官方的文章或者教程我们都要抱以怀疑的态度，相信我们所看到的。也许我这篇的言论在多年之后也会是一个错误示例，但是是对当下问题的一个记录。本文也还有很多不足之处，如果有问题请在评论中指出。



## 参考资料

https://chromium.cypress.io/

https://github.com/whatwg/dom/issues/685

https://bugs.webkit.org/show_bug.cgi?id=174288

https://github.com/whatwg/dom/issues/746

https://dom.spec.whatwg.org/#dispatching-events


