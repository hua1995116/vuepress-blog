# 急速 debug 实战三（Node - webpack插件,babel插件,vue源码篇）

本教程共三篇。

1.[急速 debug 实战一 （浏览器 - 基础篇）](https://huayifeng.top/debug01/)

2.[急速 debug 实战二 （浏览器 - 线上篇）](https://huayifeng.top/debug02/)

3.[急速 debug 实战三 （Node - webpack插件,babel插件,vue源码篇）](https://huayifeng.top/debug03/)

在我们日常开发中有许多情况下没有 debug 就会让我们的开发变得非常的低效，甚至对一些流程的理解变得非常困难。本教程适用于，正在开发 node 应用， webpack 插件，babel 插件，想要读懂别人写的一些 webpack 插件，babel 插件 或者是想要对 vue 源码想要更加深入的了解。本教程都非常适用。相信你看完教程后，便会对那些看似复杂的东西不再惧怕，即使他们充满未知，但是能有一个方法去更好地了解他们。

示例代码仓库： https://github.com/hua1995116/debug

```bash
git clone https://github.com/hua1995116/debug.git

cd debug
```

所以示例在以下环境通过。

操作系统: MacOS 10.13.4 

Chrome: 版本 72.0.3626.81（正式版本） （64 位）

# node 调试

在 node 基础调试中，会给出 chrome 和 vscode 两种调试方式，可以根据自己的喜好来进行选择调试。（后面为了简单起见，所有示例都以 vscode 为例子。）

```shell
cd node-debug

npm install
```

## chrome 调试

**示例一：**

第一步，打开 index.js,加上断点。

```javascript
const addFn = (a, b) => {
  debugger;
  return a + b;
}

const sum = addFn('1', '2');

console.log(sum);
```

第二步，在命令行输入以下命令

```shell
node --inspect-brk index.js
```

![屏幕快照2019-02-17-01.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-01.png)

第三步，打开 chrome ，输入 [chrome://inspect](chrome://inspect)

第四步, 点击 `configure` ，配置你的地址和端口, 然后回车，点击 done。

![屏幕快照2019-02-17-02.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-02.png)


第五步，点击 Target 下的 inspect。

![屏幕快照2019-02-17-03.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-03.png)

**示例二：**

第一步，打开 koa.js，加入断点

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
    debugger;
    ctx.body = 'Hello World';
});

app.listen(3000);
```

第二步，在命令行输入以下命令

```shell
node --inspect index.js
```

第三步，打开 chrome ，输入 [chrome://inspect](chrome://inspect)

第四步, 点击 Target 下的 inspect。

第五步，在浏览器输入 [localhost:3000](localhost:3000)。便会跳出这个界面。

![屏幕快照2019-02-17-04.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-04.png)


--inspect-brk 和 --inspect 的区别（参考：https://nodejs.org/en/docs/guides/debugging-getting-started/#command-line-options）


## vscode 调试

vscode 调试就需要一些配置啦。

示例一: `index.js`

第一步，点击调试按钮，选择添加配置，用默认配置就ok。
![屏幕快照2019-02-17-05.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-05.png)

第二步，回到我们的 `index.js` 代码中，打上一个断点，vscode 打断点方式，在某一行代码前点击，会出现一个红点点。

![屏幕快照2019-02-17-06.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-06.png)

第三步，再点击调试按钮，点击启动程序前的箭头。

![屏幕快照2019-02-17-07.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-07.png)

恭喜你成功了！

示例二: `koa.js`

第一步，修改我们刚才的`launch.json`， 将 `"program": "${workspaceFolder}/index.js"` 改为 `"program": "${workspaceFolder}/koa.js"`

第二步，按照示例一的方式，给我们代码打上断点。

![屏幕快照2019-02-17-08.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-08.png)

第三步，再点击调试按钮，点击启动程序前的箭头。

![屏幕快照2019-02-17-09.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-09.png)

第四步，访问[localhost:3000](localhost:3000)。可以看到，已经进入我们的断点啦。
![屏幕快照2019-02-17-10.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-10.png)

恭喜你成功了！

# webpack插件、babel插件
相信如果你在写插件的时候通过 `console.log` 的形式会让你的插件开发变得分外的困难和头疼。还有就是看别人写的插件，如果你只会 `console.log`,那么也会令原本简单的事情变得非常复杂。除此之外，调试的好处就是，能让你看到 webpack 提供的很多钩子函数，能够让我们不再面对未知。

## webpack 插件调试

```
$ cd webpack-plugin-debug

$webpack-plugin-debug npm installl

```

第一步，和 node 调试方式是一样的，先点击调试按钮，添加一个配置，将配置修改成以下的样子。

lanuch.json
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "启动程序",
            "cwd": "${workspaceFolder}/myProject",
            "program": "${workspaceFolder}/myProject/node_modules/webpack/bin/webpack.js"
        }
    ]
}
```
> 说明： 因为在两个不同的目录，所以我选择在根目录进行调试，并且配置好当前的 `cwd` （执行根目录）。

第二步，打上断点。我们给 `myPlugin/plugin.js` 的 `var filelist = 'In this build:\n\n';` 这一行打上断点。

![屏幕快照2019-02-17-11.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-11.png)

第三步，运行, 启动程序。

![屏幕快照2019-02-17-12.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-12.png)

到这里就大功告成，你可以放心地查看各个变量（ Compilation 包含哪些变量）, 整个过程是怎么发生的，都清晰地在我们眼前。

## babel 插件调试

其实 babel 插件 和 webpack 插件是类似的。无非是一些小细节的不一致。我进行简单地演示，相信优秀的你看了 webpack 插件调试后，能够很快理解。

![2019-02-17-21.18.42.gif](https://s3.qiufengh.com/blog/2019-02-17-21.18.42.gif)

两个注意点：

- 因为 babel cli 需要定义 参数，所以在 launch.json 的时候需要加上args 参数
- .babelrc 插件的路径是可以这么写的。`"plugins": [["../babel-plugin/index"]],`


# 源码调试（vue为例）
当你在开发 vue 项目中，是否遇到过这样的情况，面对一些很奇怪的问题，你会下意识地去百度和谷歌，当然，他们一般来讲不会让你失望，总是能给你一些提示性的帮助，那么是否思考过这样一个问题，当出现一个他们没有遇到过的问题，我们该怎么办？相信你心中也会有一个答案，就是，去看源码！首先会去 clone 项目，但是源码这么多，就算你很了解其结构也记不住这么多的步骤。

所以这个时候我们需要用调试的方法，将断点在打我们熟悉的代码中。一步一步慢慢地了解其内部的过程。所以学会调试是能帮助我们更好地了解源码内部的利器。下面让我们来看看如何调试吧。

```shell
cd vue-debug

cd vue

npm install 

npm run dev
```

例如你想调试 `computed` 相关的源码。

1. 可以先在 源码 `src` 目录下搜索 相关的关键字 (现在我们是 `computed`), 一搜索你就能找到一个 `initComputed` 方法, 文件位置为 vue/src/core/instance/state.js
2. 在 `initComputed ` 方法下面加上一个 `debugger`。

```javascript
function initComputed (vm: Component, computed: Object) {
  debugger;
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()
  ...
```

3. 然后在浏览器打开 vue-debug 下面 index.html 。

![屏幕快照2019-02-17-13.png](https://s3.qiufengh.com/blog/屏幕快照2019-02-17-13.png)

接下来你就可以一步一步慢慢地进行调试了。

如果再到某个细节，你可以继续写入 debugger。 具体细节打算后面会出一篇源码的文章, 毕竟大家学会整个技能已经会自己调试了，所以讲的不多。(溜了溜了

# 结尾

看完了本教程，希望对大家有所帮助~，对各种插件以及原理不再惧怕，如果有更好地调试方式，欢迎评论来秀一波操作。

# 更多请关注

友情链接： https://huayifeng.top/

![](https://s3.qiufengh.com/blog/erweima.jpg)