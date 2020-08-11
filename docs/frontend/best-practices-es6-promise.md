# ES6 Promise 的最佳实践

> 译文来自 https://dev.to/somedood/best-practices-for-es6-promises-36da
> 
> 原作者 Basti Ortiz (Some Dood)
> 
> 译者: 蓝色的秋风(github/hua1995116)

ES6 promise 是非常棒的一个功能， 它是 JavaScript 异步编程中不可或缺的部分，并且取代了以 `回调地狱`而闻名的基于回调的模式。

然而 promises 的概念并不是非常容易理解。在本文中，我将讨论这些年来学到的最佳实践，这些最佳实践可以帮助我充分利用异步 JavaScript。

## 处理 promise rejections

没有什么比 `unhandled promise rejection`（未处理的 promise 错误） 更让人头疼了。当一个 promise 抛出一个错误，但你没有使用`Promise#catch`来捕获程序错误时，就出现这种情况。

在调试高并发的应用程序时，由于错误信息晦涩难懂（令人头疼），所以想要找到出错的 promise 是非常困难的。然而，一旦找到出错的 promise 并被认为是可复现的，但是应用程序本身的并发性，应用程序的状态通常也同样难以确定。总的来说，这非常的糟糕。

**解决方案很简单：虽然你认为程序不会出错，但还是要为可能出错的 promises 附加一个 `Promise#catch` 处理程序。**

此外，在未来的 Node.js 版本中，未处理的 promise reject 将使 Node 进程崩溃。良好的习惯能够有效降低出错的概率，现在就是养成良好习惯的时机。

## 保持它的"线性"

https://dev.to/somedood/please-don-t-nest-promises-3o1o

在之前的一篇文章中，我解释了避免嵌套 promises 的重要性。简而言之，嵌套 promise 又回到了 "回调地狱 "的模式。 promises 的目的是为异步编程提供符合习惯的标准化语义。如果嵌套 promises，我们又回到了 Node.js api 中流行的冗长而又相当麻烦的错误优先回调（https://nodejs.org/api/errors.html#errors_error_first_callbacks）。

> Node.js 核心 API 公开的大多数异步方法都遵循惯用模式，称为错误优先回调。 通过这种模式，回调函数作为参数传递给方法。 当操作完成或引发错误时，将以 Error 对象（如果有）作为第一个参数传递来调用回调函数。 如果未引发错误，则第一个参数将作为 null 传递。

为了保持异步活动的“线性”，我们可以使用[async 函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)或线性的链式 promises。

```javascript
import { promises as fs } from "fs";

// 嵌套 Promises
fs.readFile("file.txt").then((text1) =>
  fs.readFile(text1).then((text2) => fs.readFile(text2).then(console.log))
);

// 线性链式 Promises
const readOptions = { encoding: "utf8" };
const readNextFile = (fname) => fs.readFile(fname, readOptions);
fs.readFile("file.txt", readOptions)
  .then(readNextFile)
  .then(readNextFile)
  .then(console.log);

// async 函数
async function readChainOfFiles() {
  const file1 = await readNextFile("file.txt");
  const file2 = await readNextFile(file1);
  console.log(file2);
}
```

## `util.promisify` 是你最好的伙伴

当我们从错误优先回调过渡到 ES6 promises 时，我们习惯于养成一切 `promisifying` 化。

在大多数情况下，用 Promise 构造函数包装基于回调的旧 API 就足够了。 一个典型的例子是将 [`globalThis.setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) 作为`sleep函数`

```JavaScript
const sleep = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);
await sleep(1000);
```

但是，其他的外部库未必会 "友好 " 地使用的 promises。如果我们不小心，可能会出现某些不可预见的副作用--比如内存泄漏。在 Node.js 环境中，`util.promisify` 函数的存在就是为了解决这个问题。

顾名思义，`util.promisify`可以做兼容和简化基于回调的 API 的包装。 它假定给定函数像大多数 Node.js API 一样接受错误优先的回调作为其最终参数。 如果存在特殊的[实现细节](https://dev.to/somedood/best-practices-for-es6-promises-36da#fn1)，则库作者还可以提供 [自定义 promisifier](https://nodejs.org/api/util.html#util_custom_promisified_functions)。

```javascript
import { promisify } from "util";
const sleep = promisify(setTimeout);
await sleep(1000);
```

## 避免顺序陷阱

https://dev.to/somedood/javascript-concurrency-avoiding-the-sequential-trap-7f0

在本系列的上一篇文章中，我大量讨论了调度多个独立的 Promise 的功能。 由于 promise 的顺序性，promise 链只能使我们走到目前为止。（换句话说，promise 链式中的任务是按顺序执行的，译者注） 因此，让程序的 "idle time(空闲时间)" 最小化的关键是并发。(以下使用 Promise.all 来实现并发，译者注)

```javascript
import { promisify } from 'util';
const sleep = promisify(setTimeout);

// Sequential Code (~3.0s)
sleep(1000)
  .then(() => sleep(1000));
  .then(() => sleep(1000));

// Concurrent Code (~1.0s)
Promise.all([ sleep(1000), sleep(1000), sleep(1000) ]);
```

## 注意:promise 也会阻止事件循环

关于 promise 的最大的误解可能是一种主观意识，即 "promises 允许执行`多线程` 的 JavaScript"。 尽管事件循环给出了 `并行性(parallelism)`的错觉，但这仅是错觉。 在底层，JavaScript 仍然是单线程的。

事件循环只允许运行时并发地进行调度、编排和处理事件。 不严格地讲，这些“事件”确实是并行发生的，但是当时间到了，它们仍将按顺序处理。

在下面的示例中，promise 不会使用给定的执行程序函数生成新线程。实际上，执行函数总是在构造 promise 时立即执行，从而阻塞事件循环。执行程序函数返回后，将恢复顶层执行。resolve 的返回值 (`Promise#then`处理程序的代码)被延迟到当前调用堆栈完成剩余的顶级代码。

由于 Promise 不会自动产生新线程，因此在后续`Promise＃then`处理程序中占用大量 CPU 的工作也会阻塞事件循环。

```javascript
Promise.resolve()
  //.then(...)
  //.then(...)
  .then(() => {
    for (let i = 0; i < 1e9; ++i) continue;
  });
```

## 考虑内存使用情况

由于某些不必需的[堆分配](https://www.youtube.com/watch?v=wJ1L2nSIV1s)，promises 往往会占用相对较高的内存和计算成本。

除了存储有关 Promise 实例本身的信息（例如其属性和方法）之外，JavaScript 运行时还动态分配更多内存以跟踪与每个 Promise 相关的异步活动。

此外，考虑到 Promise API 大量使用了闭包和回调函数（它们都需要自己的堆分配），令人惊讶的是，一个 promise 就需要大量的内存。 大量的 promises 可能被证明在热代码路径(hot-code-path )（https://english.stackexchange.com/questions/402436/whats-the-meaning-of-hot-codepath-or-hot-code-path）中。（在热代码路径中分配堆，可能会触发垃圾收集，会导致性能的极端恶化，因此能少用就好用，译者注，相关信息 https://stackoverflow.com/questions/22894877/avoid-allocations-in-compiler-hot-paths-roslyn-coding-conventions）。

通常来讲，Promise 的每个新实例都需要大量堆分配来存储属性，方法，闭包和异步状态。 我们使用的 promise 越少，从长远来看，性能会越好。

## 同步的 promise 是不必要且多余的

像前面所说，promise 不会神奇地产生新线程。 因此，一个完全同步的执行器函数（对于 Promise 构造函数）仅仅是一个不必要的中间层。

```javascript
const promise1 = new Promise((resolve) => {
  // Do some synchronous stuff here...
  resolve("Presto");
});
```

类似地，将`Promise＃then`处理程序附加到同步解析的 Promise 只会稍微延迟代码的执行。对于此用例，最好使用 `global.setImmediate`。

```javascript
promise1.then((name) => {
  // This handler has been deferred. If this
  // is intentional, one would be better off
  // using `setImmediate`.
});
```

举例来说，如果执行程序函数不包含异步 I/O 操作，则它仅充当不必要的中间层，承担不必要的内存和计算开销。

因此，我个人**不鼓励**自己在项目中使用`Promise.resolve`和`Promise.reject`。 这些静态方法的主要目的是在 promise 中优化包装一个值。 所产生的 promise 将立即得到 resolve，因此可以说一开始就不需要 promise（除非出于 API 兼容性的考虑）。

```javascript
// Chain of Immediately Settled Promises
const resolveSync = Promise.resolve.bind(Promise);
Promise.resolve("Presto")
  .then(resolveSync) // Each invocation of `resolveSync` (which is an alias
  .then(resolveSync) // for `Promise.resolve`) constructs a new promise
  .then(resolveSync); // in addition to that returned by `Promise#then`.
```

## 长的 promise 链应该引起一些注意

有时需要串行执行多个异步操作。 在这种情况下，promise 链是理想。

但是，必须注意，由于 Promise API 是可以链式调用的，因此每次调用`Promise＃then`都会构造并返回一个新的 Promise 实例（保留了某些先前的状态）。 考虑到中间处理程序会创建其他 promise，长链有可能对内存和 CPU 使用率造成重大损失。

```javascript
const p1 = Promise.resolve("Presto");
const p2 = p1.then((x) => x);

// The two `Promise` instances are different.
p1 === p2; // false
```

换句话说，所有中间处理程序必须严格地是异步的，也就是说，它们返回 promises。只有最终处理程序保留运行同步代码的权利。(最后一个 `.then` 才配拥有全部同步代码执行的权利，这样的方式能够提高性能，译者注)

```javascript
import { promises as fs } from "fs";

// This is **not** an optimal chain of promises
// based on the criteria above.
const readOptions = { encoding: "utf8" };
fs.readFile("file.txt", readOptions)
  .then((text) => {
    // Intermediate handlers must return promises.
    const filename = `${text}.docx`;
    return fs.readFile(filename, readOptions);
  })
  .then((contents) => {
    // This handler is fully synchronous. It does not
    // schedule any asynchronous operations. It simply
    // processes the result of the preceding promise
    // only to be wrapped (as a new promise) and later
    // unwrapped (by the succeeding handler).
    const parsedInteger = parseInt(contents);
    return parsedInteger;
  })
  .then((parsed) => {
    // Do some synchronous tasks with the parsed contents...
  });
```

如上面的示例所示，完全同步的中间处理程序带来了对 Promise 的冗余包装和 resolve 值。 这就是为什么我们要遵循最佳 peomise 链的策略。 为了消除冗余，我们可以简单地将有问题的中间处理程序的工作集成到后续处理程序中。

```javascript
import { promises as fs } from "fs";

const readOptions = { encoding: "utf8" };
fs.readFile("file.txt", readOptions)
  .then((text) => {
    // Intermediate handlers must return promises.
    const filename = `${text}.docx`;
    return fs.readFile(filename, readOptions);
  })
  .then((contents) => {
    // This no longer requires the intermediate handler.
    const parsed = parseInt(contents);
    // Do some synchronous tasks with the parsed contents...
  });
```

(简而言之，promise 链能短则短，避免不必要的开销，译者注。)

## 保持简单

如果不需要它们，请不要使用它们。 就这么简单。

创建 Promises 的代价并不是"免费"的。 它们本身不触发 JavaScript 中的 "并行性"。(也就是不会让代码执行更快，译者注) 它们只是用于调度和处理异步操作的标准化抽象。 如果我们编写的代码不是异步的，那么就不需要 promises。

然后，通常情况下，我们确实需要在应用程序中使用 promises。 这就是为什么我们必须了解所有最佳实践，取舍，陷阱和误区。 当然所有的一切，仅仅是最小量使用的问题 – 不是因为 promise 是"恶魔"，而是提醒大家不要滥用他们。

故事未完待续。 在本系列的下一部分中，我将把最佳实践的讨论扩展到 [ES2017 异步函数](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)（_[(`async`/`await`)](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)._）
