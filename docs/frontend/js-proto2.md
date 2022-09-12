# 你不知道的 javascript 之 JS 原型对象和原型链

##**开篇**
之前对 js 中的原型链和原型对象有所了解，每当别人问我什么是原型链和原型对象时，我总是用很官方（其实自己不懂）的解释去描述。有一句话说的好：如果你不能把一个很复杂的东西用最简单的话语描述出来，那就说明你没有真正的理解。最近正在读《Javascript 高级程序设计》，书中对原型对象和原型链的描述让我受益匪浅，下面仅用一个对比性的例子来说明。 ##**我们经常会这么写**

```javascript
function Person() {
  this.name = "John";
}
var person = new Person();
Person.prototype.say = function() {
  console.log("Hello," + this.name);
};
person.say(); //Hello,John
```

上述代码非常简单，Person 原型对象定义了公共的 say 方法，虽然此举在构造实例之后出现，但因为原型方法在调用之前已经声明，因此之后的每个实例将都拥有该方法。从这个简单的例子里，我们可以得出：
**原型对象的用途是为每个实例对象存储共享的方法和属性，它仅仅是一个普通对象而已**。并且所有的实例是共享同一个原型对象，因此有别于实例方法或属性，原型对象仅有一份。所有就会有如下等式成立：

```javascript
person.say == new Person().say;
```

##**可能我们也会这么写**

```javascript
function Person() {
  this.name = "John";
}
var person = new Person();
Person.prototype = {
  say: function() {
    console.log("Hello," + this.name);
  },
};
person.say(); //person.say is not a function
```

很不幸，person.say 方法没有找到，所以报错了。其实这样写的初衷是好的：因为如果想在原型对象上添加更多的属性和方法，我们不得不每次都要写一行 Person.prototype,还不如提炼成一个 Object 来的直接。但是此例子巧就巧在构造实例对象操作是在添加原型方法之前，这样就会造成一个问题：
当 var person = new Person()时，Person.prototype 为：Person {}(当然了，内部还有 constructor 属性),即 Person.prototype 指向一个空的对象{}。而对于实例 person 而言，其内部有一个原型链指针 proto,该指针指向了 Person.prototype 指向的对象，即{}。接下来重置了 Person 的原型对象，使其指向了另外一个对象,即
Object {say: function}，
这时 person.proto 的指向还是没有变，它指向的{}对象里面是没有 say 方法的，因为报错。
从这个现象我们可以得出：
**在 js 中，对象在调用一个方法时会首先在自身里寻找是否有该方法，若没有，则去原型链上去寻找，依次层层递进，这里的原型链就是实例对象的**proto**属性。**

若想让上述例子成功运行，最简单有效的方法就是交换构造对象和重置原型对象的顺序，即：

```javascript
function Person() {
  this.name = "John";
}
Person.prototype = {
  say: function() {
    console.log("Hello," + this.name);
  },
};
var person = new Person();
person.say(); //person.say is not a function
```

##**一张图让你秒懂原型链**
![这里写图片描述](https://s3.mdedit.online/blog/1579506284317.jpg)
其实，只需要明白原型对象的结构即可：

```javascript
    Function.prototype = {
        constructor : Function,
        __proto__ : parent prototype,
        some prototype properties: ...
    };
```

**总结：函数的原型对象 constructor 默认指向函数本身，原型对象除了有原型属性外，为了实现继承，还有一个原型链指针**proto**，该指针指向上一层的原型对象，而上一层的原型对象的结构依然类似，这样利用**proto**一直指向 Object 的原型对象上，而 Object 的原型对象用 Object.**proto** = null 表示原型链的最顶端，如此变形成了 javascript 的原型链继承，同时也解释了为什么所有的 javascript 对象都具有 Object 的基本方法。**
