# 听说你还不知道Promise的allSettled()和all()的区别？


> 译文来自 https://dev.to/viclafouch/promise-allsettled-vs-promise-all-in-javascript-4mle
>
> 原作者 Victor de la Fouchardière
>
> 译者: 蓝色的秋风(github/hua1995116)

Hello! 🧑‍🌾

从 ES2015 起, promises 的出现，让我们简化了异步操作。（所以 promise 越来越流行，掌握它的相关 API 变得至关重要）。

让我们来看看以下两个 Promise 方式及他们差异：

- [Promise.allSettled(可迭代)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

- [Promise.all(可迭代)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

他们两个都传入可 `迭代对象`，并返回一个已完成的 Promises 的`数组`。

❓那么，**它们之间有什么区别呢？**

## Promise.all()🧠

`Promise.all()`方法将一组可迭代的 Promises 作为输入，并返回一个 Promise ，该 Promise resolve 的结果为刚才那组 输入 promises 的返回结果。

![Promise all](https://res.cloudinary.com/practicaldev/image/fetch/s--A7rnVVpd--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/loq7cd72u055wl92yq2u.png)

正如你看到的那样，我们将数组传递给 `Promise.all`。 当三个 promise 都完成时，`Promise.all` 就完成了，并且输出被打印了。

现在，让我们看看其中一个 promise 失败了的情况，如果这个 promise 失败了，又会 输出什么呢？ 🛑

![Promise all failed](https://res.cloudinary.com/practicaldev/image/fetch/s--MEAe2zoD--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/gcpmjldpgbfc8xgqgh10.png)

`如果其中一个 promise 失败了`，则 `Promise.all` 整体将会失败。 例如，我们传递2个 promise, 一个完成的 promise 和 一个 失败的promise，那么 `Promise.all ` 将立即失败。

## Promise.allSettled()📪

从 ES2020 开始，你可以使用 `Promise.allSettled`。当所有的 promises 都已经结束无论是完成状态或者是失败状态，它都会返回一个 promise，这个 promise 将会包含一个关于描述每个 promise 状态结果的对象数组。

对于每个结果对象，都有一个`状态`字符串：

- `fulfilled(完成)` ✅

- `rejected(失败)` ❌

返回值（或原因）表现每个 promise 的完成（或失败）。

仔细观察结果数组的以下属性（`status-状态`，`value-值`，`reason-原因`）。

![allSettled](https://res.cloudinary.com/practicaldev/image/fetch/s--s2PC5oqi--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/brvijnemnpmm9qvauhvp.png)

## 区别👬

- `Promise.all` 将在 Promises 数组中的其中一个 Promises 失败后立即失败。

- `Promise.allSettled`将永远不会失败，一旦数组中的所有 Promises 被完成或失败，它就会完成。

## 浏览器支持 🚸

下面列出了`Promise.allSettled()`和`promise.all()`方法浏览器的支持情况:

`Promise.allSettled()`

![image-20200819004559123](https://s3.qiufengh.com/blog/image-20200819004559123.png)

`promise.all()`

![image-20200819004619627](https://s3.qiufengh.com/blog/image-20200819004619627.png)