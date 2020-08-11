# ES2017 异步函数最佳实践（`async` /`await`）

> 译文来自 https://dev.to/somedood/best-practices-for-es2017-asynchronous-functions-async-await-39ji
> 
> 原作者 Basti Ortiz (Some Dood)
> 
> 译者: 蓝色的秋风(github/hua1995116)

简单来说，`async`函数是 promise 的 "语法糖"。它们允许我们使用更熟悉的语法来模拟同步执行，从而代替 promise 链式写法。

```javascript
// Promise Chain
Promise.resolve('Presto')
  .then(handler1)
  .then(handler2)
  .then(console.log);

// `async`/`await` Syntax
async function run() {
  const result1 = await handler1('Presto');
  const result2 = await handler2(result1);
  console.log(result2);
}
```

然而和 promise 一样，`async` 函数也不是 "免费" 的。 `async `关键字隐含初始化了几个Promise 【说明1】，以便最终在函数体中调用 `await`关键字的函数。

> 说明1: 在旧版本的ECMAScript规范中，最初要求JavaScript引擎为每个`async`函数构造至少三个Promise。 反过来，这意味着“微任务队列”中至少还需要三个“微任务”来 resolve 一个 async 函数 -更不用说执行过程中的加入的promise了。 这样做是为了确保 `await` 关键字正确地模拟`Promise＃then`的行为，同时仍保持“暂停的函数”的语义。 毫无疑问，与简单的promise 相比，这带来了显着的性能开销。 [在2018年11月的博客文章](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)中，V8团队描述了他们优化`async/await`的步骤。 这最终要求对[语言规范进行快修订](https://github.com/tc39/ecma262/pull/1250)，最终将会优化为初始化只需要一个promise。

回想一下前一篇文章（https://dev.to/somedood/best-practices-for-es6-promises-36da），我们注意到的是，使用多个 promises，它们的内存占用量和计算成本相对较高。 虽然说滥用 promise 是不好的，但是滥用 `async` 函数会带来更糟糕的后果（考虑启用"pausable functions<可暂停函数>"所需的额外步骤）：

- 引入低效率的代码；

- 延长空闲时间；

- 导致无法获取 promise rejections；

- 安排比最佳情况下更多的 "[微任务](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)"；

- 建立更多不必要的 promise。

异步函数确实是强大的一个功能。 但是为了充分利用异步JavaScript，必须有一些约束。 合理地使用正常的 promises 和 async 函数，就可以轻松编写功能强大的并发应用程序。

在本文中，我将把对最佳实践的讨论扩展到 `async`函数。

## 先安排任务，再`await`

异步 JavaScript 中最重要的概念之一是"scheduling（调度）"的概念。 在调度任务时，程序可以（1）阻止执行直到任务完成，或者（2）在等待先前计划的任务完成时处理其他任务 (后者通常是更有效的选择。

Promises，event listeners 和 callbacks 促进了这种“非阻塞”并发模型。 相反，`await`关键字在语义上意味着阻止执行。 为了获得最大的效率，判断整个函数体内何时何地使用`await`关键字是关键点。

等待异步函数的最合适时间并不总是像立即等待"[thenable](https://promisesaplus.com/)"表达式那样简单。 在某些情况下，先安排任务，然后执行一些同步计算，最后在功能体内 `await`（尽可能晚），这样效率更高。

```javascript
import { promisify } from 'util';
const sleep = promisify(setTimeout);

// 这并不是最高效的实现方式，但至少它是有效的。
async function sayName() {
  const name = await sleep(1000, 'Presto');
  const type = await sleep(2000, 'Dog');

  // 模拟繁重的计算...
  for (let i = 0; i < 1e9; ++i)
    continue;

  // 'Presto the Dog!'
  return `${name} the ${type}!`;
}
```

在上面的示例中，我们立即等待每个 "thenable" 表达式。 这样做的结果是反复阻止执行，从而又累积了函数的空闲时间。 不考虑 for 循环，两个连续的 `sleep` 调用共同阻止执行至少3秒钟。

对于某些实现，如果 `await `的表达式的结果取决于前面的 `await` 的表达式(说明2， 有先后顺序，译者注)，那就必须这样做。但是，在此示例中，两个`sleep`结果彼此独立。 我们可以使用 `Promise.all` 并发返回结果。

> 说明2: 此行为类似于 promise 链的行为，在 promise 链中，一个`Promise＃then`处理程序的结果将通过管道传递到下一个处理程序。

```js
// ...
async function sayName() {
  // 彼此独立的 promise 让我们可以使用这种优化
  const [ name, type ] = await Promise.all([
    sleep(1000, 'Presto'),
    sleep(2000, 'Dog'),
  ]);

  // 模拟繁重的计算...
  for (let i = 0; i < 1e9; ++i)
    continue;

  // 'Presto the Dog!'
  return `${name} the ${type}!`;
}
```

使用`Promise.all`优化，我们将空闲时间从3秒减少到2秒。虽然我们的优化可以在这里结束，但我们仍然可以进一步优化！

我们不需要立马等待 "thenable"的返回结果。相反，我们可以暂时将它们作为承诺存储在一个变量中。异步任务仍将被调度，但我们将不再被迫阻塞执行。

```js
// ...
async function sayName() {
  // 安排任务优先...
  const pending = Promise.all([
    sleep(1000, 'Presto'),
    sleep(2000, 'Dog'),
  ]);

  // ... 同步进行...
  for (let i = 0; i < 1e9; ++i)
    continue;

  // ... 再`await`
  const [ name, type ] = await pending;

  // 'Presto the Dog!'
  return `${name} the ${type}!`;
}
```

就像这样，我们通过在等待异步任务完成的同时执行同步工作，进一步减少了函数的空闲时间。

作为通用的指导原则，必须尽早安排异步I/O操作，但要尽可能晚地等待。

## 避免混合使用基于回调的API和基于promise的API

尽管它们的语法非常相似，但用作回调函数时，普通函数和 `aysnc` 函数在使用上却大不相同。 普通函数直到返回才停止对执行程序的控制，而`async`函数会立即返回promise。 如果API没有考虑到异步函数返回的 promise ，将出现令人讨厌的bug或者是程序崩溃。

两者的错误处理也有一些细微的差别。 当普通函数引发异常时，通常希望使用`try/catch`块来处理异常。 对于基于回调的API，错误将作为回调中的第一个参数传入。

同时，`async`函数返回的promise会转换为“已拒绝”状态，在该状态下，我们应该在`Promise＃catch`处理程序中处理错误-前提是该错误尚未被内部`try/catch`块捕获。 这种模式的主要问题以下两方面：

1. 我们必须保持对 promise 的调用，以捕获它的拒绝(rejections)。 另外，我们可以预先附加 `Promise＃catch`处理程序。

2. 或者，功能体内必须存在`try/catch`块。

如果我们无法使用上述任何一种方法来处理拒绝，则该异常将不会被捕获。 这个时候，程序的状态将会是异常且不确定的。异常的状态将引起奇怪的意外行为。

当 `async` 函数被拒绝的，并且被用来作为回调，而不是像当作一般promise 来看待（因为 promise 是异步的，不能被当作一般的回调函数，译者注），就会发生这种情况。

在 Node.js v12 之前，这是许多开发人员使用事件API面临的问题。 该API不希望[事件处理](https://nodejs.org/docs/latest/api/events.html)程序成为异步函数。 当异步事件处理程序被拒绝时，缺少`Promise＃catch`处理程序和`try/catch`块通常会导致应用程序状态异常。错误事件并未响应从而触发 未处理的promise，从而使调试更加困难。

为了解决此问题，Node.js 团队为` event emitters`添加了`captureRejections`选项。 当异步事件处理程序被拒绝时， `event emitter` 将捕获未处理的拒绝并将其转发给错误事件。（说明3）

> 说明3: API 将在内部将 `Promise＃catch`处理程序添加到异步函数返回的Promise后。 当 promise 被拒绝时，`Promise＃catch`处理程序将返回带有拒绝值的错误事件。 ↩

```js
import { EventEmitter } from 'events';

// Before Node v12
const uncaught = new EventEmitter();
uncaught
  .on('event', async () => { throw new Error('Oops!'); })
  .on('error', console.error) // This will **not** be invoked.
  .emit('event');

// Node v12+
const captured = new EventEmitter({ captureRejections: true });
captured
  .on('event', async () => { throw new Error('Oops!'); })
  .on('error', console.error) // This will be invoked.
  .emit('event');
```

当与 `async map` 函数混合使用时，诸如`Array＃map`之类的数组迭代方法也可能导致意外结果。 在这种情况下，我们必须提高警惕。

> 注意：以下示例使用类型注释来说明这一点。

```javascript
const stuff = [ 1, 2, 3 ];

// 使用正常的函数
// `Array#map` 运行与期望一致
const numbers: number[] = stuff
  .map(x => x);

// 使用 `async` 函数返回 promises,
// `Array#map` 将会返回一个包含 promise 的数组而不是期望的数字数组
const promises: Promise<number>[] = stuff
  .map(async x => x);
```

## 避免使用`return await`

使用`async` 函数时，我们需要避免写`return await`。 当然，有一个的 [ESLint 规则](https://eslint.org/docs/rules/no-return-await)专门用于规范这个写法。 这是因为`return await`由两个语义上独立的关键字组成：`return `和` await`。

`return`关键字表示函数结束。 它最终确定何时可以“弹出”当前调用堆栈。 对于` async` 函数，这类似于将一个返回值包装在已 resolved 的 promise 中。（因为我们通过接受 await 函数返回的结果，async 中 的 return 和 promise 的 resolve 等同效果，因此可以把 return 看作是 resolved 的包装，译者注）(说明4)

>  说明4: 此行为类似于 `[Promise＃then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#Return_value)`处理程序的行为。

另一方面，`await`关键字发出信号通知异步函数暂停执行，当 promise resolves 的时候才会继续执行。 在此等待期间，“微任务”被安排以保留暂停的执行状态。 promise 返回后，将执行先前安排的“微任务”以恢复 `async` 函数。 这个时候，await关键字将解开已返回的 promise。

因此，将`return`和`await`结合使用（通常）是多余的结果，即多余地包装和拆开已解决的promise。 首先，`await`关键字将解开解析的值，然后将其立即由`return`关键字再次包装。

此外，使用`await`关键字可以避免 `async` 函数快速"弹出"当前调用堆栈。 相反，`async` 函数将保持暂停状态（在最后一条语句中），直到`await`关键字允许该功能恢复。 然后，剩下的唯一语句就是 `return`。

为了尽早将 `async` 函数从当前调用堆栈中"弹出"，我们只需直接返回未处理的 promise 即可。 在此过程中，我们还解决了重复包装和解开 promise 的问题。

 *一般来说，异步函数中的最终promise应该直接返回。*

> 免责声明：尽管此优化避免了前面提到的问题，但是由于返回的promise 一旦被拒绝，就不再出现在错误堆栈跟踪中，这也使调试更加困难。 `try/catch`块也可能特别棘手。

```js
import fetch from 'node-fetch';
import { promises as fs } from 'fs';

/**
 * This function saves the JSON received from a REST API
 * to the hard drive.
 * @param {string} - File name for the destination
 */
async function saveJSON(output) {
  const response = await fetch('https://api.github.com/');
  const json = await response.json();
  const text = JSON.stringify(json);

  //  `await` 关键字在这里可能没有必要.
  return await fs.writeFile(output, text);
}

async function saveJSON(output) {
  // ...
  // 这实际上犯了和前一个例子一样的错误，只是增加了一点中间过程。
  const result = await fs.writeFile(output, text);
  return result;
}

async function saveJSON(output) {
  // ...
  // 这是 "转发" promise 的最优化方式。
  return fs.writeFile(output, text);
}
```

## 更喜欢简单的promise

对于大多数人来说，`async/await`语法可以说比 写链式 promise 更直观，更优雅。 这导致我们许多人默认情况下编写异步函数，即使一个简单的promise（没有 `async` 包装器）就足够了。 这就是问题的核心：在大多数情况下，异步包装器引入的开销超出了它们的价值。

有时，我们可能会偶然发现一个async函数，该函数仅用于包装单个promise。 至少可以这样说，这是非常浪费的，因为在内部，异步函数已经自行分配了两个promise：[一个 “隐式”promise和一个“一次性”promise](https://v8.dev/blog/fast-async)-两者都需要它们自己的初始化和堆分配才能工作。

举例来说，async函数的性能开销不仅包括 promise（在函数体内部），而且还包括初始化异步函数（作为外部"root" promise）的开销。 一路都有 promises

如果 `async` 函数仅用于包装一个或两个promise，那么最好不要使用 `async` 包装器。

```js
import { promises as fs } from 'fs';

// 这是一个效率不高的原生 readFile 的封装器。
async function readFile(filename) {
  const contents = await fs.readFile(filename, { encoding: 'utf8' });
  return contents;
}

// 这种优化避免了`async`包装器的开销。.
function readFile(filename) {
  return fs.readFile(filename, { encoding: 'utf8' });
}
```

还有，如果根本不需要“暂停” `async` 函数，那么就不需要使函数 `async` 化。

```js
// All of these are semantically equivalent.
const p1 = async () => 'Presto';
const p2 = () => Promise.resolve('Presto');
const p3 = () => new Promise(resolve => resolve('Presto'));

// But since they are all immediately resolved,
// there is no need for promises.
const p4 = () => 'Presto';
```

## 总结

promises 和 `async` 函数彻底改变了异步 JavaScript。 错误优先回调的时代已经一去不复返了，这时我们可以称之为"旧版API"。

但是，尽管 async 语法优美，但我们仅在必要时才使用它们。 无论如何，它们不是"免费"的。 我们不能在各处使用它们。

可读性的提高伴随着一些代价，如果我们不小心的话，这些代价可能会困扰我们。如果不检查 promise 带来的代价， 其中最主要的代价是内存的使用量。

因此，说来也怪，想要充分利用异步JavaScript，我们必须尽可能少地使用 promise 和 `async` 函数。

