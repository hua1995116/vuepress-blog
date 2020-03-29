# 你不知道的javascript之函数作用域和块作用域（一）


## 立即执行函数表达式(IIFE) ##
####1.使用匿名函数表达式
```javascript
var a = 2;
(function IIFE(){
	var a = 3;
	console.log(a);//3
})();
console.log(a);//2
```
####2.当作函数调用并传递参数进去
```javascript
var a = 2;
(function IIFE(global){
	var a = 3;
	console.log(a);//3
	console.log(global.a);//2
})(window);
console.log(a);//2
```
####3.解决undefined标识符默认值被错误覆盖
```javascript
undefined = true;
(function IITF(){
	var a ;
	if(a === undefined){
		console.log('Undefined is safe here!');
	}
})();
```
####4.倒置代码的运行顺序
```javascript
var a = 2;
(function IFEE(def){
	def(window);
})(function def(global){
	var a = 3;
	console.log(a);//3
	console.log(global.a);//2
});
```
## 块作用域 ##
####for语句,i会被绑定在外部作用域（函数或全局）

```javascript
for(var i = 0 ; i < 10 ; i++){
	console.log(i);
}
```
####if语句,当使用var声明变量时，在哪里都一样

```javascript
var foo = true;
if(foo){
	var bar = foo*2;
	bar = something(bar);
	console.log(bar);
}
```
####以下是一个闭包结合自执行函数的实例
```javascript
var i = 1;
var IFun = (function(){
	var i = 1;
	console.log(i);
	return function(){
		i++;
		console.log(i);
}
})();
IFun();
IFun();
最终输出的结果为1，2，3，很多会下意识的觉得结果会有4个值，但是运用了return 返回值以及自执行函数将函数返回给IFun变量，使得在第一次操作过程后，将返回函数直接赋给IFun。
```