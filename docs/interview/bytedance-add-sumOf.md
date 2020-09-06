# 送你一道字节前端原题（Add sumOf）

## 前言

最近学弟去面了字节跳动，但是由于面试经验少，面试的时候紧张了，一时之间没有写出来，之后来我交流了一下。那我就来分析分析这道题目。

![image-20200906001022824](https://s3.qiufengh.com/blog/image-20200906001022824.png)

## 正文

这题的规则是这样的

```js
给定有一个 Add 函数，要支持以下形式的调用

Add(1)(2)(3).sumOf(); // 输出 6
Add(1,2)(3)(4).sumOf(); // 输出 10
Add(1,2,...)(3)(4)(...).sumOf();  // ...
```

拿到这种题目，我先来说说我自己的做题流程，一般会去找它最简单的形态。我们一步一步来拆解。

先去掉 `sumOf()` 变成了以下形态

```
Add(1,2,...)(3)(4)(...)
```

嗯....有点熟悉...但是还是有点复杂，那我们再去掉无限调用这个限制。

```
Add(1,2,...)(3)(4)
```

唔，还是有点难呀...没关系，再砍, 不要传入多个参数。

```js
Add(1)(2)(3)
```

有....有....有那味了....这....这不就是柯里化吗....

有些小朋友可能没有听过，对于大朋友而言耳熟能详，融会贯通。

我们还是来介绍一下。

在《javascript高级程序设计》这本书中有如下介绍: 

> 与函数绑定紧密相关的主题是函数柯里化，它用于创建已经设置好的一个或者多个参数的函数。函数柯里化的基本方法和函数绑定是一样的：使用一个闭包返回一个函数。两者的区别在于，当函数被调用时，返回的函数还需要设置一些传入的参数。

我们来写写看: 

```js
function Add(x) {
	return function (y) {
		return return functio (z) {
			return x + y + z;
		}
	}
}
// 简洁写法
const Add = x => y => z => x+y+z;
```

执行一下

````
Add(1)(2)(3) // 6 
````

是我们要的那味~

那么我们既然已经写出了这个形态，我们就一步一步反推。

> 这个时候千万别紧张，我们从最低级的形态出发，写出一个最基本的形态，能够有效地帮助我们建立自信心，吃下定心丸，按照这种方式，哪怕我们最终没有写出完美的结果，让面试官看到你思考解题的过程，也是一种加分。

好，接着说~

那我们接下来需要实现这个样子。

```
Add(1,2,...)(3)(4)
```

传入参数不止一个

我们知道，对于不确定参数个数，我们可以使用 `arguments` 这个对象来获取到所有的入参，但是 `arguments` 不是一个 `Array`，但是我们可以使用 ES6 中的 **Spread syntax** （**展开语法**）去将他变成一个数组。表演继续。

```js
function Add() {
	const nums = [...arguments];
	return function() {
		nums.push(...arguments);
		return function() {
			nums.push(...arguments);
			return nums.reduce((a, b) => a + b);
		}
	}
}

```

nice！已经离我们最终的形态越来越近了。接下来是这个函数能够无限的进行调用。

```
Add(1,2,...)(3)(4)(...)
```

那么怎么样才能无限调用呢？没错，用递归。

```js
function Add() {
	const nums = [...arguments];
	function AddPro() {
		nums.push(...arguments);
    return AddPro;
	}
	return AddPro;
}
```

嗯，其实我们写到这里发现了... 由于是无限递归，我们没办法确定最后一次函数调用，因此我们需要最后显式调用一个结束的方法来打印出最后的数据。

很自然地，我们可以在 `AddPro` 添加一个方法 `sumOf` 来解决这个问题。

> 学弟就是卡在这里地方，被函数添加上一个方法搞懵了。你是否知道呢？

```js
function Add() {
	const nums = [...arguments];
	function AddPro() {
		nums.push(...arguments);
    return AddPro;
	}
	AddPro.sumOf = () => {
		return nums.reduce((a, b) => a + b);
	}
	return AddPro;
}
```

好啦好啦，结束啦。

等等

在最后，我再来补充一种方案，`function` 不仅可以继续挂载 `function` ~ 还可以挂载变量哦~

```js
function Add() {
	if (!Add.nums) {
  	Add.nums = [];
  }
  Add.nums.push(...arguments);
  return Add;
}
Add.sumOf = () => {
	return Add.nums.reduce((a, b) => a + b);
}
```

如果上述回答有更优解，请公众号后台回复，留下你的微信，红包相送。

我们总结一下，小小的面试题涉及到的基础知识。

**闭包、递归、作用域、函数与对象**

基础就是基础，永远是你爸爸，掌握好基础，以不变应万变。

## 一个彩蛋

```js
function Add() {
	const nums = [...arguments];
	return () => {
		nums.push(...arguments);
		return () => {
			nums.push(...arguments);
			return nums.reduce((a, b) => a + b);
		}
	}
}
// 如果我上述代码中间换成箭头函数又会怎么样呢~，公众号号后台回复自己的理解，抽取2位优秀回答者送红包(6.6元)哦~大朋友就别来了~
```

## 后记

也许你觉得这题有点简单，通过简单的重复练习就能轻松记住，但是最主要的是思路，很多事情都是一样，掌握事情的方法和方向是最重要的。毕竟淘宝也不是一蹴而就的~ 但是只要方向正确了，都会好起来的。



