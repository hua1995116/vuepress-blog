# 和女朋友争论了1个小时，在vue用throttle居然这么黑盒？

## 开篇

首先我们都知道，`throttle(节流)` 和 `debounce(防抖)` 是性能优化的利器。

本文会简单介绍一下这两个的概念，但是并不会对这两个函数再进行老生常谈地说原理了，而是会说它和 vue 之间的爱恨情仇~，但是在步入正题以前，我们得先知道它的一些简介。

**函数节流**(throttle) 是指一定时间内 js 方法只运行一次。

节流节流就是**节省水流的意思**，就像水龙头在流水，我们可以手动让水流（在一定时间内）小一点，但是他会一直在流。

函数节流的情况下，函数将每隔 n 秒执行一次，常见的场景为：

- DOM 元素的拖拽功能实现（mousemove）
- 搜索联想（keyup）
- 计算鼠标移动的距离（mousemove）
- Canvas 模拟画板功能（mousemove）
- 射击游戏的 mousedown/keydown 事件（单位时间只能发射一颗子弹）

**函数防抖**(debounce) 只当有足够的空闲时间，才运行代码一次。

比如生活中的坐公交，就是一定时间内，如果有人陆续刷卡上车，司机就不会开车。只有别人没刷卡了，司机才开车。（其实只要记住了节流的思想就能通过排除法判断节流和防抖了）

函数防抖的情况下，函数将一直推迟执行，造成不会被执行的效果，常见的场景为：

- 每次 resize/scroll 触发统计事件
- 文本输入的验证（连续输入文字后发送 AJAX 请求进行验证，验证一次就好）

## vue throttle

那么它们和 vue 结合会擦除怎么样的火花呢？你有了以上的基础知识后，下面正片就正式开始了~ 最近和女朋友谈了下 vue throttle 相关的问题，一开始以为是简单的的东西，没想到真的讨论了1个小时.... 前方高能硬核，层层递进涉及到 vue 源码。

### 初舞台

问题形态一:

```html
<input @input="download" />

...
methods: {
	download: () {
		this.throttle(xxx)
	},
}
...
```

我们来分析为什么这样是不行，首先我们来看看正常情况下 throttle 是怎么写的，再来拆分拆分 throttle 。

```js
window.addEventListener('mousemove', throttle(xxx));
```

进一步拆分

```js
const handleMove = throttle(xxx)
window.addEventListener('mousemove', handleMove);
```

我们一直调用的是 `handleMove` 方法，而 `throttle` 的原理是依赖于 JS 的闭包原理，依赖于` handleMove` 中的闭包变量。而如果你在 `handleMove` 外层再套一层 `download` 函数，贼无法让 `handleMove` 中的闭包内的变量进行了缓存，因此也失去了` throttle` 的效果。

### 升温

那我们来改造一下，看起来是正确地形态。

 ```html
<input @input="throttle(download(xxx))">

...
methods: {
	download: (xxx) {
		..
	},
	throttle: ...
}
...
 ```
开始一顿疑惑，没错呀，这的确就是 `throttle` 正确写法的样子，为什么这样就不行呢，再加上好久没有写 `vue` 的黑魔法了，一时不知道如何解释。

赶紧偷偷查资料，默默地在谷歌输入下了 vue debounce ...

![image-20210124164233425](https://s3.qiufengh.com/blog/image-20210124164233425.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

搜到了一些正确的打开方式。

![image-20210124164405309](https://s3.qiufengh.com/blog/image-20210124164405309.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

发现它这样是可以使用的，而我将他写到模板中不行。

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

而我们刚才资料中查询到的方式呢？

```vue
<template>
	<input @input="click" />
</template>
<script>
...
click: _.throttle(() => {
	...
})
...
</script>
```

```js
function render() {
  with(this) {
    return _c('input', {
      on: {
        "input": click
      }
    })
  }
}
```

这种方式下，vue 是直接传递绑定的实践方法的，并不会有任何包装。

所以真相只有一个

**果然是 vue 模板的黑魔法！！！！！**

### 进阶

那我们通过 vue 的源码来探索一下，vue 的模板解析的原理，来加深一些我们的印象。

由于这里部分是 vue 事件编译相关的代码，我们很容易地找到了 vue 源码（目前看的是 v2.6.12版本）的位置。

https://github.com/vuejs/vue/blob/v2.6.12/src/compiler/codegen/events.js#L96

我们看到 vue 源码中含关于事件生成是以下代码。

```js
const fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/
const fnInvokeRE = /\([^)]*?\);*$/
const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/
...

const isMethodPath = simplePathRE.test(handler.value)
const isFunctionExpression = fnExpRE.test(handler.value)
const isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''))

if (!handler.modifiers) {
  // 判断如果是个方法或者是函数表达式，就返回 value
  if (isMethodPath || isFunctionExpression) {
    return handler.value
  }
  /* istanbul ignore if */
  if (__WEEX__ && handler.params) {
    return genWeexHandler(handler.params, handler.value)
  }
  // 如果不满足以上的情况就会包一层方法
  return `function($event){${
    isFunctionInvocation ? `return ${handler.value}` : handler.value
  }}` // inline statement
} else {
	...
}
```

由于我们的是没有 修饰符(`modifiers`)的，因此我们关于含有修饰符的代码注释了，防止不必要的干扰。

为了能更好地梳理情况，我们将 `isMethodPath` 称作`方法路径`，而将 `isFunctionExpression`称作`函数表达式`,`isFunctionInvocation`称为`函数调用`（虽然英文就是这个意思，但是为了大家都能看明白吧）

通过以上代码我们能明白，如果这个事件的写法，满足 `isMethodPath` 或者满足`isFunctionExpression`。那么我们在事件中的写法会被直接返回，否则的话，会被包一层 `function`。

我们一一来看看关于事件的情景。`isMethodPath` 的判断方法是`const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/`， 乍一看有点长，我们通过可视化工具分析分析。

https://jex.im/regulex/

![image-20210124174535671](https://s3.qiufengh.com/blog/image-20210124174535671.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

通过可视化可以看出，我们的事件方式如果是以上形态就会通过正则的检验（例如 `handle`, `handle['xx']`, `handle["xx"]`,`handle[xxx]`, `handle[0]`, `console.log ）`这些情况都是不会被包裹一层函数。

还有一种情况就是 正则 `const fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/`。

![image-20210124174916857](https://s3.qiufengh.com/blog/image-20210124174916857.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

简单来讲就是写一个匿名函数， `(xx) => {}` 或者 `funciton(){}`。

除了以上两种情况之外的所有情况都会被包含一层方法。

还记得 vue 的官方教程中，我们写模板语法的时候，以下两种方式是等价的。

1.`<div @click="handler"></div>`

2.`<div @click="handler()"></div>`

因为在编译的时候，他们会分别被编译成以下形态。

```js
xxx.onclick = handle

xxx.onclick = function($event) {
	return handler();
}
```

通过包一层函数来达到相同的目的，现在你能明白了吧？在 vue 中写，怎么写都不会出问题，有时候可能是你偶然手误，它都讲这些情况考虑在内了，就像是吃饭一样，饭已经喂到我们嘴边了。

而在被函数包裹的情况又分了两种情况。

`isFunctionInvocation ? return ${handler.value} : handler.value`

`isFunctionInvocation`的检测就是将函数调用的部分去掉，如果去掉后，满足`方法路径`的情况，那么就会多一个 `return`。

![image-20210125001734095](https://s3.qiufengh.com/blog/image-20210125001734095.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

我们来画个图总结一下。

![vue模板编译-事件](https://s3.qiufengh.com/blog/vue模板编译-事件.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

而我们的情况是怎么样的呢？

```js
throttle(download(xxx))
```

显然我们既不满足方法路径、也不满足函数表达式，因此就会出现我们上述的 "bug"，让我们的 `throttle` 失效了。

至此，我们已经清楚了关于 vue 中的黑魔法了，vue 给我们带来便利的同时，我们运用的不好，或者说不理解它的一些思想原理，就会发生一些神奇的事情。

### 最佳

所以上述说了这么多，我们需要有个最佳的实践方案。

```vue
<template>
	<input @click="download(xxx)" />
</template>
<script>
import {debounce} from 'lodash';
...
methods: {
  download: debounce((xxx) => {
    ...
  })
}
...
</script>
```

### 升华

那么我们再来解释一个问题，外部导入和内部 `methods` 的差异性？

```vue
<template>
	<input @click="debounce(download(xxx))" />
</template>
<script>
import {debounce} from 'lodash';
</script>
```

先说以上写法是会出错的。

因为在我们模板中写的方法，必须是 `methods` 中的方法，否则就会找不到。

也许这样我们直接像在模板中写 `throttle` 就必须将这个函数定义在 `methods` 中，这样是非常不友好的，因为会反直觉，对于太久没写的我(T T忘记了)。

那为什么不可以直接写在模板上面呢，其实这也和 vue 的编译相关的，因为 vue 模板中的方法都会被编译成 `_vm.xxx`，举个例子。

```html
<template>
	<input @click="debounce(download(xxx))" />
</template>
```

以上模板代码会被编译成这个样子。

```js
/* template */
var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("input", {
      on: {
        click: function($event) {
          _vm.debounce(_vm.download(_vm.xxx));
        }
      }
    })
};
```

以上才是真正在浏览器执行的代码，所以我们可以很清楚地看到 `_vm` 中是不存在 `debounce`，这也是 `template` 只能访问 vue 中定义的方法与变量。

### 试探边缘

我们再来探究一下 `vue 3.0` 是否对这个有改动。

答案是: 没有。

我特地去找了  `@vue/compiler-sfc` 进行了测试。

```js
const sfc = require('@vue/compiler-sfc');

const template = sfc.compileTemplate({
    filename: 'example.vue',
    source: '<input @input="throttle(download(xxx))" />',
    id: ''
});
```

```js
// output
import { createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock } from "vue"

export function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("input", {
    onInput: _cache[1] || (_cache[1] = $event => (_ctx.throttle(_ctx.download(_ctx.xxx))));
```

## 结尾

从这一次的探索来看，vue 自身模板语言需要很多心智模型，而在本实例中，vue给了我们很多语法糖，让我们沉醉其中，不得不说这样的方式很舒服，但是总有一天我们独自承受这些苦楚。

这就不得不讨论到 React 的 JSX，虽然它麻烦，对我们很残酷，但是我们对自身的行为更加可控（虽然 vue 也可以用 JSX,但是 Templates 依旧是是官方推荐的方法）我也能理解 vue 上述的这些表现，因为它帮我们做了很多处理，对于某些情况它需要给我们注入 `$event `, 也就是我们常用的事件对象，但是别人帮我们手把手处理了这些事情，也使得我们慢慢忘记了它原本的形态，一旦出现问题，会让我们举手无措。而 JSX 中则要求我们写出完整的代码，这样的方式使得我们写什么都需要付出额外的劳动，也许像 vue 官方文档中所说，谈论 JSX 和 vue 的 Templates 是肤浅的的，但是不管怎么样，每个人都会对它有不一样的理解，不一样的喜好，所以自己总结了一下。

都学就完si儿了 :)