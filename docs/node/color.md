# 让浏览器添上终端的彩


## 引言

随着我们使用内部构建系统的频率增高，没有色彩的日志已经无法满足我们日益增长的效率需求。在浏览器上输出的日志无法像终端一样，通过各种彩色的标记日志，进行快速地定位。因此本文就如何将日志信息在浏览器的输出日志效果和终端一致而展开。

**旧版效果**
![2C507D74-1CA9-475E-937C-940CD085B0C6.png](https://i.loli.net/2019/04/18/5cb8265dc13f4.png)

**我们的预期**
![AA5D367A-9B2D-4A4E-ADCA-9C7BC7390B77.png](https://i.loli.net/2019/04/18/5cb826f8b8ccc.png)


在实现这个功能前，需要抛出一个问题，就是这些彩色的字是如何输出的？引入一个概念，它就是 ANSI escape code。

> ANSI转义序列是带内信令的标准，用于控制视频文本终端和终端仿真器上的光标位置，颜色和其他选项。 某些字节序列（大多数以Esc和'['开头）嵌入到文本中，终端查找并解释为命令，而不是字符代码。
>     --维基百科 
 

可以说有了 ANSI escape code 才能让我们终端变得变得丰富多彩，本次内容讲解的就是关于色彩相关。

关于色彩输出相信在我们的终端中是非常常见的，例如，`npm` 的安装，`git` 分支的切换， 运行报错等等。

![屏幕快照 2019-04-16 下午7.38.42.png](https://i.loli.net/2019/04/16/5cb5befdade90.png)


![屏幕快照 2019-04-16 下午7.39.29.png](https://i.loli.net/2019/04/16/5cb5bf04714fe.png)


正是有了这些色彩，让我们的调试工作效率大大提高，一眼便能看到哪些命令出错了，以及如何解决的方案。

现在我们要做的就是如何将这些色彩日志输出到浏览器端。

## ansi color 的形态

ANSI转义序列是 [内频带信号方式](https://en.wikipedia.org/wiki/In-band_signaling) 的标准，用于控制视频文本终端和终端仿真器上的光标位置，颜色和其他选项。 某些字节序列（大多数以Esc和'['开头）嵌入到文本中，终端查找并解释为命令，而不是字符代码。Esc 的 ANSI 值为 27 ，8进制表示为 `\033` 16进制表示为 `\u001B`。

### 3/4 bit

原始规格只有8种颜色，`ESC[30;47m` 它是以 `ESC[` 开头  `m` 结束，中间为code码，以分号进行分割。color取值为30-37，background 取值为 40-47。例如 

```
echo -e "\u001B[31m hello"
```

效果如下
![屏幕快照 2019-04-18 下午2.14.37.png](https://i.loli.net/2019/04/18/5cb815d852edb.png)


如果想要清除颜色就需要使用 `ESC [39; 49m`（某些终端不支持） 或者`ESC[0m`  。后来的终端增加了直接指定 90-97 和 100-107 的“明亮”颜色的能力。

以下是色彩对照表
![852CB63D-CB3B-46D1-9053-42BBA579E444.png](https://i.loli.net/2019/04/18/5cb816bd2c024.png)

### 8-bit

由于256色查找表在图形卡上很常见，因此添加了转义序列以从预定义的256种颜色中进行选择

```
ESC[ 38;5;<n> m Select foreground color
ESC[ 48;5;<n> m Select background color
    0-7:  standard colors (as in ESC [ 30–37 m)
    8-15:  high intensity colors (as in ESC [ 90–97 m)
    16-231:  6 × 6 × 6 cube (216 colors): 16 + 36 × r + 6 × g + b (0 ≤ r, g, b ≤ 5)
   232-255:  grayscale from black to white in 24 steps
```

也就是说在原来的书写方式上增加了新的一位来代表更多的颜色。

在支持更多色彩的终端中，例如:

```
echo -e "\u001B[38;5;1m hello"
```

代表输出红色字体。

```
echo -e "\u001B[48;5;1;38;5;2m hello"
```
代表输出红色背景，绿色字体。

### 24-bit

随着 16 到 24 位颜色的“真彩色”图形卡变得普遍，Xterm， KDE 的Konsole，以及所有基于 libvte 的终端（包括GNOME终端）支持24位前景和背景颜色设置。

```
ESC[ 38;2;<r>;<g>;<b> m Select RGB foreground color
ESC[ 48;2;<r>;<g>;<b> m Select RGB background color
```

例如输出

```
echo -e "\u001B[38;2;255;0;0m hello"
```

代表输出红色的字体代表 rgb(255,0,0)。


## 转化 ansi color 至 html

### 实现

接下来就实现一个解析 ansi color code 的库，参考了 travis 内置的函数。封装成以下库。

https://github.com/hua1995116/ansi-color-parse

**使用**

```javascript
const {parseAnsi, ansi2html, parseHtml} = require('ansi-color-parse');

const str = "\u001b[34mHello\u001b[39m World\u001b[31m!\u001b[39m";

console.log(parseHtml(str));
//<span class="blue">Hello</span><span> World</span><span class="red">!</span>

```

## 从 child_process 为什么无法输出

在实际运用中，也就是部署系统中，我们并不会直接在终端输出日志，而是会另开一个 child_process 。但是当我们在 child_process 中运行时无法正常输出这些带 ansi code 的代码。下面分别讲述一下两种情况：

1.正常情况我们会在终端直接输出，在这种情况下，色彩输出良好。

**color.js**
```javascript
const chalk = require('chalk');

console.log(chalk.red('Error: a is undefind'));
```
```bash
node color.js
```
![屏幕快照 2019-04-18 下午3.03.24.png](https://i.loli.net/2019/04/18/5cb8214f3ea13.png)

2.开启另一个 child_process 

**child_process.js**
```javascript
const { spawn } = require('child_process');
const cmd = spawn('node', ['color.js']);

cmd.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

cmd.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

cmd.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

![屏幕快照 2019-04-18 下午3.04.49.png](https://i.loli.net/2019/04/18/5cb821981ffe4.png)

### 是什么原因造成这个输出的不一致性呢？

第一反应就是去查找根源，也就是使用频率最高的几个色彩输出的库。

https://github.com/Marak/colors.js

https://github.com/chalk/chalk


由于 colors.js 的扩展性不好，因为现在大多数情况会选用 chalk 来作为色彩输出库。那么我们就来查看他的源码来一探究竟。在 57 行我们可以看到以下字样。

https://github.com/chalk/supports-color/blob/master/index.js#L57

```
if ( ... && stream.isTTY && ... )
```

必须是终端才是 ansi color, 否则的话是将会输出正常日志。

那么 tty 是什么？

在计算中，`tty` 是 Unix 和类 Unix 操作系统中的命令，用于打印连接到标准输入的终端的文件名。

也就是说我们的 `child_process` 并不是一个 `tty` 的 `stream`。

### 如何解决问题？

https://github.com/chalk/supports-color#info

我们可以显示传入环境变量 `FORCE_COLOR=1` 或者命令带上参数 ` --color` 来解决这个问题。

![屏幕快照 2019-04-18 下午3.29.31.png](https://i.loli.net/2019/04/18/5cb827694d0d6.png)

## 结语

现在我们已经完成了从将终端日志的搬到我们的浏览器, 下面总结一下整个流程图。

![ansi-color-log.png](https://i.loli.net/2019/04/19/5cb93e80f3881.png)

##  参考文献
https://en.wikipedia.org/wiki/ANSI_escape_code#Colors

https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences

https://stackoverflow.com/questions/15011478/ansi-questions-x1b25h-and-x1be

https://bluesock.org/~willg/dev/ansi.html

https://www.cnblogs.com/gamesky/archive/2012/07/28/2613264.html
