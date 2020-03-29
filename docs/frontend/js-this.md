# 你不知道的javascript之this的全面解析之绑定规则(一)


##1.1 默认绑定
首先介绍的是函数调用类型：独立函数调用，在没有其他应用下的默认规则。
首先看以下代码
```javascript
function foo(){
	console.log(this.a);
}
var a = 2;
foo();//2
```
我们可以看到调用foo()时，this.a被解析成了全局变量a，为什么，因为在上述例子中，函数调用了默认绑定，因此this指向了全局对象。
那么我们怎么知道这里应用了默认绑定呢？可以通过分析调用位置来看看foo()是如何调用的。在代码中,foo()是直接使用不带任何修饰的函数引用进行调用的，因此只能使用默认绑定，无法应用其他规则。
如果使用严格模式，则不能将全局对象用于默认绑定，因此this会绑定undefind:

```javascript
function foo(){
	"use strict ";
	console.log(this.a);
}
var a = 2;
foo();//TyoeError:this is undefind
```
##1.2 隐式绑定
另一条规则是调用的位置是否有上下文对象，或者说是否被某个对象拥有或者包含，不过这种说法可能会造成一些误导。

```javascript
function foo(){
	console.log(this.a );
}
var obj = {
	a : 2,
	foo:foo
};
obj.foo();//2
```
首先需要注意的是foo()的声明方式，及其之后是如何被当作引用属性添加到obj中的，但是无论是直接在obj中定义还是先定义再添加引用属性，这个函数严格来说都不属于obj对象。
然而，调用位置会使用obj上下文来引用函数，因此你可以说函数被调用时obj对象“拥有”或者“包含”它。
无论你如何称呼，当foo()被调用时，它的前面确实加上了对obj的引用，隐式绑定规则会把函数调用中的this绑定到这个上下文对象。
对象属性引用链只有上一层或者说最后一层在调用中起作用。

```javascript
function foo(){
	console.log(this.a);
}

var obj = {
	a : 12,
	foo : foo
}

var obj2 = {
	a : 2,
	obj : obj
}

obj2.obj.foo()//12
```
###1.2.1 隐式丢失
type1 :

```javascript
function foo(){
	console.log(this.a);
}

var obj = {
	a : 2，
	foo : foo　　　　
}

var bar = obj.foo;
var a = "happy new year";
bar ();//happy new yaer
```
type2 :

```javascript
function foo(){
	console.log(this.a);
}

function doFoo(fn){
	fn();
}

var obj = {
	a : 2,
	foo:foo
}

var a = "hello world";

doFoo(obj.foo)//hello world
```
type3  :

```javascript
function foo (){
	console.log(this.a);
}

var obj = {
	a :　2,
	foo : foo
}
var a = "gril !";
setTimeout(obj.foo,1000);//gril !
```
大家看了上述对this的解释，是否对this有了更加深刻的了解了呢？尽请看下期。


