# 你不知道的javascript之运算符||和&&


学过c，php这些语言的同学在学习javascript时候可能会有一些困扰，因为javascript中的||、&&和c或者是php中有很大的差别。因为在javascript中返回的类型并不是布尔值，他返回的而是两个操作值中之一，例如一下例子：

```javascript
var a = 12;
var b = "qwer";
var c = null;

a||b;  //12;
a&&b;  //qwer
c||b;  //qwer
c&&b;  null
```
看了上面的例子相信大家都应该明白了把。||和&&首先对第一个操作数进行判断，如果其不是布尔值，先会进行强制类型转换，然后在执行条件判断。可以总结为两点：

 - 对于||来说，如果第一个数为真，那么返回第一个数，反之则为第二个数。
 - 而对于&&来说，如果第一个数为真，那么返回第二个数，反之则为第一个数。

上述中，c&&b，c为null，为假值，所以返回为第一个数，为null。

换一个角度来说就是这样：

```javascript
a||b    相当于      a?a:b
a&&b    相当于      a?b:a

```

下面是一个常用的例子，相信大家都用过

```javascript
function come(a,b){
	a = a|| "hello";
	b = b|| "world";
}
come(); //"hellow world"
come("happy","newyear");//"happy newyear"
```

a =  a||"hello"检查变量a是否赋值，如果还未赋值，就给定一个默认值“hello”。

还有一种模式，在开发过程中不常见，但是在压缩工具中常见。

```javascript
function come (){
	console.log(a);
}
var a = 12;
a&&come();//12
```
而在日常开发中比较常用的确是

```javascript
if(a){
	come();
}
```
但是相比，a&&come()更加简洁。

可能你会问为什么在javascript中返回的是值而不是布尔值，那为什么还有a&&(b||c)这样的式子成立呢，因为在javascript中在这些判断式中会执行隐式强制转化。例如

```javascript
var a = 12;
var b = null;
var c = "hello";
if(a&&(b||c)){
	console.log('yeah');
}
```
这里a&&(b||c)的结果实际上是“hello”,然后由if将"hello"强转化为布尔值，所以最后结果为true。

