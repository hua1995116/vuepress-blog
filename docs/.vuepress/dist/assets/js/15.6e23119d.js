(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{404:function(v,t,e){"use strict";e.r(t);var _=e(44),o=Object(_.a)({},(function(){var v=this,t=v.$createElement,e=v._self._c||t;return e("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[e("h1",{attrs:{id:"急速-debug-实战一-浏览器-基础篇"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#急速-debug-实战一-浏览器-基础篇"}},[v._v("#")]),v._v(" 急速 debug 实战一（浏览器-基础篇）")]),v._v(" "),e("h1",{attrs:{id:"前言"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#前言"}},[v._v("#")]),v._v(" 前言")]),v._v(" "),e("p",[v._v("工欲善其事，必先利其器。最近在写代码的时候越发觉得不是代码有多难，而是当代码出了问题该如何调试，如何追溯本源，这才是最难的。")]),v._v(" "),e("p",[v._v("响应这个要求，我决定写一个关于调试实战系列。本来不打算写这个基础篇章，为了整个的完整性。（不喜勿喷）")]),v._v(" "),e("p",[v._v("打算出三个篇章")]),v._v(" "),e("p",[v._v("1."),e("a",{attrs:{href:"https://huayifeng.top/debug01/",target:"_blank",rel:"noopener noreferrer"}},[v._v("急速 debug 实战一 （浏览器 - 基础篇）"),e("OutboundLink")],1)]),v._v(" "),e("p",[v._v("2."),e("a",{attrs:{href:"https://huayifeng.top/debug02/",target:"_blank",rel:"noopener noreferrer"}},[v._v("急速 debug 实战二 （浏览器 - 线上篇）"),e("OutboundLink")],1)]),v._v(" "),e("p",[v._v("3."),e("a",{attrs:{href:"https://huayifeng.top/debug03/",target:"_blank",rel:"noopener noreferrer"}},[v._v("急速 debug 实战三 （Node - webpack插件,babel插件,vue源码篇）"),e("OutboundLink")],1)]),v._v(" "),e("p",[v._v("所以示例在以下环境通过。")]),v._v(" "),e("p",[v._v("操作系统: MacOS 10.13.4")]),v._v(" "),e("p",[v._v("Chrome: 版本 72.0.3626.81（正式版本） （64 位）")]),v._v(" "),e("h1",{attrs:{id:"断点调试js"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#断点调试js"}},[v._v("#")]),v._v(" 断点调试JS")]),v._v(" "),e("p",[v._v("可能很多人现在还比较频繁的用着 "),e("code",[v._v("console.log")]),v._v(" 的方式调试着代码，这种方式不说他绝对的不好，只是相比之下断点有以下两个优势：")]),v._v(" "),e("ul",[e("li",[e("p",[v._v("使用 "),e("code",[v._v("console.log()")]),v._v("，您需要手动打开源代码，查找相关代码，插入 "),e("code",[v._v("console.log()")]),v._v(" 语句，然后重新加载此页面，才能在控制台中看到这些消息。 使用断点，无需了解代码结构即可暂停相关代码。")])]),v._v(" "),e("li",[e("p",[v._v("在 "),e("code",[v._v("console.log()")]),v._v(" 语句中，您需要明确指定要检查的每个值。 使用断点，DevTools 会在暂停时及时显示所有变量值。 有时在您不知道的情况下，有些变量会影响您的代码。")])])]),v._v(" "),e("h2",{attrs:{id:"问题"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#问题"}},[v._v("#")]),v._v(" 问题")]),v._v(" "),e("p",[v._v("1.打开: http://yifenghua.win/example/debugger/demo1.html")]),v._v(" "),e("p",[v._v("2.在 "),e("code",[v._v("Number 1")]),v._v(" 文本框中输入 5。")]),v._v(" "),e("p",[v._v("3.在 "),e("code",[v._v("Number 2")]),v._v(" 文本框中输入 1。")]),v._v(" "),e("p",[v._v("4.点击 "),e("code",[v._v("Add Number 1 and Number 2")]),v._v("。 按钮下方的标签显示"),e("code",[v._v("5 + 1 = 51")]),v._v("。 结果应为 6。 这就是我们需要修正的问题。")]),v._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/2019-02-14-01.png",alt:"2019-02-14-01.png"}})]),v._v(" "),e("h2",{attrs:{id:"界面"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#界面"}},[v._v("#")]),v._v(" 界面")]),v._v(" "),e("p",[v._v("第 1 步：重现错误")]),v._v(" "),e("p",[v._v("1.通过按"),e("code",[v._v("Command+Option+I (Mac)")]),v._v(" 或 "),e("code",[v._v("Control+Shift+I（Windows、Linux）")]),v._v("，打开 DevTools。 此快捷方式可打开 "),e("code",[v._v("Console")]),v._v(" 面板。\n"),e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/2019-02-14-02.png",alt:"2019-02-14-02.png"}})]),v._v(" "),e("p",[v._v("2.点击 Sources 标签。\n"),e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/2019-02-14-03.png",alt:"2019-02-14-03.png"}})]),v._v(" "),e("p",[v._v("第 3 步：使用断点暂停代码")]),v._v(" "),e("p",[v._v("如果退一步思考应用的运作方式，您可以根据经验推测出，使用与 "),e("strong",[v._v("Add Number 1 and Number 2")]),v._v(" 按钮关联的 click 事件侦听器时计算的和不正确 "),e("code",[v._v("(5 + 1 = 51)")]),v._v("。 因此，您可能需要在 "),e("code",[v._v("click")]),v._v(" 侦听器运行时暂停代码。 "),e("strong",[v._v("Event Listener Breakpoints")]),v._v(" 可让您完成此任务：")]),v._v(" "),e("ol",[e("li",[v._v("在 "),e("strong",[v._v("JavaScript Debugging")]),v._v(" 窗格中，点击 "),e("strong",[v._v("Event Listener Breakpoints")]),v._v(" 以展开该部分。 DevTools 会显示 "),e("strong",[v._v("Animation")]),v._v(" 和 "),e("strong",[v._v("Clipboard")]),v._v(" 等可展开的事件类别列表。")]),v._v(" "),e("li",[v._v("在 "),e("strong",[v._v("Mouse")]),v._v(" 事件类别旁，点击 "),e("strong",[v._v("Expand Expand")]),v._v(" 图标。 DevTools 会显示 "),e("strong",[v._v("click")]),v._v(" 和 "),e("strong",[v._v("mousedown")]),v._v(" 等鼠标事件列表。 每个事件旁都有一个复选框。")]),v._v(" "),e("li",[v._v("勾选 "),e("strong",[v._v("click")]),v._v(" 复选框。 DevTools 现在经过设置可以在任何 click 事件侦听器运行时自动暂停。")]),v._v(" "),e("li",[v._v("返回至演示页面，再次点击 "),e("strong",[v._v("Add Number 1 and Number 2")]),v._v("。 DevTools 会暂停演示并在 "),e("strong",[v._v("Sources")]),v._v(" 面板中突出显示一行代码。 DevTools 应在此代码行暂停：")])]),v._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[v._v("function onClick() {\n")])])]),e("p",[v._v("如果是在其他代码行暂停，请按 "),e("strong",[v._v("Resume Script Execution")]),v._v(" 继续执行脚本， 直到在正确的代码行暂停为止。")]),v._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/2019-02-14-04.png",alt:"2019-02-14-04.png"}})]),v._v(" "),e("h2",{attrs:{id:"单步调试代码"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#单步调试代码"}},[v._v("#")]),v._v(" 单步调试代码")]),v._v(" "),e("p",[v._v("一个常见的错误原因是脚本执行顺序有误。 可以通过单步调试代码一次一行地检查代码执行情况，准确找到执行顺序异常之处。 立即尝试：")]),v._v(" "),e("p",[v._v("在 DevTools 的 "),e("strong",[v._v("Sources")]),v._v(" 面板上，点击 "),e("strong",[v._v("Step into next function call")]),v._v(" 单步执行时进入下一个函数调用，以便一次一行地单步调试 onClick() 函数的执行。 DevTools 突出显示下面这行代码：")]),v._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[v._v("if (inputsAreEmpty()) {\n")])])]),e("p",[v._v("点击 "),e("strong",[v._v("Step over next function call")]),v._v(" 单步执行时越过下一个函数调用。 DevTools 执行但不进入 "),e("code",[v._v("inputsAreEmpty()")]),v._v("。 请注意 DevTools 是如何跳过几行代码的。 这是因为 "),e("code",[v._v("inputsAreEmpty()")]),v._v(" 求值结果为 false，所以 "),e("code",[v._v("if")]),v._v(" 语句的代码块未执行。")]),v._v(" "),e("p",[v._v("这就是单步调试代码的基本思路。 如果看一下 "),e("code",[v._v("get-started.js")]),v._v(" 中的代码，您会发现错误多半出在 "),e("code",[v._v("updateLabel()")]),v._v(" 函数的某处。 您可以使用另一种断点来暂停较接近极可能出错位置的代码，而不是单步调试每一行代码。")]),v._v(" "),e("h2",{attrs:{id:"设置代码行断点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#设置代码行断点"}},[v._v("#")]),v._v(" 设置代码行断点")]),v._v(" "),e("p",[v._v("代码行断点是最常见的断点类型。 如果您想在执行到某一行代码时暂停，请使用代码行断点：")]),v._v(" "),e("p",[v._v("看一下 "),e("code",[v._v("updateLabel()")]),v._v(" 中的最后一行代码：")]),v._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[v._v("label.textContent = addend1 + ' + ' + addend2 + ' = ' + sum;\n")])])]),e("p",[v._v("在这行代码的左侧，您可以看到这行代码的行号是 "),e("strong",[v._v("32")]),v._v("。 点击 "),e("strong",[v._v("32")]),v._v("。 DevTools 会在 "),e("strong",[v._v("32")]),v._v(" 上方放置一个蓝色图标。 这意味着这行代码上有一个代码行断点。 DevTools 现在始终会在执行此行代码之前暂停。")]),v._v(" "),e("p",[v._v("点击 "),e("strong",[v._v("Resume script execution")]),v._v(" 继续执行脚本 。 脚本将继续执行，直到第 32 行。 在第 29 行、第 30 行和第 31 行上，DevTools 会在各行分号右侧输出 "),e("code",[v._v("addend1")]),v._v("、"),e("code",[v._v("addend2")]),v._v(" 和 "),e("code",[v._v("sum")]),v._v(" 的值。\n"),e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/2019-02-14-05.png",alt:"2019-02-14-05.png"}})]),v._v(" "),e("h2",{attrs:{id:"检查变量值"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#检查变量值"}},[v._v("#")]),v._v(" 检查变量值")]),v._v(" "),e("p",[e("code",[v._v("addend1")]),v._v("、"),e("code",[v._v("addend2")]),v._v(" 和 "),e("code",[v._v("sum")]),v._v(" 的值疑似有问题。 这些值位于引号中，这意味着它们是字符串。 这个假设有助于说明错误的原因。 现在可以收集更多信息。 DevTools 可提供许多用于检查变量值的工具。")]),v._v(" "),e("p",[v._v("方法 1：Scope 窗格\n在某代码行暂停时，"),e("strong",[v._v("Scope")]),v._v(" 窗格会显示当前定义的局部和全局变量，以及各变量值。 其中还会显示闭包变量（如果适用）。 双击变量值可进行编辑。 如果不在任何代码行暂停，则 "),e("strong",[v._v("Scope")]),v._v(" 窗格为空。")]),v._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/2019-02-14-06.png",alt:"2019-02-14-06.png"}})]),v._v(" "),e("p",[v._v("方法 2：监视表达式\n"),e("strong",[v._v("Watch Expressions")]),v._v(" 标签可让您监视变量值随时间变化的情况。 顾名思义，监视表达式不仅限于监视变量。 您可以将任何有效的 JavaScript 表达式存储在监视表达式中。 立即尝试：")]),v._v(" "),e("p",[v._v("点击 "),e("strong",[v._v("Watch")]),v._v(" 标签。\n点击 "),e("strong",[v._v("Add Expression")]),v._v(" 添加表达式。\n输入 "),e("code",[v._v("typeof sum")]),v._v("。\n按 "),e("code",[v._v("Enter")]),v._v(" 键。 DevTools 会显示 "),e("code",[v._v('typeof sum: "string"')]),v._v("。 冒号右侧的值就是监视表达式的结果。")]),v._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/2019-02-14-07.png",alt:"2019-02-14-07.png"}})]),v._v(" "),e("p",[v._v("正如猜想，sum 的求值结果本应是数字，而实际结果却是字符串。 现在已确定这就是错误的原因。")]),v._v(" "),e("p",[v._v("方法 3：控制台\n除了查看 "),e("code",[v._v("console.log()")]),v._v(" 消息以外，您还可以使用控制台对任意 JavaScript 语句求值。 对于调试，您可以使用控制台测试错误的潜在解决方法。 立即尝试：")]),v._v(" "),e("p",[v._v("如果您尚未打开 Console 抽屉式导航栏，请按 Escape 将其打开。 该导航栏将在 DevTools 窗口底部打开。\n在 Console 中，输入 "),e("code",[v._v("parseInt(addend1) + parseInt(addend2)")]),v._v("。 此语句有效，因为您会在特定代码行暂停，其中 "),e("code",[v._v("addend1")]),v._v(" 和 "),e("code",[v._v("addend2")]),v._v(" 在范围内。\n按 "),e("code",[v._v("Enter")]),v._v(" 键。 DevTools 对语句求值并打印输出 "),e("code",[v._v("6")]),v._v("，即您预计演示页面会产生的结果。")]),v._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/2019-02-14-08.png",alt:"2019-02-14-08.png"}})]),v._v(" "),e("h2",{attrs:{id:"应用修正方法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#应用修正方法"}},[v._v("#")]),v._v(" 应用修正方法")]),v._v(" "),e("p",[v._v("您已找到修正错误的方法。 接下来就是尝试通过编辑代码并重新运行演示来使用修正方法。 您不必离开 DevTools 就能应用修正。 您可以直接在 DevTools UI 内编辑 JavaScript 代码。 立即尝试：")]),v._v(" "),e("ol",[e("li",[v._v("点击 "),e("strong",[v._v("Resume script execution")]),v._v(" 继续执行脚本。")]),v._v(" "),e("li",[v._v("在 "),e("strong",[v._v("Code Editor 中")]),v._v("，将第 31 行 "),e("code",[v._v("var sum = addend1 + addend2")]),v._v("替换为 "),e("code",[v._v("var sum = parseInt(addend1) + parseInt(addend2)")]),v._v("。\n3.按 "),e("code",[v._v("Command+S (Mac)")]),v._v(" 或 "),e("code",[v._v("Control+S（Windows、Linux）")]),v._v("以保存更改。")]),v._v(" "),e("li",[v._v("点击 "),e("strong",[v._v("Deactivate breakpoints")]),v._v(" 取消激活断点。 其将变为蓝色，表示处于活动状态。 在完成此设置后，DevTools 会忽略您已设置的任何断点。")]),v._v(" "),e("li",[v._v("尝试使用不同的值运行演示。 现在演示可以正确计算。")])]),v._v(" "),e("h1",{attrs:{id:"各类断点使用概览"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#各类断点使用概览"}},[v._v("#")]),v._v(" 各类断点使用概览")]),v._v(" "),e("table",[e("thead",[e("tr",[e("th",[v._v("断点类型")]),v._v(" "),e("th",[v._v("情况")])])]),v._v(" "),e("tbody",[e("tr",[e("td",[v._v("代码行")]),v._v(" "),e("td",[v._v("在确切的代码区域中。")])]),v._v(" "),e("tr",[e("td",[v._v("条件代码行")]),v._v(" "),e("td",[v._v("在确切的代码区域中，且仅当其他一些条件成立时。")])]),v._v(" "),e("tr",[e("td",[v._v("DOM")]),v._v(" "),e("td",[v._v("在更改或移除特定 DOM 节点或其子级的代码中。")])]),v._v(" "),e("tr",[e("td",[v._v("XHR")]),v._v(" "),e("td",[v._v("当 XHR 网址包含字符串模式时。")])]),v._v(" "),e("tr",[e("td",[v._v("事件侦听器")]),v._v(" "),e("td",[v._v("在触发 click 等事件后运行的代码中。")])]),v._v(" "),e("tr",[e("td",[v._v("异常")]),v._v(" "),e("td",[v._v("在引发已捕获或未捕获异常的代码行中。")])]),v._v(" "),e("tr",[e("td",[v._v("函数")]),v._v(" "),e("td",[v._v("任何时候调用特定函数时。")])])])]),v._v(" "),e("h2",{attrs:{id:"代码行断点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#代码行断点"}},[v._v("#")]),v._v(" 代码行断点")]),v._v(" "),e("p",[v._v("在知道需要调查的确切代码区域时，可以使用代码行断点。\nDevTools "),e("em",[v._v("始终")]),v._v("会在执行此代码行之前暂停。")]),v._v(" "),e("p",[v._v("在 DevTools 中设置代码行断点：")]),v._v(" "),e("ol",[e("li",[v._v("点击 "),e("strong",[v._v("Sources")]),v._v(" 标签。")]),v._v(" "),e("li",[v._v("打开包含您想要中断的代码行的文件。")]),v._v(" "),e("li",[v._v("转至代码行。")]),v._v(" "),e("li",[v._v("代码行的左侧是行号列。 点击行号列。 行号列顶部将显示一个蓝色图标。")])]),v._v(" "),e("p",[e("img",{attrs:{src:"https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/loc-breakpoint.png",alt:""}})]),v._v(" "),e("h3",{attrs:{id:"代码中的代码行断点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#代码中的代码行断点"}},[v._v("#")]),v._v(" 代码中的代码行断点")]),v._v(" "),e("p",[v._v("在代码中调用 "),e("code",[v._v("debugger")]),v._v(" 可在该行暂停。 此操作相当于使用"),e("a",{attrs:{href:"#loc"}},[v._v("代码行断点")]),v._v("，只是此断点是在代码中设置，而不是在 DevTools 界面中设置。")]),v._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",[e("code",[v._v("console.log('a');\nconsole.log('b');\ndebugger;\nconsole.log('c');\n")])])]),e("h3",{attrs:{id:"条件代码行断点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#条件代码行断点"}},[v._v("#")]),v._v(" 条件代码行断点")]),v._v(" "),e("p",[v._v("如果知道需要调查的确切代码区域，但只想在其他一些条件成立时进行暂停，则可使用条件代码行断点。")]),v._v(" "),e("p",[v._v("若要设置条件代码行断点：")]),v._v(" "),e("ol",[e("li",[v._v("点击 "),e("strong",[v._v("Sources")]),v._v(" 标签。")]),v._v(" "),e("li",[v._v("打开包含您想要中断的代码行的文件。")]),v._v(" "),e("li",[v._v("转至代码行。")]),v._v(" "),e("li",[v._v("代码行的左侧是行号列。 右键点击行号列。")]),v._v(" "),e("li",[v._v("选择 "),e("strong",[v._v("Add conditional breakpoint")]),v._v("。 代码行下方将显示一个对话框。")]),v._v(" "),e("li",[v._v("在对话框中输入条件。")]),v._v(" "),e("li",[v._v("按 "),e("kbd",[v._v("Enter")]),v._v(" 键激活断点。 行号列顶部将显示一个橙色图标。")])]),v._v(" "),e("p",[e("img",{attrs:{src:"https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/conditional-loc-breakpoint.png",alt:""}})]),v._v(" "),e("h3",{attrs:{id:"管理代码行断点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#管理代码行断点"}},[v._v("#")]),v._v(" 管理代码行断点")]),v._v(" "),e("p",[v._v("使用 "),e("strong",[v._v("Breakpoints")]),v._v(" 窗格可以从单个位置停用或移除代码行断点。")]),v._v(" "),e("p",[e("img",{attrs:{src:"https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/breakpoints-pane.png",alt:""}})]),v._v(" "),e("p",[v._v("显示两个代码行断点的 "),e("b",[v._v("Breakpoints")]),v._v(" 窗格：一个代码行断点位于 "),e("code",[v._v("get-started.js")]),v._v(" 第 15 行，另一个位于\n第 32 行")]),v._v(" "),e("ul",[e("li",[v._v("勾选条目旁的复选框可以停用相应的断点。")]),v._v(" "),e("li",[v._v("右键点击条目可以移除相应的断点。")]),v._v(" "),e("li",[v._v("右键点击 "),e("strong",[v._v("Breakpoints")]),v._v(" 窗格中的任意位置可以取消激活所有断点、停用所有断点，或移除所有断点。\n停用所有断点相当于取消选中每个断点。\n取消激活所有断点可让 DevTools 忽略所有代码行断点，但同时会继续保持其启用状态，以使这些断点的状态与取消激活之前相同。")])]),v._v(" "),e("p",[e("img",{attrs:{src:"https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/deactivated-breakpoints.png",alt:""}}),v._v(" "),e("b",[v._v("Breakpoints")]),v._v(" 窗格中取消激活的断点已停用且处于透明状态")]),v._v(" "),e("h2",{attrs:{id:"dom-更改断点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#dom-更改断点"}},[v._v("#")]),v._v(" DOM 更改断点")]),v._v(" "),e("p",[v._v("如果想要暂停更改 DOM\n节点或其子级的代码，可以使用 DOM 更改断点。")]),v._v(" "),e("p",[v._v("若要设置 DOM 更改断点：")]),v._v(" "),e("ol",[e("li",[v._v("点击 "),e("strong",[v._v("Elements")]),v._v(" 标签。")]),v._v(" "),e("li",[v._v("转至要设置断点的元素。")]),v._v(" "),e("li",[v._v("右键点击此元素。")]),v._v(" "),e("li",[v._v("将鼠标指针悬停在 "),e("strong",[v._v("Break on")]),v._v(" 上，然后选择 "),e("strong",[v._v("Subtree modifications")]),v._v("、"),e("strong",[v._v("Attribute\nmodifications")]),v._v(" 或 "),e("strong",[v._v("Node removal")]),v._v("。")])]),v._v(" "),e("p",[e("img",{attrs:{src:"https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/dom-change-breakpoint.png",alt:""}})]),v._v(" "),e("h3",{attrs:{id:"dom-更改断点的类型"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#dom-更改断点的类型"}},[v._v("#")]),v._v(" DOM 更改断点的类型")]),v._v(" "),e("ul",[e("li",[e("p",[e("strong",[v._v("Subtree modifications")]),v._v("： 在移除或添加当前所选节点的子级，或更改子级内容时触发这类断点。\n在子级节点属性发生变化或对当前所选节点进行任何更改时不会触发这类断点。")])]),v._v(" "),e("li",[e("p",[e("strong",[v._v("Attributes modifications")]),v._v("：在当前所选节点上添加或移除属性，或属性值发生变化时触发这类断点。")])]),v._v(" "),e("li",[e("p",[e("strong",[v._v("Node Removal")]),v._v("：在移除当前选定的节点时会触发。")])])]),v._v(" "),e("h2",{attrs:{id:"xhr-fetch-断点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#xhr-fetch-断点"}},[v._v("#")]),v._v(" XHR/Fetch 断点")]),v._v(" "),e("p",[v._v("如果想在 XHR\n的请求网址包含指定字符串时中断，可以使用 XHR 断点。 DevTools 会在\nXHR 调用 "),e("code",[v._v("send()")]),v._v(" 的代码行暂停。")]),v._v(" "),e("p",[v._v("注：此功能还可用于 "),e("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",target:"_blank",rel:"noopener noreferrer"}},[v._v("Fetch"),e("OutboundLink")],1),v._v(" 请求。")]),v._v(" "),e("p",[v._v("例如，在您发现您的页面请求的是错误网址，并且您想要快速找到导致错误请求的 AJAX\n或\nFetch 源代码时，这类断点很有用。")]),v._v(" "),e("p",[v._v("若要设置 XHR 断点：")]),v._v(" "),e("ol",[e("li",[v._v("点击 "),e("strong",[v._v("Sources")]),v._v(" 标签。")]),v._v(" "),e("li",[v._v("展开 "),e("strong",[v._v("XHR Breakpoints")]),v._v(" 窗格。")]),v._v(" "),e("li",[v._v("点击 "),e("strong",[v._v("Add breakpoint")]),v._v("。")]),v._v(" "),e("li",[v._v("输入要对其设置断点的字符串。 DevTools 会在 XHR 的请求网址的任意位置显示此字符串时暂停。")]),v._v(" "),e("li",[v._v("按 "),e("kbd",[v._v("Enter")]),v._v(" 键以确认。")])]),v._v(" "),e("p",[e("img",{attrs:{src:"https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/xhr-breakpoint.png",alt:""}})]),v._v(" "),e("h2",{attrs:{id:"事件侦听器断点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#事件侦听器断点"}},[v._v("#")]),v._v(" 事件侦听器断点")]),v._v(" "),e("p",[v._v("如果想要暂停触发事件后运行的事件侦听器代码，可以使用事件侦听器断点。\n您可以选择 "),e("code",[v._v("click")]),v._v(" 等特定事件或所有鼠标事件等事件类别。")]),v._v(" "),e("ol",[e("li",[v._v("点击 "),e("strong",[v._v("Sources")]),v._v(" 标签。")]),v._v(" "),e("li",[v._v("展开 "),e("strong",[v._v("Event Listener Breakpoints")]),v._v(" 窗格。 DevTools 会显示 "),e("strong",[v._v("Animation")]),v._v(" 等事件类别列表。")]),v._v(" "),e("li",[v._v("勾选这些类别之一以在触发该类别的任何事件时暂停，或者展开类别并勾选特定事件。")])]),v._v(" "),e("p",[e("img",{attrs:{src:"https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/event-listener-breakpoint.png",alt:""}})]),v._v(" "),e("h2",{attrs:{id:"异常断点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#异常断点"}},[v._v("#")]),v._v(" 异常断点")]),v._v(" "),e("p",[v._v("如果想要在引发已捕获或未捕获异常的代码行暂停，可以使用异常断点。")]),v._v(" "),e("ol",[e("li",[v._v("点击 "),e("strong",[v._v("Sources")]),v._v(" 标签。")]),v._v(" "),e("li",[v._v("点击 "),e("strong",[v._v("Pause on exceptions")]),v._v(" "),e("img",{attrs:{src:"https://developers.google.com/web/tools/chrome-devtools/images/resume-script-execution.png",alt:"引发异常时暂停"}}),v._v("\n。 启用后，此按钮变为蓝色。")]),v._v(" "),e("li",[v._v("（可选）如果除未捕获异常以外，还想在引发已捕获异常时暂停，则勾选 "),e("strong",[v._v("Pause On Caught Exceptions")]),v._v(" 复选框。")])]),v._v(" "),e("p",[e("img",{attrs:{src:"https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/uncaught-exception.png",alt:""}})]),v._v(" "),e("h2",{attrs:{id:"函数断点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#函数断点"}},[v._v("#")]),v._v(" 函数断点")]),v._v(" "),e("p",[v._v("如果想要在调用特定函数时暂停，可以调用 "),e("code",[v._v("debug(functionName)")]),v._v("，其中 "),e("code",[v._v("functionName")]),v._v(" 是要调试的函数。\n您可以将 "),e("code",[v._v("debug()")]),v._v(" 插入您的代码（如 "),e("code",[v._v("console.log()")]),v._v(" 语句），也可以从 DevTools 控制台中进行调用。\n"),e("code",[v._v("debug()")]),v._v(" 相当于在第一行函数中设置"),e("a",{attrs:{href:"#loc"}},[v._v("代码行断点")]),v._v("。")]),v._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",[e("code",[v._v("function sum(a, b) {\n  let result = a + b; // DevTools pauses on this line.\n  return result;\n}\ndebug(sum); // Pass the function object, not a string.\nsum();\n")])])]),e("h3",{attrs:{id:"确保目标函数在范围内"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#确保目标函数在范围内"}},[v._v("#")]),v._v(" 确保目标函数在范围内")]),v._v(" "),e("p",[v._v("如果想要调试的函数不在范围内，DevTools 会引发 "),e("code",[v._v("ReferenceError")]),v._v("。")]),v._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",[e("code",[v._v("(function () {\n  function hey() {\n    console.log('hey');\n  }\n  function yo() {\n    console.log('yo');\n  }\n  debug(yo); // This works.\n  yo();\n})();\ndebug(hey); // This doesn't work. hey() is out of scope.\n")])])]),e("p",[v._v("如果是从 DevTools 控制台中调用 "),e("code",[v._v("debug()")]),v._v("，则很难确保目标函数在范围内。\n下面介绍一个策略：")]),v._v(" "),e("ol",[e("li",[v._v("在函数在范围内时设置"),e("a",{attrs:{href:"#loc"}},[v._v("代码行断点")]),v._v("。")]),v._v(" "),e("li",[v._v("触发此断点。")]),v._v(" "),e("li",[v._v("当代码仍在代码行断点位置暂停时，即于 DevTools 控制台中调用 "),e("code",[v._v("debug()")]),v._v("。")])]),v._v(" "),e("h1",{attrs:{id:"额外的调试技巧"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#额外的调试技巧"}},[v._v("#")]),v._v(" \b额外的调试技巧")]),v._v(" "),e("p",[v._v("我们在调试一些 hover 属性的时候，往往想要调整 hover 后显示的元素，但是每当我们移到观察此元素的时候就会消失。这使得调试非常不方便。下面就提供几种场景，分别来给出调试的方案。")]),v._v(" "),e("p",[v._v("demo: http://yifenghua.win/example/debugger/demo2.html")]),v._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/2019-02-16-01.png",alt:"2019-02-16-01.png"}})]),v._v(" "),e("h2",{attrs:{id:"hover"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#hover"}},[v._v("#")]),v._v(" Hover")]),v._v(" "),e("p",[v._v("单纯的 hover 属性我们只需要找到触发的元素。在这里是我们 button。所以我们在 elements 中找到我们对应的 hover 元素。右键-> force state -> :hover")]),v._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/Kapture2019-02-16-01.gif",alt:"Kapture2019-02-16-01.gif"}})]),v._v(" "),e("h1",{attrs:{id:"mouse-inner"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#mouse-inner"}},[v._v("#")]),v._v(" Mouse inner")]),v._v(" "),e("p",[v._v("如果是通过 mouse （鼠标事件来触发的）并且触发元素是写在触发元素内的情况。可以通过在当前触发元素。右键 -> Break on -> subtree modifications。 然后再次触发，选择跳过断点。就可以使得\b元素出现。")]),v._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/Kapture2019-02-16-02.gif",alt:"Kapture2019-02-16-02.gif"}})]),v._v(" "),e("h1",{attrs:{id:"mouse-outer"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#mouse-outer"}},[v._v("#")]),v._v(" Mouse outer")]),v._v(" "),e("p",[v._v("如果是通过 mouse （鼠标事件来触发的）并且触发元素是写在触发元素外的情况。可以通过断点触发来阻断。（此方法也兼容 mouser inner 的情况）。当触发元素的时候按下 "),e("code",[v._v("F8 (Windwos)")]),v._v(" / "),e("code",[v._v("command + \\ (Mac)")])]),v._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/Kapture2019-02-16-03.gif",alt:"Kapture2019-02-16-03.gif"}})]),v._v(" "),e("h1",{attrs:{id:"参考文献"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#参考文献"}},[v._v("#")]),v._v(" 参考文献")]),v._v(" "),e("p",[v._v("https://developers.google.com/web/tools/chrome-devtools/javascript/breakpoints?hl=zh-cn#loc")]),v._v(" "),e("h1",{attrs:{id:"更多请关注"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#更多请关注"}},[v._v("#")]),v._v(" 更多请关注")]),v._v(" "),e("p",[v._v("友情链接： https://huayifeng.top/")]),v._v(" "),e("p",[e("img",{attrs:{src:"https://s3.qiufeng.blue/blog/erweima.jpg",alt:""}})])])}),[],!1,null,null,null);t.default=o.exports}}]);