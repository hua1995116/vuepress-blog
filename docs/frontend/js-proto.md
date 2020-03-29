# 你不知道的js类型转化和原型链

昨天晚上接到了蚂蚁金服的电面。其中有一道题，让我印象深刻，结束之后，我就去查了资料，写了一篇拙劣的文章来总结。

# 问题

```js
var a = {}; a.__proto__ === ?
```

```js
var a = 1; a.__proto__ === ?
```

当时模棱两可，我知道他们的顶端都是```Object.prototype```就直接回答这个选项，因为当时心里想着一切不是皆对象吗，那对象的原型链顶端不就是```Object.prototype```吗？还有为什么数字有原型链？脑子浮现出Functin，Array各种数据类型，但是还是非常的模糊，回答了之后面试官也没有继续追问（可能觉得我不清楚吧），但是这个问题始终是我心里的一个结，查了一些资料后，并对其进行了整理。

大家都知道，JavaScript的数据类型分为两种，一种是基础数据类型，另一种是引用数据类型。

### 什么是基础类型（**primitive** ）？

[A **primitive** (primitive value, primitive data type) is data that is not an [object](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Glossary/object) and has no [methods](https://link.zhihu.com/?target=https%3A//developer.mozilla.org/en-US/docs/Glossary/method).]没有属性和方法的数据。

# 类型转化

首先我们看第二个问题，从第二个问题着手来讲解，```var a = 1; a.__proto__=== ? ``` 去浏览器运行下可以知道，```a.__proto__=== Number.prototype```， 然后我们再这样运行 ```a.__proto__.__proto__=== Object.prototype```得到的结果竟然是true。

在前端我们说了，js分两种类型，那为什么一个数字(a)的原型链顶端是Object的原型?两者是怎么联系的？**primitive** 不是没有属性和方法吗？哪里来的原型链？

原来是这样的，js是弱语言，如果他发现类型不匹配的时候，他会干嘛？他会类型转化（Auto Convert）啊。

所以以上的问题变形一下就变成了```var a = 1; new Number(a).__proto__=== ?  ```这样问题就变得很明了了，一个Number方法，构造了一个Number的实例，那么原型链肯定是Number的原型啊（即Number.prototype）。再者，一个Number方法构造出的实例，必然有原型链。既然已经是一个实例，就是一个对象，再往上，必然是Object.prtotype。

再看一下栗子。

```js
var a = "abc";
console.info(a.length);

var b = 1;
console.info(b.toString());
```

这就是我们平常一直在使用的，理解上面的问题，你心中肯定知道了原因，为什么a,b是**primitive** ，但是为什么还有其他的属性。也是因为类型的转化，等同于

```
var a = "abc";
console.info(new String(a).length);
var b = 1;
console.info(new Number(b).toString());
```
### 小结

总结以上，所以，js基础类型确实和引用类型没有关系！没有关系！让他们发生关系的是！类型转化。（因为js自身原因，强行让他们发生了关系）。并且基础类型没有方法，没有属性。


![](https://s3.qiufengh.com/blog/1568533450478.png)

所以我觉得那句，js万物皆对象，真的有点坑人。

# 原型链

但是后来我又想，不是还有一些function,array,date之类的吗，那些又是什么，属于什么。这次我一并将他们理清楚。还有那些强行发生关系的构造函数,例如Number,String,Boolean,Date?



![](https://s3.qiufengh.com/blog/1568533450474.png)

以上就是我整理的关系以及引用类型的原型链走向。

提示（有些不太明白同学可能会误会）：

（我把Date，Number，Boolean，String归类到了Function。而刚才不是说原型链上是Objec.prototype么，那是你要搞清楚方法和new 方法()，方法通过new对象就变成了Object。下面也进行一些证明）  
![](https://s3.qiufengh.com/blog/1568533450397.png)


![](https://s3.qiufengh.com/blog/1568533450469.png)


![](https://s3.qiufengh.com/blog/1568533450470.png)



### 小结
Object只是在js中充当了一个复杂的类型，包含了许多的子集，但是Object和基础类型还是属于平行关系了。

# 延伸

通过以上的理解，还自己创建了一个用原型链对类型判断的方法。（因为据说用Object.prototype.toString.call()这样的实现方式有点丑陋而且奇怪的方法，别人会不明白你写的是什么东西。）

```js
var a = null;	
var b = 1;
var c = '1';
var d = undefined;
var g = true;
var e = function (){};
var f = [];
var h = new Date();
var i = {}

function type(a) {
	if(a === null) {
		return 'null';
	}
	if(typeof a === 'number') {
		return 'number';
	}
	if(typeof a === 'string') {
		return 'string'
	}
	if(typeof a === 'undefined') {
		return 'undefined';
	}
	if(typeof a === 'boolean') {
		return 'boolean';
	}
	if(a instanceof Array) {
		return 'array';
	}
	if(a instanceof Date) {
		return 'date';
	}
	if(a instanceof Function) {
		return 'function';
	}
	if(a instanceof Object) {
		return 'object';
	}
}

console.log(type(a)); // null 
console.log(type(b)); // number
console.log(type(c)); // string
console.log(type(d)); // undefined
console.log(type(f)); // array
console.log(type(e)); // function
console.log(type(g)); // boolean
console.log(type(h)); // date
console.log(type(i)); // object
```
# 总结
通过以上无非就想说明基础类型和引用类型的关系，以及各个类型的原型链。说的有点乱，如果有不对的地方请提出，我及时更正，以免带来误导。
留下一个问题，如果以上说的你都理解了，那么你必然知道这个答案。

```js
var a = 1;
a.a = 1;
console.log(a.a);
```