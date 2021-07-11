## js 实现 bind 的这五层，你在第几层？

最近在帮女朋友复习 JS 相关的基础知识，遇到不会的问题，她就会来问我。

![image-20210511013512798](https://s3.qiufengh.com/blog/image-20210511013512798.png)

这不是很简单？三下五除二，分分钟解决。

```js
function bind(fn, obj, ...arr) {
	return fn.apply(obj, arr)
}
```

于是我就将这段代码发了过去

![image-20210511013602940](https://s3.qiufengh.com/blog/image-20210511013602940.png)

这时候立马被女朋友进行了一连串的灵魂拷问。

![image-20210511013907433](https://s3.qiufengh.com/blog/image-20210511013907433.png)

这个时候，我马老师就坐不住了，我不服气，我就去复习了一下 bind，发现太久不写基础代码，还是会需要一点时间复习，这一次我得写一个有深度的 bind，深的马老师的真传，给他分成了五层速记法。

![dasima](https://s3.qiufengh.com/blog/dasima.jpeg)

## 第一层 - 绑定在原型上的方法

这一层非常的简单，得益于 JS 原型链的特性。由于 function xxx 的原型链 指向的是 `Function.prototype` , 因此我们在调用 xxx.bind 的时候，调用的是  Function.prototype 上的方法。

```js
Function.prototype._bind = function() {}
```

这样，我们就可以在一个构造函数上直接调用我们的bind方法啦~例如像这样。

```js
funciton myfun(){}
myfun._bind();
```

想要详细理解这方面的可以看这张图和这篇文章（https://github.com/mqyqingfeng/blog/issues/2）

![js-prototype](https://s3.qiufengh.com/blog/js-prototype.png)



## 第二层 - 改变 this 的指向

这可以说是 bind 最核心的特性了，就是改变 this 的指向，并且返回一个函数。而改变 this , 我们可以通过已知的  apply 和 call 来实现，这里我们就暂且使用 apply 来进行模拟。首先通过 `self` 来保存当前 this，也就是传入的函数。因为我们知道 this 具有 `隐式绑定`的规则（**摘自 《你不知道的JavaScript(上)》2.2.2** ），

```js
function foo() {console.log(this.a)}
var obj = {a: 2, foo};
obj.foo(); // 2
```

通过以上特性，我们就可以来写我们的 _bind 函数。

```js
Function.prototype._bind = function(thisObj) {
	const self = this;
	return function () {
    self.apply(thisObj);
  }
}
```

```js
var obj = {a:1}
function myname() {console.log(this.a)}
myname._bind(obj)(); // 1
```

可能很多朋友都止步于此了，因为在一般的面试中，特别是一些校招面试中，可能你只需要知道前面两个就差不多了。但是想要在面试中惊艳所有人，仍然是不够的，接下来我们继续我们的探索与研究。

## 第三层 - 支持柯里化

函数柯里化是一个老生常谈的话题，在这里再复习一下。

```js
function fn(x) {
	return function (y) {
		return x + y;
	}
}
var fn1 = fn(1);
fn1(2) // 3
```

不难发现，柯里化使用了闭包，当我们执行 fn1 的时候，函数内使用了外层函数的 x， 从而形成了闭包。

而我们的 bind 函数也是类似，我们通过获取当前外部函数的  `arguments` ，并且去除了绑定的对象，保存成变量 `args`，最后 `return` 的方法，再一次获取当前函数的  `arguments`, 最终用 `finalArgs` 进行了一次合并。

```js
Function.prototype._bind = function(thisObj) {
	const self = this;
  const args = [...arguments].slice(1)
	return function () {
    const finalArgs = [...args, ...arguments]
    self.apply(thisObj, finalArgs);
  }
}
```

通过以上代码，让我们 bind 方法，越来越健壮了。

```js
var obj = { i: 1}
function myFun(a, b, c) {
  console.log(this.i + a + b + c);
}
var myFun1 = myFun._bind(obj, 1, 2);
myFun1(3); // 7
```

一般到了这层，可以说非常棒了，但是再坚持一下下，就变成了完美的答卷。

## 第四层 - 考虑 new 的调用

要知道，我们的方法，通过 bind 绑定之后，依然是可以通过 new 来进行实例化的， `new` 的优先级会高于 `bind`（**摘自 《你不知道的JavaScript(上)》2.3 优先级**）。

这一点我们通过原生  bind 和我们第四层的 _bind 来进行验证对比。

```js
// 原生
var obj = { i: 1}
function myFun(a, b, c) {
  // 此处用new方法，this指向的是当前函数 myFun 
  console.log(this.i + a + b + c);
}
var myFun1 = myFun.bind(obj, 1, 2);
new myFun1(3); // NAN

// 第四层的 bind
var obj = { i: 1}
function myFun(a, b, c) {
  console.log(this.i + a + b + c);
}
var myFun1 = myFun._bind(obj, 1, 2);
new myFun1(3); // 7
```

**注意，这里使用的是 `bind`方法**

因此我们需要在 bind 内部，对 new 的进行处理。而 `new.target` 属性，正好是用来检测构造方法是否是通过 `new` 运算符来被调用的。

接下来我们还需要自己实现一个 new ，

> 而根据 `MDN`，**`new`** 关键字会进行如下的操作：
>
> 1.创建一个空的简单JavaScript对象（即`{}`）；
>
> 2.链接该对象（设置该对象的**constructor**）到另一个对象 ；
>
> 3.将步骤1新创建的对象作为`this`的上下文 ；
>
> 4.如果该函数没有返回对象，则返回`this`。

```js
Function.prototype._bind = function(thisObj) {
	const self = this;
  const args = [...arguments].slice(1);
	return function () {
    const finalArgs = [...args, ...arguments];
		// new.target 用来检测是否是被 new 调用
    if(new.target !== undefined) {
      // this 指向的为构造函数本身
      var result = self.apply(this, finalArgs);
      // 判断改函数是否返回对象
      if(result instanceof Object) {
        return reuslt;
      }
      // 没有返回对象就返回 this
      return this;
    } else {
      // 如果不是 new 就原来的逻辑
      return self.apply(thisArg, finalArgs);
    }
  }
}
```

看到这里，你的造诣已经如火纯情了，但是最后还有一个小细节。

## 第五层 - 保留函数原型

以上的方法在大部分的场景下都没有什么问题了，但是，当我们的构造函数有 prototype 属性的时候，就出问题啦。因此我们需要给 prototype 补上，还有就是调用对象必须为函数。

```js
Function.prototype._bind = function (thisObj) {
  // 判断是否为函数调用
  if (typeof target !== 'function' || Object.prototype.toString.call(target) !== '[object Function]') {
    throw new TypeError(this + ' must be a function');
  }
  const self = this;
  const args = [...arguments].slice(1);
  var bound = function () {
    var finalArgs = [...args, ...arguments];
    // new.target 用来检测是否是被 new 调用
    if (new.target !== undefined) {
      // 说明是用new来调用的
      var result = self.apply(this, finalArgs);
      if (result instanceof Object) {
        return result;
      }
      return this;
    } else {
      return self.apply(thisArg, finalArgs);
    }
  };
  if (self.prototype) {
    // 为什么使用了 Object.create? 因为我们要防止，bound.prototype 的修改而导致self.prototype 被修改。不要写成 bound.prototype = self.prototype; 这样可能会导致原函数的原型被修改。
    bound.prototype = Object.create(self.prototype);
    bound.prototype.constructor = self;
  }
  return bound;
};
```

以上就是一个比较完整的 bind 实现了，如果你想了解更多细节的实践，可以查看。（也是 MDN 推荐的）

https://github.com/Raynos/function-bind