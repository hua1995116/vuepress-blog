# 尤大亲自评测 Vue3 和 Svelte(19 个组件后 Vue 更好!)

近日尤大亲自创建了一个仓库用来对 Svelte 和 Vue3 组件进行了评测。这其实对我来说非常的感兴趣，因为我最近在业务项目中采用了 Svelte 进行了开发。

![image-20210711185119613](https://s3.mdedit.online/blog/image-20210711185119613.png)

那么到底结果到底是如何呢？(期待的眼神，以为尤大要写 Svelte 代码来进行评测了。

Vue 大家都很熟悉了，如果你不知道 Svelte 是啥？可以看[后起之秀前端框架 Svelte 从入门到原理](https://mp.weixin.qq.com/s/FCy903Rh6837MBDYLwYYIg)。

大体介绍一下，Svelte 是一个 No Runtime —— 无运行时代码 的框架。

下面是`Jacek Schae`大神的统计，使用市面上主流的框架，来编写同样的 Realword 应用的体积：

<img src="https://s3.mdedit.online/blog/image-20210711222239287.png" style="width: 500px">

下面就请看详细的研究步骤，如果你对研究步骤不感兴趣，可以直接跳到最后看结论。

## 研究的步骤

为了公平性，尤大选择了 `todomvc` 来进行构建比较，然后列举了一系列的步骤方案。

1. 这两个框架都实现了一个简单的符合规范、功能相同的`todomvc` 组件。

   - Vue: [todomvc.vue](https://github.com/yyx990803/vue-svelte-size-analysis/blob/master/todomvc.vue) （使用了`<script setup>` 语法）
   - Svelte: [todomvc.svelte](https://github.com/yyx990803/vue-svelte-size-analysis/blob/master/todomvc.svelte) (基于[官方的实现](https://github.com/sveltejs/svelte-todomvc/blob/master/src/TodoMVC.svelte), 为了公平去除了 uuid 方法，害，失望了，原来尤大么有亲自写组件)

2. 组件使用各自框架的在线 SFC 编译器进行单独编译

   - Vue: [sfc.vuejs.org](https://sfc.vuejs.org/) @3.1.4 -> `todomvc.vue.js`

   - Svelte: [svelte.dev/repl](https://svelte.dev/repl) @3.38.3 -> `todomvc.svelte.js`

3. 编译文件使用 [Terser REPL](https://try.terser.org/) 压缩，然后删除 ES imports 和 exports。 这是因为在一个 `bundle` 的应用程序中，这些 `imports/exports`不需要或在多个组件之间共享。（可以理解为类似第三方代码，不会影响组件内部实现的大小）

   - Vue: `todomvc.vue.min.js`

   - Svelte: `todomvc.svelte.min.js`

4. 然后把文件使用`gzip`和`brotli`（**Brotli**是一个[开源](https://zh.wikipedia.org/wiki/开源软件)[数据压缩](https://zh.wikipedia.org/wiki/数据压缩)[程序库](https://zh.wikipedia.org/wiki/程序库)， 类似于 `gzip` ）压缩

   - Vue: `todomvc.vue.min.js.gz` / `todomvc.vue.min.js.brotli`
   - Svelte: `todomvc.svelte.min.js.gz` / `todomvc.svelte.min.js.brotli`

5. 另外，在 SSR 的环境下，Svelte 需要在 "hydratable" 模式下编译其组件，这会引入额外的代码生成。 在编译 Svelte 的时候使用选项 `hydratable: true` 来开启 SSR 并重复 2-4 的步骤。

   Vue 在 SSR 环境下生成的代码是完全相同的，但是引入了一些额外的 `hydration-specific` 运行时代码(~0.89kb min + brotli).

6. 对于每个框架，默认使用 `Vite` 来创建和打包构建（Svelte 使用 `hyderable: false`）。 每个应用程序同时设置 SSR 的模式再构建一次。

默认 `Vite` 打包产生一个 vendor chunk（= 框架运行时代码）和一个 index chunk（= 组件代码）。

|                                   | Vue     | Vue (SSR) | Svelte           | Svelte (SSR)     |
| --------------------------------- | ------- | --------- | ---------------- | ---------------- |
| Source                            | 3.93kb  | -         | 3.31kb           | -                |
| Compiled w/o imports (min)        | 2.73kb  | -         | 5.01kb (183.52%) | 6.59kb (241.39%) |
| Compiled w/o imports (min+gz)     | 1.25kb  | -         | 2.13kb (170.40%) | 2.68kb (214.40%) |
| Compiled w/o imports (min+brotli) | 1.10kb  | -         | 1.88kb (170.91%) | 2.33kb (211.82%) |
| Vite component chunk (min+brotli) | 1.13kb  | -         | 1.95kb (172.26%) | 2.41kb (213.27%) |
| Vite vendor chunk (min+brotli)    | 16.89kb | 17.78kb   | 1.85kb           | 2.13kb           |

> 注意： w/o 的意思为 without ，"去除"的意思

<img src="https://github.com/yyx990803/vue-svelte-size-analysis/raw/master/chart.png" width="600px">

## 分析

在客户端模式下，从 Vite vendor chunk (min+brotli) 这一栏分析 。 Svelte App 导入 1.85kb min+brotli 框架代码，比 Vue 轻 15.04kb。这似乎看起来非常的强悍，但是这是因为框架运行时的差异。(Svelte 没有运行时，Vue 有运行时)

再来看看组件代码，Svelte 的 min + compressed 输出大小是 Vue 的~1.7 倍。在这种情况下，单个组件会导致 0.78kb 的大小差异。在 SSR 的情况下，这一比例进一步上升到~2.1 倍，其中单个组分导致 1.23kb 大小的差异。

`Todomvc` 非常具有代表性，代表大多数用户在应用场景中构建使用的组件。 我们可以合理地假设在现实场景中会发现类似的大小差异。 也就是说，在理论上，如果一个应用程序包含超过 15.04 / 0.78〜= 19 个 Todomvc 大小的组件，则 Svelte 应用程序将最终比 Vue 应用程序体积更大。

在 SSR 场景中，这个阈值会更低。 在 SSR 模式下，虽然框架差异为 15.65KB，但是 Compnent Count 阈值下降到 15.65 / 1.23〜= 13！

显然在真实世界应用程序中，有许多其他因素：将从框架中导入更多功能，并将使用第三方库。 大小曲线将受到项目中纯组件代码的百分比的影响。 但是，保守估计 `应用 APP` 如果比 19 个组件 这个阈值（或者在 SSR 模式下的 13 个 ）越大，Svelte 的体积优势就越少。

## 结论

在仓库的`README`中尤大给出了两个结论，我就给它移到了最后。

- Svelte 单组件在普通模式下比 Vue3 单组件约大 70% ，在 SSR 模式下大 110% （公众号作者秋风注：其实这里尤大说的有点问题，这个 70%指的是当前 `todomvc` 组件的大小对比，并不代表着所有 Svelte 组件 比 vue 3 组件 大 70%， 换句话说如果一个 100k 大小的 Vue 组件，Svelte 组件可能就只有 101k，而不是 170k !）
- 对于项目来说，当编写的组件大于 19 个组件（SSR 模式为 13 个组件）Svelte 的优势与 Vue3 相比就不存在了。

## 总的来说

本研究并的目的不是来说哪种框架更好 —— 它关注的是分析不同框架的策略对体积大小的影响。

从数据中可以看出，两个框架在 bundle 大小方面具有不同的优势 —— 取决于您的使用情况。 Svelte 仍然很棒，适用于一次性组件（例如，作为自定义元素包装），但它在大规模 APP 中在体积大小方面实际上是它的缺点，特别是 SSR。

在更广泛的意义上，本研究旨在展示框架如何在`compile-time 编译时`和`runtime spectrum 运行时`找到一个平衡点：Vue 在源码上使用了一定的 `compile-time 编译时` 优化，但选择较重的 `compile-time` 返回较小的生成代码。 Svelte 选择最小的运行时，但具有较重生成的代码的成本。 Svelte 可以进一步改进其代码生成来降低代码输出吗？ Vue 可以进一步改善`tree-shaking`，使基线(运行时框架)变小吗？ 另外一点框架可以找到更好的平衡点吗？ 对以上所有的问题的答案回答可能是肯定的 —— 但现在我们需要明确的是"框架大小"是比单单比较 Hello World 应用程序的大小的更加细致的话题，这项研究就是为了证明这一点。

## 个人意见

以下为公众号作者的个人意见，并非尤大调研中的观点。

其实尤大总体来说就是想要凸显出在框架的对比中，单单使用 `Jacek Schae`大神 统计的 那个 RealWord 应用程序来说是有些不公平的，应该需要更加细致的对比。其实对于 Svelte 这个包大小这个问题，其实很早之前在 Svelte Github 中也对 React 和 Svelte 进行了广泛的讨论。

![Inflection Point](https://raw.githubusercontent.com/halfnelson/svelte-it-will-scale/master/img/Source%20size%20vs%20Bundle%20size.svg)

Svelte 确实有一个阈值会使得它在一定程度后让体积大小没有了优势，但是在一般情况下，只要不是特别复杂的中后台管理应用，Svelte 应当会比其他框架体积小。

特别是在一些 H5 游戏中，如果你想要获得 React/Vue 数据驱动的方式编写应用，但是你又不想要引入他们这么大的运行时，确实来说是一个非常不错的方案。最近在开发一个基于 Three.js 的移动端网页，有一个初步的估计大约比使用 React 减少 30 - 50% 的体积，具体的数值因为还没迁移完无法给出完整的数据。还有一点，非运行时的框架，对于首屏的渲染也是有一个极大的帮助，你可以将首屏组件进行拆分，非运行时的首屏组件其实是非常小的，这对移动端来说非常的友好，因为毕竟使用 SSR 对应服务端还是有一定的压力要求的。

以上为个人看完尤大的分析比较后的一点愚见~ 如果不足之处请多多指出。

## 调研原文

https://github.com/yyx990803/vue-svelte-size-analysis
