和女朋友争论了1个小时，在vue用throttle居然这么黑盒？

## 开篇

首先我们都知道，throttle 和 debounce 和性能优化的利器，一个是开源，另一个是节流。

简单介绍一下这两个的概念，但是本文并不会对这两个函数进行过度的讲解。

1.**函数节流**(throttle) 是指一定时间内js方法只跑一次。

节流节流就是**节省水流的意思**，就想水龙头在流水，我们可以手动让水流（在一定时间内）小一点，但是他会一直在流。

当然还有一个形象的比喻，开源节流，就比如我们这个月（在一定时间内）我们少花一点钱，但是我们每天还是都需要花钱的。

2.**函数防抖**(debounce) 只有足够的空闲时间，才执行代码一次。

比如生活中的坐公交，就是一定时间内，如果有人陆续刷卡上车，司机就不会开车。只有别人没刷卡了，司机才开车。（其实只要记住了节流的思想就能通过排除法判断节流和防抖了）

函数防抖的情况下，函数将一直推迟执行，造成不会被执行的效果，常见的场景为

- 每次 resize/scroll 触发统计事件
- 文本输入的验证（连续输入文字后发送 AJAX 请求进行验证，验证一次就好）

函数节流的情况下，函数将每个 n 秒执行一次

- DOM 元素的拖拽功能实现（mousemove）
- 搜索联想（keyup）
- 计算鼠标移动的距离（mousemove）
- Canvas 模拟画板功能（mousemove）
- 射击游戏的 mousedown/keydown 事件（单位时间只能发射一颗子弹）



## vue debounce 

那么它们和 vue 结合会擦除怎么样的火花呢？



为什么

搞一对化名（A和B）

case 1 
A 给 B 提了一个 throttle 在 vue 中的写法，问为什么这样子不行

```js

methods: {
	download: () {
		this.throttle(xxx)
	}
}
```
因为这样没有利用闭包。
case2
那这样为什么不行。

 ```
<input @input="throttle(download(xxx))">
 ```
一顿疑惑，好久没有写 vue 的黑魔法了，一时不知道如何解释

赶紧偷偷查资料，默默地在谷歌输入下了 vue debounce ...

... 
什么？没有
...
什么？还是没有

emm。查不到，那开始思考？ 为什么这个写法不行？ 等等，我刚刚说了什么？把时间倒退 3.3 秒前... （为什么是3.3秒，因为人类平均说话语速是200字/分钟）

写法？ 对啊，是写法，这个只是 vue 的模板语法，真实浏览器运行的并不是这个样子啊。

感觉有思路了！快快快，快找 vue 模板编译完后的样子

在浏览器输入下下了`vue 模板 在线`这几个关键词。

![image-20210102131222649](https://s3.qiufengh.com/blog/image-20210102131222649.png)

很快我们就查到了这个地址 https://template-explorer.vuejs.org/

我们将我们的模板输入到左侧的输入框。

![image-20210102131310059](https://s3.qiufengh.com/blog/image-20210102131310059.png)

我们得到了这样的一个解析后的 `render` 函数。

```js
function render() {
  with(this) {
    return _c('input', {
      on: {
        "input": function ($event) {
          throttle(download(xxx));
        }
      }
    })
  }
}
```

在这里我们看到，我们能大概知道，通过解析后，input 监听方法已经被包裹了一层函数。也很容猜出，最终解析成真正的绑定的函数会变成以下这个样子。

```js
xxxx.addEventListener('input', function ($event) {
		throttle(download(xxx));
})
```

如果是这个样子的 throttle ，我相信有了解 throttle 的朋友们一眼就能看出来，这样子的 throttle 是完全不起效果的。

看到这里

是不是 vue 对 这个东西有做什么处理。
偶然之间发现

```
<input @input="download(xxx)">
```
```
<input @input="download">
```
这两者的效果居然是一样的。貌似恍然大悟。
利用 
模板解析。
真相只有一个
果然是 vue 模板的黑魔法。

case3
外部导入和内部 methods 的差异性



....
深入探究
去找 vue 源码

再深入一些
探究 vue 3.0 是否对这个有改动。

结尾
谈谈 react 和 vue 的特性，vue 自身模板语言需要很多心智模型，浅谈差异性