# 未来的 JavaScript 应该是什么样的？现在还缺少什么？

> 原文链接: http://2ality.com/2019/01/future-js.html
> 作者：Axel Rauschmayer ; 著有《JavaScript for impatient programmers》、《Speaking JavaScript

近年来，JavaScript的规模已经大大增加。这篇博客文章探讨了仍然缺失的内容。


说明：
1. 我只列出了我发现最重要的缺失功能。 许多其他的功能也很有用，但也会带来因为增加太多而引起的风险。
2. 我的选择列举这些功能是主观的。
3. 本博客文章中提及的几乎所有内容都在TC39的预测上。 也就是说，它还可以作为未来可能的JavaScript 发展的预览。

有关前两个问题的更多想法，请参阅[语言设计部分](http://2ality.com/2019/01/future-js.html#language-design) (http://2ality.com/2019/01/future-js.html#language-design)。

# Values  

## 按值比较对象

 目前，JavaScript只比较原始值，例如字符串值（通过查看其内容）

 ```shell
 > 'abc' === 'abc'
true
 ```

相比之下，对象通过引用进行比较（对象仅严格等于自身）：

```shell
> {x: 1, y: 4} === {x: 1, y: 4}
false
```

如果有一种方法可以创建按值进行比较的对象，那将是很好的：

```
> #{x: 1, y: 4} === #{x: 1, y: 4}
true
```

另一种可能性是引入一种新的类(具体细节待定)

```javascript
@[ValueType]
class Point {
  // ···
}
```

提示：将类标记为值类型，是基于装饰器的草案。

## 将对象放入数据结构

当对象通过引用进行比较时，将它们放入（non-weak）ECMAScript 数据结构（如Maps）中是没有意义的：

```javascript
const m = new Map();
m.set({x: 1, y: 4}, 1);
m.set({x: 1, y: 4}, 2);
assert.equal(m.size, 2);
```

可以通过自定义值类型修复此问题。 或者可以自定义Set属性和Map键的管理。 例如:

- 通过哈希表映射: 需要一个用于检查等式的操作和另一个用于创建哈希码的操作。如果使用哈希码，则希望对象是不可变的。 否则，破坏数据结构就太容易了。
- 通过排序树映射: 需要一个比较两个值的操作，以管理它存储的值。


Hash Map 意思是会给每个对象分配一个哈希值，来代表唯一性。但是对于这个传入的对象，需要是不可变的，否则的话，容易破坏数据结构。

Tree Map 或者需要比较两个对象的值操作以此来管理储存的值。

https://yikun.github.io/2015/04/06/Java-TreeMap%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%E5%8F%8A%E5%AE%9E%E7%8E%B0/

https://juejin.im/entry/57bfab077db2a20068ebf9d2

https://blog.csdn.net/github_26672553/article/details/77185003

https://286.iteye.com/blog/2189266

https://www.cnblogs.com/skywang12345/p/3310928.html
## 大型整数

JavaScript数字总是64位（双精度），它为整数提供53位加号。这意味着超过53位，你不能再代表每个数字了：

```node
> 2 ** 53
9007199254740992
> (2 ** 53) + 1  // can’t be represented
9007199254740992
> (2 ** 53) + 2
9007199254740994
```

在某些情况下，这是一个相当大的限制。 现在有一个关于 `BigInts 的提案`[1]，即实数整数，其精度随着需要的增长而增长：


[1]提案地址：http://2ality.com/2017/03/es-integer.html

```node
> 2n ** 53n
9007199254740992n
> (2n ** 53n) + 1n
9007199254740993n
```

BigInts 还支持强制转换，它可以给你提供固定位数的值：

```javascript
const int64a = BigInt.asUintN(64, 12345n);
const int64b = BigInt.asUintN(64, 67890n);
const result = BigInt.asUintN(64, int64a * int64b);
```

## 十进制计算

JavaScript的数字是基于IEEE 754标准的64位浮点数（双精度数）。鉴于它们的表示形式是base-2，在处理小数分数时可能会出现舍入误差：

```
> 0.1 + 0.2
0.30000000000000004
```

这在科学计算和金融技术（金融科技）中尤其成问题。目前有一项关于10进制数的建议处于 stage0。它们可能最终被这样使用（注意十进制数的后缀m）

提案地址：https://github.com/tc39/proposals/blob/master/stage-0-proposals.md

## 对值进行分类

