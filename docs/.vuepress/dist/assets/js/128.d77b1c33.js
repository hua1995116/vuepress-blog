(window.webpackJsonp=window.webpackJsonp||[]).push([[128],{515:function(e,v,t){"use strict";t.r(v);var _=t(44),r=Object(_.a)({},(function(){var e=this,v=e.$createElement,t=e._self._c||v;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"尤大亲自评测-vue3-和-svelte-19个组件后vue更好"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#尤大亲自评测-vue3-和-svelte-19个组件后vue更好"}},[e._v("#")]),e._v(" 尤大亲自评测 Vue3 和 Svelte(19个组件后Vue更好!)")]),e._v(" "),t("p",[e._v("近日尤大亲自创建了一个仓库用来对 Svelte 和 Vue3 组件进行了评测。这其实对我来说非常的感兴趣，因为我最近在业务项目中采用了 Svelte 进行了开发。")]),e._v(" "),t("p",[t("img",{attrs:{src:"https://s3.qiufengh.com/blog/image-20210711185119613.png",alt:"image-20210711185119613"}})]),e._v(" "),t("p",[e._v("那么到底结果到底是如何呢？(期待的眼神，以为尤大要写 Svelte 代码来进行评测了。")]),e._v(" "),t("p",[e._v("Vue 大家都很熟悉了，如果你不知道 Svelte 是啥？可以看"),t("a",{attrs:{href:"https://mp.weixin.qq.com/s/FCy903Rh6837MBDYLwYYIg",target:"_blank",rel:"noopener noreferrer"}},[e._v("后起之秀前端框架 Svelte 从入门到原理"),t("OutboundLink")],1),e._v("。")]),e._v(" "),t("p",[e._v("大体介绍一下，Svelte 是一个  No Runtime —— 无运行时代码 的框架。")]),e._v(" "),t("p",[e._v("下面是"),t("code",[e._v("Jacek Schae")]),e._v("大神的统计，使用市面上主流的框架，来编写同样的 Realword 应用的体积：")]),e._v(" "),t("img",{staticStyle:{width:"500px"},attrs:{src:"https://s3.qiufengh.com/blog/image-20210711222239287.png"}}),e._v(" "),t("p",[e._v("下面就请看详细的研究步骤，如果你对研究步骤不感兴趣，可以直接跳到最后看结论。")]),e._v(" "),t("h2",{attrs:{id:"研究的步骤"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#研究的步骤"}},[e._v("#")]),e._v(" 研究的步骤")]),e._v(" "),t("p",[e._v("为了公平性，尤大选择了 "),t("code",[e._v("todomvc")]),e._v(" 来进行构建比较，然后列举了一系列的步骤方案。")]),e._v(" "),t("ol",[t("li",[t("p",[e._v("这两个框架都实现了一个简单的符合规范、功能相同的"),t("code",[e._v("todomvc")]),e._v(" 组件。")]),e._v(" "),t("ul",[t("li",[e._v("Vue: "),t("a",{attrs:{href:"https://github.com/yyx990803/vue-svelte-size-analysis/blob/master/todomvc.vue",target:"_blank",rel:"noopener noreferrer"}},[e._v("todomvc.vue"),t("OutboundLink")],1),e._v(" （使用了"),t("code",[e._v("<script setup>")]),e._v(" 语法）")]),e._v(" "),t("li",[e._v("Svelte: "),t("a",{attrs:{href:"https://github.com/yyx990803/vue-svelte-size-analysis/blob/master/todomvc.svelte",target:"_blank",rel:"noopener noreferrer"}},[e._v("todomvc.svelte"),t("OutboundLink")],1),e._v(" (基于"),t("a",{attrs:{href:"https://github.com/sveltejs/svelte-todomvc/blob/master/src/TodoMVC.svelte",target:"_blank",rel:"noopener noreferrer"}},[e._v("官方的实现"),t("OutboundLink")],1),e._v(", 为了公平去除了 uuid 方法，害，失望了，原来尤大么有亲自写组件)")])])]),e._v(" "),t("li",[t("p",[e._v("组件使用各自框架的在线 SFC 编译器进行单独编译")]),e._v(" "),t("ul",[t("li",[t("p",[e._v("Vue: "),t("a",{attrs:{href:"https://sfc.vuejs.org/",target:"_blank",rel:"noopener noreferrer"}},[e._v("sfc.vuejs.org"),t("OutboundLink")],1),e._v(" @3.1.4 -> "),t("code",[e._v("todomvc.vue.js")])])]),e._v(" "),t("li",[t("p",[e._v("Svelte: "),t("a",{attrs:{href:"https://svelte.dev/repl",target:"_blank",rel:"noopener noreferrer"}},[e._v("svelte.dev/repl"),t("OutboundLink")],1),e._v(" @3.38.3 -> "),t("code",[e._v("todomvc.svelte.js")])])])])]),e._v(" "),t("li",[t("p",[e._v("编译文件使用 "),t("a",{attrs:{href:"https://try.terser.org/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Terser REPL"),t("OutboundLink")],1),e._v(" 压缩，然后删除 ES imports 和 exports。 这是因为在一个 "),t("code",[e._v("bundle")]),e._v(" 的应用程序中，这些 "),t("code",[e._v("imports/exports")]),e._v("不需要或在多个组件之间共享。（可以理解为类似第三方代码，不会影响组件内部实现的大小）")]),e._v(" "),t("ul",[t("li",[t("p",[e._v("Vue: "),t("code",[e._v("todomvc.vue.min.js")])])]),e._v(" "),t("li",[t("p",[e._v("Svelte: "),t("code",[e._v("todomvc.svelte.min.js")])])])])]),e._v(" "),t("li",[t("p",[e._v("然后把文件使用"),t("code",[e._v("gzip")]),e._v("和"),t("code",[e._v("brotli")]),e._v("（"),t("strong",[e._v("Brotli")]),e._v("是一个"),t("a",{attrs:{href:"https://zh.wikipedia.org/wiki/%E5%BC%80%E6%BA%90%E8%BD%AF%E4%BB%B6",target:"_blank",rel:"noopener noreferrer"}},[e._v("开源"),t("OutboundLink")],1),t("a",{attrs:{href:"https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E5%8E%8B%E7%BC%A9",target:"_blank",rel:"noopener noreferrer"}},[e._v("数据压缩"),t("OutboundLink")],1),t("a",{attrs:{href:"https://zh.wikipedia.org/wiki/%E7%A8%8B%E5%BA%8F%E5%BA%93",target:"_blank",rel:"noopener noreferrer"}},[e._v("程序库"),t("OutboundLink")],1),e._v("， 类似于 "),t("code",[e._v("gzip")]),e._v(" ）压缩")]),e._v(" "),t("ul",[t("li",[e._v("Vue: "),t("code",[e._v("todomvc.vue.min.js.gz")]),e._v(" / "),t("code",[e._v("todomvc.vue.min.js.brotli")])]),e._v(" "),t("li",[e._v("Svelte: "),t("code",[e._v("todomvc.svelte.min.js.gz")]),e._v(" / "),t("code",[e._v("todomvc.svelte.min.js.brotli")])])])]),e._v(" "),t("li",[t("p",[e._v('另外，在 SSR 的环境下，Svelte 需要在 "hydratable" 模式下编译其组件，这会引入额外的代码生成。 在编译 Svelte 的时候使用选项 '),t("code",[e._v("hydratable: true")]),e._v("  来开启 SSR 并重复 2-4 的步骤。")]),e._v(" "),t("p",[e._v("Vue在 SSR 环境下生成的代码是完全相同的，但是引入了一些额外的 "),t("code",[e._v("hydration-specific")]),e._v(" 运行时代码(~0.89kb min + brotli).")])]),e._v(" "),t("li",[t("p",[e._v("对于每个框架，默认使用 "),t("code",[e._v("Vite")]),e._v(" 来创建和打包构建（Svelte 使用 "),t("code",[e._v("hyderable: false")]),e._v("）。 每个应用程序同时设置SSR的模式再构建一次。")])])]),e._v(" "),t("p",[e._v("默认 "),t("code",[e._v("Vite")]),e._v(" 打包产生一个  vendor chunk（= 框架运行时代码）和一个 index chunk（= 组件代码）。")]),e._v(" "),t("table",[t("thead",[t("tr",[t("th"),e._v(" "),t("th",[e._v("Vue")]),e._v(" "),t("th",[e._v("Vue (SSR)")]),e._v(" "),t("th",[e._v("Svelte")]),e._v(" "),t("th",[e._v("Svelte (SSR)")])])]),e._v(" "),t("tbody",[t("tr",[t("td",[e._v("Source")]),e._v(" "),t("td",[e._v("3.93kb")]),e._v(" "),t("td",[e._v("-")]),e._v(" "),t("td",[e._v("3.31kb")]),e._v(" "),t("td",[e._v("-")])]),e._v(" "),t("tr",[t("td",[e._v("Compiled w/o imports (min)")]),e._v(" "),t("td",[e._v("2.73kb")]),e._v(" "),t("td",[e._v("-")]),e._v(" "),t("td",[e._v("5.01kb (183.52%)")]),e._v(" "),t("td",[e._v("6.59kb (241.39%)")])]),e._v(" "),t("tr",[t("td",[e._v("Compiled w/o imports (min+gz)")]),e._v(" "),t("td",[e._v("1.25kb")]),e._v(" "),t("td",[e._v("-")]),e._v(" "),t("td",[e._v("2.13kb (170.40%)")]),e._v(" "),t("td",[e._v("2.68kb (214.40%)")])]),e._v(" "),t("tr",[t("td",[e._v("Compiled w/o imports (min+brotli)")]),e._v(" "),t("td",[e._v("1.10kb")]),e._v(" "),t("td",[e._v("-")]),e._v(" "),t("td",[e._v("1.88kb (170.91%)")]),e._v(" "),t("td",[e._v("2.33kb (211.82%)")])]),e._v(" "),t("tr",[t("td",[e._v("Vite component chunk (min+brotli)")]),e._v(" "),t("td",[e._v("1.13kb")]),e._v(" "),t("td",[e._v("-")]),e._v(" "),t("td",[e._v("1.95kb (172.26%)")]),e._v(" "),t("td",[e._v("2.41kb (213.27%)")])]),e._v(" "),t("tr",[t("td",[e._v("Vite vendor chunk (min+brotli)")]),e._v(" "),t("td",[e._v("16.89kb")]),e._v(" "),t("td",[e._v("17.78kb")]),e._v(" "),t("td",[e._v("1.85kb")]),e._v(" "),t("td",[e._v("2.13kb")])])])]),e._v(" "),t("blockquote",[t("p",[e._v('注意： w/o 的意思为 without ，"去除"的意思')])]),e._v(" "),t("img",{attrs:{src:"https://github.com/yyx990803/vue-svelte-size-analysis/raw/master/chart.png",width:"600px"}}),e._v(" "),t("h2",{attrs:{id:"分析"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#分析"}},[e._v("#")]),e._v(" 分析")]),e._v(" "),t("p",[e._v("在客户端模式下，从 Vite vendor chunk (min+brotli) 这一栏分析 。 Svelte App 导入1.85kb min+brotli 框架代码，比 Vue 轻15.04kb。这似乎看起来非常的强悍，但是这是因为框架运行时的差异。(Svelte 没有运行时，Vue有运行时)")]),e._v(" "),t("p",[e._v("再来看看组件代码，Svelte 的  min + compressed  输出大小是Vue的~1.7倍。在这种情况下，单个组件会导致0.78kb的大小差异。在 SSR 的情况下，这一比例进一步上升到~2.1倍，其中单个组分导致 1.23kb 大小的差异。")]),e._v(" "),t("p",[t("code",[e._v("Todomvc")]),e._v(" 非常具有代表性，代表大多数用户在应用场景中构建使用的组件。 我们可以合理地假设在现实场景中会发现类似的大小差异。 也就是说，在理论上，如果一个应用程序包含超过15.04 / 0.78〜= 19个 Todomvc 大小的组件，则 Svelte 应用程序将最终比Vue应用程序体积更大。")]),e._v(" "),t("p",[e._v("在 SSR 场景中，这个阈值会更低。 在 SSR 模式下，虽然框架差异为15.65KB，但是 Compnent Count 阈值下降到 15.65 / 1.23〜= 13！")]),e._v(" "),t("p",[e._v("显然在真实世界应用程序中，有许多其他因素：将从框架中导入更多功能，并将使用第三方库。 大小曲线将受到项目中纯组件代码的百分比的影响。 但是，保守估计 "),t("code",[e._v("应用 APP")]),e._v(" 如果比 19个组件 这个阈值（或者在SSR模式下的13个 ）越大，Svelte 的体积优势就越少。")]),e._v(" "),t("h2",{attrs:{id:"结论"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#结论"}},[e._v("#")]),e._v(" 结论")]),e._v(" "),t("p",[e._v("在仓库的"),t("code",[e._v("README")]),e._v("中尤大给出了两个结论，我就给它移到了最后。")]),e._v(" "),t("ul",[t("li",[e._v("Svelte 单组件在普通模式下比 Vue3 单组件约大70% ，在 SSR 模式下大110% （公众号作者秋风注：其实这里尤大说的有点问题，这个70%指的是当前 "),t("code",[e._v("todomvc")]),e._v(" 组件的大小对比，并不代表着所有 Svelte 组件 比 vue 3 组件 大 70%， 换句话说如果一个 100k 大小的 Vue 组件，Svelte组件可能就只有 101k，而不是170k !）")]),e._v(" "),t("li",[e._v("对于项目来说，当编写的组件大于19个组件（SSR模式为 13个组件）Svelte 的优势与 Vue3 相比就不存在了。")])]),e._v(" "),t("h2",{attrs:{id:"总的来说"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#总的来说"}},[e._v("#")]),e._v(" 总的来说")]),e._v(" "),t("p",[e._v("本研究并的目的不是来说哪种框架更好 —— 它关注的是分析不同框架的策略对体积大小的影响。")]),e._v(" "),t("p",[e._v("从数据中可以看出，两个框架在 bundle 大小方面具有不同的优势 —— 取决于您的使用情况。 Svelte 仍然很棒，适用于一次性组件（例如，作为自定义元素包装），但它在大规模 APP 中在体积大小方面实际上是它的缺点，特别是SSR。")]),e._v(" "),t("p",[e._v("在更广泛的意义上，本研究旨在展示框架如何在"),t("code",[e._v("compile-time 编译时")]),e._v("和"),t("code",[e._v("runtime spectrum 运行时")]),e._v("找到一个平衡点：Vue 在源码上使用了一定的 "),t("code",[e._v("compile-time 编译时")]),e._v(" 优化，但选择较重的 "),t("code",[e._v("compile-time")]),e._v(" 返回较小的生成代码。 Svelte选择最小的运行时，但具有较重生成的代码的成本。 Svelte 可以进一步改进其代码生成来降低代码输出吗？ Vue可以进一步改善"),t("code",[e._v("tree-shaking")]),e._v('，使基线(运行时框架)变小吗？ 另外一点框架可以找到更好的平衡点吗？ 对以上所有的问题的答案回答可能是肯定的 —— 但现在我们需要明确的是"框架大小"是比单单比较 Hello World 应用程序的大小的更加细致的话题，这项研究就是为了证明这一点。')]),e._v(" "),t("h2",{attrs:{id:"个人意见"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#个人意见"}},[e._v("#")]),e._v(" 个人意见")]),e._v(" "),t("p",[e._v("以下为公众号作者的个人意见，并非尤大调研中的观点。")]),e._v(" "),t("p",[e._v("其实尤大总体来说就是想要凸显出在框架的对比中，单单使用 "),t("code",[e._v("Jacek Schae")]),e._v("大神 统计的 那个 RealWord 应用程序来说是有些不公平的，应该需要更加细致的对比。其实对于 Svelte 这个包大小这个问题，其实很早之前在 Svelte  Github 中也对 React 和 Svelte 进行了广泛的讨论。")]),e._v(" "),t("p",[t("img",{attrs:{src:"https://raw.githubusercontent.com/halfnelson/svelte-it-will-scale/master/img/Source%20size%20vs%20Bundle%20size.svg",alt:"Inflection Point"}})]),e._v(" "),t("p",[e._v("Svelte 确实有一个阈值会使得它在一定程度后让体积大小没有了优势，但是在一般情况下，只要不是特别复杂的中后台管理应用，Svelte 应当会比其他框架体积小。")]),e._v(" "),t("p",[e._v("特别是在一些 H5 游戏中，如果你想要获得 React/Vue 数据驱动的方式编写应用，但是你又不想要引入他们这么大的运行时，确实来说是一个非常不错的方案。最近在开发一个基于 Three.js 的移动端网页，有一个初步的估计大约比使用 React 减少 30 - 50% 的体积，具体的数值因为还没迁移完无法给出完整的数据。还有一点，非运行时的框架，对于首屏的渲染也是有一个极大的帮助，你可以将首屏组件进行拆分，非运行时的首屏组件其实是非常小的，这对移动端来说非常的友好，因为毕竟使用 SSR 对应服务端还是有一定的压力要求的。")]),e._v(" "),t("p",[e._v("以上为个人看完尤大的分析比较后的一点愚见~ 如果不足之处请多多指出。")]),e._v(" "),t("h2",{attrs:{id:"调研原文"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#调研原文"}},[e._v("#")]),e._v(" 调研原文")]),e._v(" "),t("p",[e._v("https://github.com/yyx990803/vue-svelte-size-analysis")])])}),[],!1,null,null,null);v.default=r.exports}}]);