# 急速 debug 实战一（浏览器-基础篇）

# 前言
工欲善其事，必先利其器。最近在写代码的时候越发觉得不是代码有多难，而是当代码出了问题该如何调试，如何追溯本源，这才是最难的。

响应这个要求，我决定写一个关于调试实战系列。本来不打算写这个基础篇章，为了整个的完整性。（不喜勿喷）

打算出三个篇章

1.[急速 debug 实战一 （浏览器 - 基础篇）](https://huayifeng.top/debug01/)

2.[急速 debug 实战二 （浏览器 - 线上篇）](https://huayifeng.top/debug02/)

3.[急速 debug 实战三 （Node - webpack插件,babel插件,vue源码篇）](https://huayifeng.top/debug03/)

所以示例在以下环境通过。

操作系统: MacOS 10.13.4 

Chrome: 版本 72.0.3626.81（正式版本） （64 位）

# 断点调试JS

可能很多人现在还比较频繁的用着 `console.log` 的方式调试着代码，这种方式不说他绝对的不好，只是相比之下断点有以下两个优势：

- 使用 `console.log()`，您需要手动打开源代码，查找相关代码，插入 `console.log()` 语句，然后重新加载此页面，才能在控制台中看到这些消息。 使用断点，无需了解代码结构即可暂停相关代码。

- 在 `console.log()` 语句中，您需要明确指定要检查的每个值。 使用断点，DevTools 会在暂停时及时显示所有变量值。 有时在您不知道的情况下，有些变量会影响您的代码。


## 问题

1.打开: http://yifenghua.win/example/debugger/demo1.html

2.在 `Number 1` 文本框中输入 5。

3.在 `Number 2` 文本框中输入 1。

4.点击 `Add Number 1 and Number 2`。 按钮下方的标签显示` 5 + 1 = 51`。 结果应为 6。 这就是我们需要修正的问题。

![2019-02-14-01.png](https://s3.qiufengh.com/blog/2019-02-14-01.png)


## 界面

第 1 步：重现错误

1.通过按` Command+Option+I (Mac)` 或 `Control+Shift+I（Windows、Linux）`，打开 DevTools。 此快捷方式可打开 `Console` 面板。
![2019-02-14-02.png](https://s3.qiufengh.com/blog/2019-02-14-02.png)

2.点击 Sources 标签。
![2019-02-14-03.png](https://s3.qiufengh.com/blog/2019-02-14-03.png)



第 3 步：使用断点暂停代码

如果退一步思考应用的运作方式，您可以根据经验推测出，使用与 **Add Number 1 and Number 2** 按钮关联的 click 事件侦听器时计算的和不正确 `(5 + 1 = 51)`。 因此，您可能需要在 `click` 侦听器运行时暂停代码。 **Event Listener Breakpoints** 可让您完成此任务：

1. 在 **JavaScript Debugging** 窗格中，点击 **Event Listener Breakpoints** 以展开该部分。 DevTools 会显示 **Animation** 和 **Clipboard** 等可展开的事件类别列表。
2. 在 **Mouse** 事件类别旁，点击 **Expand Expand** 图标。 DevTools 会显示 **click** 和 **mousedown** 等鼠标事件列表。 每个事件旁都有一个复选框。
3. 勾选 **click** 复选框。 DevTools 现在经过设置可以在任何 click 事件侦听器运行时自动暂停。
4. 返回至演示页面，再次点击 **Add Number 1 and Number 2**。 DevTools 会暂停演示并在 **Sources** 面板中突出显示一行代码。 DevTools 应在此代码行暂停：
```
function onClick() {
```
如果是在其他代码行暂停，请按 **Resume Script Execution** 继续执行脚本， 直到在正确的代码行暂停为止。



![2019-02-14-04.png](https://s3.qiufengh.com/blog/2019-02-14-04.png)


## 单步调试代码

一个常见的错误原因是脚本执行顺序有误。 可以通过单步调试代码一次一行地检查代码执行情况，准确找到执行顺序异常之处。 立即尝试：

在 DevTools 的 **Sources** 面板上，点击 **Step into next function call** 单步执行时进入下一个函数调用，以便一次一行地单步调试 onClick() 函数的执行。 DevTools 突出显示下面这行代码：
```
if (inputsAreEmpty()) {
```
点击 **Step over next function call** 单步执行时越过下一个函数调用。 DevTools 执行但不进入 `inputsAreEmpty()`。 请注意 DevTools 是如何跳过几行代码的。 这是因为 `inputsAreEmpty()` 求值结果为 false，所以 `if` 语句的代码块未执行。

这就是单步调试代码的基本思路。 如果看一下 `get-started.js` 中的代码，您会发现错误多半出在 `updateLabel()` 函数的某处。 您可以使用另一种断点来暂停较接近极可能出错位置的代码，而不是单步调试每一行代码。

## 设置代码行断点

代码行断点是最常见的断点类型。 如果您想在执行到某一行代码时暂停，请使用代码行断点：

看一下 `updateLabel()` 中的最后一行代码：
```
label.textContent = addend1 + ' + ' + addend2 + ' = ' + sum;
```
在这行代码的左侧，您可以看到这行代码的行号是 **32**。 点击 **32**。 DevTools 会在 **32** 上方放置一个蓝色图标。 这意味着这行代码上有一个代码行断点。 DevTools 现在始终会在执行此行代码之前暂停。

点击 **Resume script execution** 继续执行脚本 。 脚本将继续执行，直到第 32 行。 在第 29 行、第 30 行和第 31 行上，DevTools 会在各行分号右侧输出 `addend1`、`addend2` 和 `sum` 的值。
![2019-02-14-05.png](https://s3.qiufengh.com/blog/2019-02-14-05.png)

## 检查变量值
`addend1`、`addend2` 和 `sum` 的值疑似有问题。 这些值位于引号中，这意味着它们是字符串。 这个假设有助于说明错误的原因。 现在可以收集更多信息。 DevTools 可提供许多用于检查变量值的工具。

方法 1：Scope 窗格
在某代码行暂停时，**Scope** 窗格会显示当前定义的局部和全局变量，以及各变量值。 其中还会显示闭包变量（如果适用）。 双击变量值可进行编辑。 如果不在任何代码行暂停，则 **Scope** 窗格为空。

![2019-02-14-06.png](https://s3.qiufengh.com/blog/2019-02-14-06.png)

方法 2：监视表达式
**Watch Expressions** 标签可让您监视变量值随时间变化的情况。 顾名思义，监视表达式不仅限于监视变量。 您可以将任何有效的 JavaScript 表达式存储在监视表达式中。 立即尝试：

点击 **Watch** 标签。
点击 **Add Expression** 添加表达式。
输入 `typeof sum`。
按 `Enter` 键。 DevTools 会显示 `typeof sum: "string"`。 冒号右侧的值就是监视表达式的结果。

![2019-02-14-07.png](https://s3.qiufengh.com/blog/2019-02-14-07.png)

正如猜想，sum 的求值结果本应是数字，而实际结果却是字符串。 现在已确定这就是错误的原因。

方法 3：控制台
除了查看 `console.log()` 消息以外，您还可以使用控制台对任意 JavaScript 语句求值。 对于调试，您可以使用控制台测试错误的潜在解决方法。 立即尝试：

如果您尚未打开 Console 抽屉式导航栏，请按 Escape 将其打开。 该导航栏将在 DevTools 窗口底部打开。
在 Console 中，输入 `parseInt(addend1) + parseInt(addend2)`。 此语句有效，因为您会在特定代码行暂停，其中 `addend1` 和 `addend2` 在范围内。
按 `Enter` 键。 DevTools 对语句求值并打印输出 `6`，即您预计演示页面会产生的结果。

![2019-02-14-08.png](https://s3.qiufengh.com/blog/2019-02-14-08.png)

## 应用修正方法
您已找到修正错误的方法。 接下来就是尝试通过编辑代码并重新运行演示来使用修正方法。 您不必离开 DevTools 就能应用修正。 您可以直接在 DevTools UI 内编辑 JavaScript 代码。 立即尝试：

1. 点击 **Resume script execution** 继续执行脚本。
2. 在 **Code Editor 中**，将第 31 行 `var sum = addend1 + addend2 `替换为 `var sum = parseInt(addend1) + parseInt(addend2)`。
3.按 `Command+S (Mac)` 或 `Control+S（Windows、Linux）`以保存更改。
4. 点击 **Deactivate breakpoints** 取消激活断点。 其将变为蓝色，表示处于活动状态。 在完成此设置后，DevTools 会忽略您已设置的任何断点。
5. 尝试使用不同的值运行演示。 现在演示可以正确计算。

# 各类断点使用概览

|  断点类型     |  情况     |
|  ---  |  ---  |
| 代码行      |  在确切的代码区域中。     |
|   条件代码行    |  在确切的代码区域中，且仅当其他一些条件成立时。     |
| DOM      |在更改或移除特定 DOM 节点或其子级的代码中。       |
| XHR      | 当 XHR 网址包含字符串模式时。      |
| 事件侦听器      |在触发 click 等事件后运行的代码中。       |
|  异常     | 在引发已捕获或未捕获异常的代码行中。      |
|    函数   | 任何时候调用特定函数时。      |


## 代码行断点 

在知道需要调查的确切代码区域时，可以使用代码行断点。
 DevTools *始终*会在执行此代码行之前暂停。


在 DevTools 中设置代码行断点：

1. 点击 **Sources** 标签。
2. 打开包含您想要中断的代码行的文件。
3. 转至代码行。
4. 代码行的左侧是行号列。 点击行号列。 行号列顶部将显示一个蓝色图标。

![](https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/loc-breakpoint.png)


### 代码中的代码行断点 

在代码中调用 `debugger` 可在该行暂停。 此操作相当于使用[代码行断点](#loc)，只是此断点是在代码中设置，而不是在 DevTools 界面中设置。



    console.log('a');
    console.log('b');
    debugger;
    console.log('c');

### 条件代码行断点

如果知道需要调查的确切代码区域，但只想在其他一些条件成立时进行暂停，则可使用条件代码行断点。



若要设置条件代码行断点：

1. 点击 **Sources** 标签。
2. 打开包含您想要中断的代码行的文件。
3. 转至代码行。
4. 代码行的左侧是行号列。 右键点击行号列。
5. 选择 **Add conditional breakpoint**。 代码行下方将显示一个对话框。
6. 在对话框中输入条件。
7. 按 <kbd>Enter</kbd> 键激活断点。 行号列顶部将显示一个橙色图标。


![](https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/conditional-loc-breakpoint.png)

### 管理代码行断点

使用 **Breakpoints** 窗格可以从单个位置停用或移除代码行断点。

![](https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/breakpoints-pane.png)

显示两个代码行断点的 <b>Breakpoints</b> 窗格：一个代码行断点位于 <code>get-started.js</code> 第 15 行，另一个位于
    第 32 行

* 勾选条目旁的复选框可以停用相应的断点。
* 右键点击条目可以移除相应的断点。
* 右键点击 **Breakpoints** 窗格中的任意位置可以取消激活所有断点、停用所有断点，或移除所有断点。
 停用所有断点相当于取消选中每个断点。
 取消激活所有断点可让 DevTools 忽略所有代码行断点，但同时会继续保持其启用状态，以使这些断点的状态与取消激活之前相同。



![](https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/deactivated-breakpoints.png)
<b>Breakpoints</b> 窗格中取消激活的断点已停用且处于透明状态

## DOM 更改断点

如果想要暂停更改 DOM
节点或其子级的代码，可以使用 DOM 更改断点。

若要设置 DOM 更改断点：

1. 点击 **Elements** 标签。
2. 转至要设置断点的元素。
3. 右键点击此元素。
4. 将鼠标指针悬停在 **Break on** 上，然后选择 **Subtree modifications**、**Attribute
  modifications** 或 **Node removal**。


![](https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/dom-change-breakpoint.png)


### DOM 更改断点的类型 

* **Subtree modifications**： 在移除或添加当前所选节点的子级，或更改子级内容时触发这类断点。
 在子级节点属性发生变化或对当前所选节点进行任何更改时不会触发这类断点。



* **Attributes modifications**：在当前所选节点上添加或移除属性，或属性值发生变化时触发这类断点。


* **Node Removal**：在移除当前选定的节点时会触发。

## XHR/Fetch 断点 

如果想在 XHR
的请求网址包含指定字符串时中断，可以使用 XHR 断点。 DevTools 会在
XHR 调用 `send()` 的代码行暂停。

注：此功能还可用于 [Fetch][Fetch] 请求。

例如，在您发现您的页面请求的是错误网址，并且您想要快速找到导致错误请求的 AJAX
或
Fetch 源代码时，这类断点很有用。

若要设置 XHR 断点：

1. 点击 **Sources** 标签。
2. 展开 **XHR Breakpoints** 窗格。
3. 点击 **Add breakpoint**。
4. 输入要对其设置断点的字符串。 DevTools 会在 XHR 的请求网址的任意位置显示此字符串时暂停。
5. 按 <kbd>Enter</kbd> 键以确认。

![](https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/xhr-breakpoint.png)

[Fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

## 事件侦听器断点

如果想要暂停触发事件后运行的事件侦听器代码，可以使用事件侦听器断点。
 您可以选择 `click` 等特定事件或所有鼠标事件等事件类别。


1. 点击 **Sources** 标签。
2. 展开 **Event Listener Breakpoints** 窗格。 DevTools 会显示 **Animation** 等事件类别列表。
3. 勾选这些类别之一以在触发该类别的任何事件时暂停，或者展开类别并勾选特定事件。

![](https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/event-listener-breakpoint.png)

## 异常断点

如果想要在引发已捕获或未捕获异常的代码行暂停，可以使用异常断点。


1. 点击 **Sources** 标签。
2. 点击 **Pause on exceptions** ![引发异常时暂停](https://developers.google.com/web/tools/chrome-devtools/images/resume-script-execution.png)
。 启用后，此按钮变为蓝色。
1. （可选）如果除未捕获异常以外，还想在引发已捕获异常时暂停，则勾选 **Pause On Caught Exceptions** 复选框。


![](https://developers.google.com/web/tools/chrome-devtools/javascript/imgs/uncaught-exception.png)

## 函数断点

如果想要在调用特定函数时暂停，可以调用 `debug(functionName)`，其中 `functionName` 是要调试的函数。
 您可以将 `debug()` 插入您的代码（如 `console.log()` 语句），也可以从 DevTools 控制台中进行调用。
 `debug()` 相当于在第一行函数中设置[代码行断点](#loc)。


    function sum(a, b) {
      let result = a + b; // DevTools pauses on this line.
      return result;
    }
    debug(sum); // Pass the function object, not a string.
    sum();


### 确保目标函数在范围内

如果想要调试的函数不在范围内，DevTools 会引发 `ReferenceError`。


    (function () {
      function hey() {
        console.log('hey');
      }
      function yo() {
        console.log('yo');
      }
      debug(yo); // This works.
      yo();
    })();
    debug(hey); // This doesn't work. hey() is out of scope.

如果是从 DevTools 控制台中调用 `debug()`，则很难确保目标函数在范围内。
 下面介绍一个策略：

1. 在函数在范围内时设置[代码行断点](#loc)。
2. 触发此断点。
3. 当代码仍在代码行断点位置暂停时，即于 DevTools 控制台中调用 `debug()`。



# 额外的调试技巧

我们在调试一些 hover 属性的时候，往往想要调整 hover 后显示的元素，但是每当我们移到观察此元素的时候就会消失。这使得调试非常不方便。下面就提供几种场景，分别来给出调试的方案。

demo: http://yifenghua.win/example/debugger/demo2.html

![2019-02-16-01.png](https://s3.qiufengh.com/blog/2019-02-16-01.png)

## Hover

单纯的 hover 属性我们只需要找到触发的元素。在这里是我们 button。所以我们在 elements 中找到我们对应的 hover 元素。右键-> force state -> :hover

![Kapture2019-02-16-01.gif](https://s3.qiufengh.com/blog/Kapture2019-02-16-01.gif)

# Mouse inner

如果是通过 mouse （鼠标事件来触发的）并且触发元素是写在触发元素内的情况。可以通过在当前触发元素。右键 -> Break on -> subtree modifications。 然后再次触发，选择跳过断点。就可以使得元素出现。

![Kapture2019-02-16-02.gif](https://s3.qiufengh.com/blog/Kapture2019-02-16-02.gif)


# Mouse outer
如果是通过 mouse （鼠标事件来触发的）并且触发元素是写在触发元素外的情况。可以通过断点触发来阻断。（此方法也兼容 mouser inner 的情况）。当触发元素的时候按下 `F8 (Windwos)` / `command + \  (Mac)`

![Kapture2019-02-16-03.gif](https://s3.qiufengh.com/blog/Kapture2019-02-16-03.gif)


# 参考文献

https://developers.google.com/web/tools/chrome-devtools/javascript/breakpoints?hl=zh-cn#loc

# 更多请关注

友情链接： https://huayifeng.top/

![](https://s3.qiufengh.com/blog/erweima.jpg)