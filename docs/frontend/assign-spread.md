# [译] Object.assign 和 Object Spread 之争, 用谁？

> 原文链接 [http://thecodebarbarian.com/object-assign-vs-object-spread.html](http://thecodebarbarian.com/object-assign-vs-object-spread.html)

在 2018 年 [Object Rest/Spread Proposal](https://github.com/tc39/proposal-object-rest-spread) 达到了 [stage 4](https://tc39.github.io/process-document/ )，这意味着在未来它会将入到 ECMAScript 标准中。它也被加入到Node LTS. Node.js 8 以后的版本你可以使用它，所以你可以放心地开始使用它。

> Object Spread 也可以叫做对象展开符，下文都以 Object Spread 来进行描述。

```bash
$ node -v
v8.9.4
$ node
> const obj = { foo: 1, bar: 1 };
undefined
> ({ ...obj, baz: 1 });
{ foo: 1, bar: 1, baz: 1 }
```

Object Spread 和 Object.assign 在功能上很相似。你应该使用哪一个？ 事实证明，答案比你想象的要微妙许多。

# Object Spread 概论

Object Spread 运算符的基本思想是使用现有对象的自身属性来创建新的普通对象。 所以`{...obj}` 创建一个和 `obj` 具有相同属性的对象。 对于[普通的旧 JavaScript 对象](http://g-liu.com/blog/2015/08/object-oriented-programming-javascript-using-pojos-for-good/)，你实际上是在创建一个`obj`副本。


```javascript
const obj = { foo: 'bar' };
const clone = { ...obj }; // `{ foo: 'bar' }`
obj.foo = 'baz';
clone.foo; // 'bar'
```

与object .assign()类似，Object spread 操作符不复制继承的属性或类的属性。但是它会复制 ES6 的 [symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 属性。

```javascript
class BaseClass {
  foo() { return 1; }
}

class MyClass extends BaseClass {
  bar() { return 2; }
}

const obj = new MyClass();
obj.baz = function() { return 3; };
obj[Symbol.for('test')] = 4;

// Does _not_ copy any properties from `MyClass` or `BaseClass`
const clone = { ...obj };

console.log(clone); // { baz: [Function], [Symbol(test)]: 4 }
console.log(clone.constructor.name); // Object
console.log(clone instanceof MyClass); // false
```

还可以使用 Object spread 操作符混合其他属性。

顺序问题: Object spread 操作符将覆盖在它之前定义的属性。

```javascript
const obj = { a: 'a', b: 'b', c: 'c' };
{ a: 1, b: null, c: void 0, ...obj }; // { a: 'a', b: 'b', c: 'c' }
{ a: 1, b: null, ...obj, c: void 0 }; // { a: 'a', b: 'b', c: undefined }
{ a: 1, ...obj, b: null, c: void 0 }; // { a: 'a', b: null, c: undefined }
{ ...obj, a: 1, b: null, c: void 0 }; // { a: 1, b: null, c: undefined }
```

# 和 Object.assign() 的区别

对于上面的例子，`Object.assign（）`函数基本上可以与 Object spread 操作符互换。事实上，[object spread spec](https://github.com/tc39/proposal-object-rest-spread/blob/master/Spread.md) 明确指出`{... obj}`等同于`Object.assign（{}，obj）`。

```javascript
const obj = { a: 'a', b: 'b', c: 'c' };
Object.assign({ a: 1, b: null, c: void 0 }, obj); // { a: 'a', b: 'b', c: 'c' }
Object.assign({ a: 1, b: null }, obj, { c: void 0 }); // { a: 'a', b: 'b', c: undefined }
Object.assign({ a: 1 }, obj, { b: null, c: void 0 }); // { a: 'a', b: null, c: undefined }
Object.assign({}, obj, { a: 1, b: null, c: void 0 }); // { a: 1, b: null, c: undefined }
```

那么你为什么要使用其中一个呢？一个关键的区别是 Object spread 操作符总是给你一个POJO(Plain Ordinary JavaScript Object)。而`Object.assign（）`函数却修改其第一个传入对象`obj`：

```javascript
class MyClass {
  set val(v) {
    console.log('Setter called', v);
    return v;
  }
}
const obj = new MyClass();

Object.assign(obj, { val: 42 }); // Prints "Setter called 42"
```

换句话说，`Object.assign（）`修改了一个对象，因此它可以触发 [ES6 setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set)。如果你更喜欢使用[immutable](https://facebook.github.io/immutable-js/)技术，那么 Object spread 操作符就是你更好的选择。使用 `Object.assign()`，你必须确保始终将空对象`{​​}`作为第一个参数传递。

> **2019.02.12 补充说明，当一个 Object 使用了 Object.defineProperty 修改了 set 方法，因为调用 Object.assign 会触发 setter 方法，会触发意想不到的错误。**

性能怎么样？ 这是一些简单的基准测试。如果将空对象作为第一个参数传递给`Object.assign()`，看起来 Object spread 会更快，但除此之外它们是可互换的。

下面是一个使用`Object.assign()`和in-place赋值的基准测试:

```javascript
const Benchmark = require('benchmark');

const suite = new Benchmark.Suite;

const obj = { foo: 1, bar: 2 };

suite.
  add('Object spread', function() {
    ({ baz: 3, ...obj });
  }).
  add('Object.assign()', function() {
    Object.assign({ baz: 3 }, obj);
  }).
  on('cycle', function(event) {
    console.log(String(event.target));
  }).
  on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  }).
  run({ 'async': true });

```

在这种情况下，两者是相似的：

```
Object spread x 3,170,111 ops/sec +-1.50% (90 runs sampled)
Object.assign() x 3,290,165 ops/sec +-1.86% (88 runs sampled)
Fastest is Object.assign()
```

但是，一旦向`Object.assign（）`输入一个空对象参数，对象扩展运算符就会更快

```javascript
suite.
  add('Object spread', function() {
    ({ baz: 3, ...obj });
  }).
  add('Object.assign()', function() {
    Object.assign({}, obj, { baz: 3 });
  })
```

这是输出：

```
Object spread x 3,065,831 ops/sec +-2.12% (85 runs sampled)
Object.assign() x 2,461,926 ops/sec +-1.52% (88 runs sampled)
Fastest is Object spread

```

# ESLint 配置

默认情况下，ESLint在解析层面[禁止对象rest / spread运算符](https://github.com/eslint/eslint/issues/10307)你需要在.eslintrc.yml中将parserOptions.ecmaVersion选项设置为至少9，否则你将得到一个解析错误。

```
parserOptions:
  # Otherwise object spread causes 'Parsing error: Unexpected token ..'
  ecmaVersion: 9
```

ESLint添加了一个[新的规则](https://github.com/eslint/eslint/pull/9955)prefer-object-spread，它会强制你使用 Object spread 操作符 而不是`Object.assign（）`。 要启用此规则，请使用：

```
parserOptions:
  ecmaVersion: 9
rules:
  prefer-object-spread: error
```

现在，如果您使用`object .assign()`而不是Object spread, ESLint将报告一个错误。

```
Use an object spread instead of `Object.assign` eg: `{ ...foo }`  prefer-object-spread
```

# 最后

Object rest / spread运算符在语法更加简洁，并且比`Object.assign（）`提供了性能优势。 如果你运行的是Node.js 8或更高版本，请尝试使用这些新运算符，使代码更简洁。

# 更多请关注

友情链接： https://huayifeng.top/

![](https://s3.qiufengh.com/blog/1568533452735.png)
