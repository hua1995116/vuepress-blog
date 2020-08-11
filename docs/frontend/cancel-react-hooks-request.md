# React Hooks中这样写HTTP请求可以避免内存泄漏

> 译文来自 https://dev.to/somedood/best-practices-for-es2017-asynchronous-functions-async-await-39ji
> 
> 原作者 Victor de la Fouchardière
> 
> 译者: 蓝色的秋风(github/hua1995116)

大家好 ！ 👋

今天，让我们看一下在 React Hooks 中使用 `fetch` 和`Abort Controller`取消Web请求从而来避免内存泄露！ 🤗

当我们用 Fetch 来管理数据时，有时我们想取消请求（例如，当我们离开当前页面时，当我们关闭模态框，...）。

在👇下面的示例中，我们要在切换路由的时候获取并展示数据。 但是，我们在获取数据完毕之前就离开了路由/页面。

![7p2coedr8hhtdltuzxu1](https://s3.qiufengh.com/blog/7p2coedr8hhtdltuzxu1.gif)

![4uoij0o2qmdlppeykeln](https://s3.qiufengh.com/blog/4uoij0o2qmdlppeykeln.png)

我们刚刚看到了一个**内存泄漏**!让我们看看为什么会出现这个错误，以及它的具体含义。

**❓为什么有内存泄漏？**：我们有一个执行异步`fetch(url)`任务的组件，然后更新该组件的状态来显示元素，**但是**我们在请求完成之前就卸载(unmounted)了该组件。 由于已卸载组件的状态（例如 `setUsers`，`setState`）被更新, 所以造成了此次**内存泄露**。

## 🚀让我们使用新的 AbortController API！

**Abort Controller** 允许您订阅一个或多个Web请求，并具有取消请求的能力。 🔥

![fvipu2xkelip28hcfoqp](https://s3.qiufengh.com/blog/fvipu2xkelip28hcfoqp.png)

现在，我们可以访问`controller.signal`。

> “ 具有 `read-only`属性的 `AbortController`接口返回一个`AbortSignal` (https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) 对象实例，该实例可用于根据需要与DOM请求通信/中止它。”   来自MDN（https://developer.mozilla.org/en-US/docs/Web/API/AbortController）

让我们看看如何使用它💪

![vlvi82bo5lk2nopqzn8z](https://s3.qiufengh.com/blog/vlvi82bo5lk2nopqzn8z.png)

最后，如果我们想取消当前请求，只需调用`abort()`。 另外，你可以获取`controller.signal.aborted`，它是一个只读属性，它返回一个[`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/API/Boolean)表示与DOM通讯的信号是(`true`)否(`false`)已被放弃。

![yswm5mktqv16v0tiio9e](https://s3.qiufengh.com/blog/yswm5mktqv16v0tiio9e.png)

> ❗️注意：调用`abort()`时，`fetch()` promise 会以名为AbortError 的 DOMException reject。

是的，你刚刚学习了如何取消Web请求！ 👏

## 🤩让我们用React Hooks做到这一点！

❌**改造之前**

下面是一个组件示例，它请求数据并展示它们。

![466wuql2ru1fgkrc2snx](https://s3.qiufengh.com/blog/466wuql2ru1fgkrc2snx.jpeg)

如果我们离开页面的速度太快而导致请求未完成：**MEMORY LEAK**

![daavdtgn3tvfeybcf3rq](https://s3.qiufengh.com/blog/daavdtgn3tvfeybcf3rq.png)

✅ **改造之后**

我们使用 `useEffect` 来订阅我们的 `fetch` 请求来避免内存泄漏。 当组件卸载(unmounted)时，我们使用`useEffect`的清理方法来调用`abort()`。

![zsr8g1ecnburui4rkje9](https://s3.qiufengh.com/blog/zsr8g1ecnburui4rkje9.png)

现在，不再有内存泄漏！ 😍

![wqa6uud2tnz90okxiy1e](https://s3.qiufengh.com/blog/wqa6uud2tnz90okxiy1e.gif)

你可以在 https://abort-with-react-hooks.vercel.app/ 上查看此演示。

可以在 https://github.com/hua1995116/node-demo/react-abort 查看源码

干杯 🍻 🍻 🍻

