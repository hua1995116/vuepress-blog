# 急速 debug 实战二（浏览器 - 调试线上篇）


本教程共三篇。

1.[急速 debug 实战一 （浏览器 - 基础篇）](https://huayifeng.top/debug01/)

2.[急速 debug 实战二 （浏览器 - 线上篇）](https://huayifeng.top/debug02/)

3.[急速 debug 实战三 （Node - webpack插件,babel插件,vue源码篇）](https://huayifeng.top/debug03/)


通过前一篇的介绍，我们已经懂得基本的 debug 技巧，那么我们如何快速调试一些线上的问题呢。本文将线上的调试分为以下三种：（当然有更好的调试方式，可以在评论区提出）
1. **线上即时修改**；针对一些样式以及一些 js 已经知道问题所在快速地修改以达到解决 bug 的模式。
2. **代理到本地代码**; 这种情况可以解决线上代码与本地不一致，也可以非常方便地在源码插入代码立即调试
3. **线上不存在 sourceMap 启用本地sourceMap**; 有时候一些问题乍一眼看不出是什么问题，但是线上又不提供 sourceMap 所以我们可以启动本地的 sourceMap 来帮助我们定位问题。

所以示例在以下环境通过。

操作系统: MacOS 10.13.4 

Chrome: 版本 72.0.3626.81（正式版本） （64 位）

# 线上即时修改

## 打开功能

在调试线上问题的时候，我们会遇到这样的问题，例如: 我需要在页面上直接修改样式快速地定位问题，可能是某些样式不兼容，导致渲染不成功。但是每当我们再 devTools 上修改完，我们想重新刷新页面。这个时候我们修改的东西都不见了。下面我介绍的这个功能就是能够让我们更好地调试线上问题，并且保持状态。

chrome devTools 有一个名叫 Overrides 的功能。这个功能对于我们线上调试有着极大的帮助

1. 打开:  http://yifenghua.win/example/debugger/demo3.html
2. 通过按 `Command+Option+I (Mac)` 或 `Control+Shift+I（Windows、Linux）`，打开 DevTools。 此快捷方式可打开 Console 面板。
3. 点击 source 按钮

![1550042488255.jpg](https://s3.qiufengh.com/blog/1550042488255.jpg)

4. 点击箭头所示按钮，找到 Overrides, 选中。
5. 点击 Select folders for Overrides。选择一个本地的空文件夹目录。


6. 跳出授权，点击允许
![1550043161526.jpg](https://s3.qiufengh.com/blog/1550043161526.jpg)


## 开始

这是我们刚才的页面
![1550044581302.jpg](https://s3.qiufengh.com/blog/1550044581302.jpg)

假设我们设计稿需要我们将背景色改成红色，并且字体大小改成22px。我们来进行修改。修改完成后刷新页面。打开后发现是这样的。

![1550047816288.jpg](https://s3.qiufengh.com/blog/1550047816288.jpg)

继续点击 source 标签。点击 Page 按钮。

![1550048001733.jpg](https://s3.qiufengh.com/blog/1550048001733.jpg)


打开我们demo3.html，将head中的 title 改成 debug03，并且保存（mac: command + s， windows: ctrl + s）。

![1550048078356.jpg](https://s3.qiufengh.com/blog/1550048078356.jpg)

再次刷新页面，发现我们的页面 title 已经成功被修改了。

最后，我们点击 source Page 中的 demo3.js。将 `card.text = '123';`修改成 `card.text = 'hello';`，继续保存。

好了。我们已经完成了我们所有的修改了。

![1550048674847.jpg](https://s3.qiufengh.com/blog/1550048674847.jpg)

可以发现我们所有的文件下面都有一个小蓝点。这个就是修改后的文件储存在一开始选择的文件夹中。

## 查看 diff

那么如何查看我们之前修改了哪些内容呢？

继续打开 devTools ，点击右上角的三个小点 -> More tools -> Changes

![1550049006069.jpg](https://s3.qiufengh.com/blog/1550049006069.jpg)

可以看到我们刚才的所有修改啦。

![1550049082173.jpg](https://s3.qiufengh.com/blog/1550049082173.jpg)


到此我们已经完成了 Overrides 调试线上的方法了。

# 代理到本地代码

首先需要下载 charles 其他的代理工具也可以，只要能将请求代理到本地的工具都可以，这里我就用我熟悉的 charles 展示。
那么这种方式主要能调试线上的什么问题呢？

1. 快速确认本地版本与线上是否一致。如果本地文件没有问题，线上有问题，那么重新打包一次即可。（如果有版本号请忽略）
2. 调试代码。

## 调试代码

下面来演示一下，如何调试线上的代码。

假设以上是我们本地的项目。所以为了演示，你需要做以下几个步骤。

```
git clone https://github.com/hua1995116/debug.git

cd debug

cd charles-debug

npm install

npx webpack --watch --progress (npm >= v5.2.0)
```

然后在我们的 dist 目录下会生成我们打包后的 js

![1550052278719.jpg](https://s3.qiufengh.com/blog/1550052278719.jpg)

1. 打开: http://yifenghua.win/example/debugger/demo4.html

2. 打开 devTools 的 netWork 查看 js 路径。 http://yifenghua.win/example/debugger/demo3.js

3. 打开我们的 charles （嗯，如何配置和使用我不进行讲解，自行百度和 Google 吧）

4. 点击 Tools 中的 Map Local 进行配置 。

![1550052700177.jpg](https://s3.qiufengh.com/blog/1550052700177.jpg)

5. Add 一个规则

![1550052759668.jpg](https://s3.qiufengh.com/blog/1550052759668.jpg)

6. 将刚才 netWork 中的 url 映射到本地地址（即刚才我们 clone 项目的位置），如图所示


![1550052892041.jpg](https://s3.qiufengh.com/blog/1550052892041.jpg)

7. 对我们本地内容进行改动。改成如下所示

```javascript
const card = document.querySelector('.card-link');
card.onclick = function() {
  card.text = '你好';
}
```

8. 再次打开我们的页面 http://yifenghua.win/example/debugger/demo4.html

9. 查看 charles 日志

![1550053079374.jpg](https://s3.qiufengh.com/blog/1550053079374.jpg)


可以看到已经成功将文件映射到本地。这样，我们就可以实时地调试我们的线上的文件啦。你可以插入各种标志点以及 debugger。


# 线上不存在 sourceMap 启用本地sourceMap

嗯，除此之外，我们还可以通过 charles 添加 sourceMap。

修改我们刚才 clone 的项目，修改 webpack.config.js 和 index.js

**webpack.config.js**
```javascript
module.exports = {
    entry: './index.js',
    output: {
        filename:'demo3.js'
    },
    devtool: 'source-map',
};
```

**index.js**
 ```javascript
const card = document.querySelector('.card-link');
card.onclick = function() {
    console.log(ss);
    card.text = '你好';
}
```


运行 
```
npx webpack --watch --progress
```

给 charles 再增加一个 Map Local

![1550054237183.jpg](https://s3.qiufengh.com/blog/1550054237183.jpg)


现在打开 http://yifenghua.win/example/debugger/demo4.html

点击 Card link，发现报错。

![1550054389531.jpg](https://s3.qiufengh.com/blog/1550054389531.jpg)

点击 index.js ，可以看到我们的能直接定位到源码啦。

![1550054429653.jpg](https://s3.qiufengh.com/blog/1550054429653.jpg)

# 总结

有了以上三种方式调试线上代码。应该说可以定位到绝大多数数问题了。如果大家有什么更好的方式可以留言，一起学习下,嗯，真香。 (溜了溜了

# 更多请关注

友情链接： https://huayifeng.top/

![](https://s3.qiufengh.com/blog/erweima.jpg)