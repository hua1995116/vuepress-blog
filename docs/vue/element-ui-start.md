# 我们应该如何学习 element-ui 源码？

## 1.前言

最近在维护团队内部的组件库，所以对组件库的整体框架有一些见解吧。因为对内组件库不公开，所以我们来讲讲 element-ui 的整体框架吧。很多人对于这种巨型库的源码有一种莫名的害怕，并且哪怕拿到整个库的源码，也不知道如何去阅读，但是看到有些大佬，明明都没有怎么阅读过这个库的源码，遇到问题，却能直接去分析源码，并且定位到根本问题。(本文都是个人见解哈，如有错误可以指出)

所以本文就三点进行讲解：

1.为什么别人学习源码那么快？

2.阅读源码前所需要的步骤

3.如何阅读源码以element-ui为例



## 2 为什么别人学习源码那么快？ 

其实学习的快，又回到了以前高中时代，所说的学习方法，然后又回到了如何高效学习。。。但是本文不讨论那么高深的东西。我认为学习这一类的源码有两点吧。

1.心智模型

2.做大于看

### 2.1 心智模型

那么什么是心智模型？所谓心智模式是指深植我们心中关于我们自己、别人、组织及周围世界每个层面的假设、形象和故事。并深受习惯思维、定势思维、已有知识的局限。

“心智模型是经由经验及学习，脑海中对某些事物发展的过程，所写下的剧本。”

“心智模型是你对事物运行发展的预测。”

简单概括来讲，就是你对一个事物下意识的判定。

![521abef50a43e595b4d69d721a776857_1440w](https://s3.qiufengh.com/blog/521abef50a43e595b4d69d721a776857_1440w.jpg)

那么心智模型又是怎么和源码学习结合在一起的呢？其实这也是经验的积累，对项目工程化的熟悉，例如源码库有很多目录，我们会有一套默认的书写方式，我们知道 `src` 目录下放的是源码、test 下放的是测试用例、`packages` 目录可以联想到 `monorepo` 风格多包单独抽离，想到 `yarn workspace`，例如` yarn workspace` 你用 `npm` 安装是会出错的，这如果你是重度  `npm` 用户，这就够你喝一壶的等等。。。这些都是我们的心智模型，所以一些大佬源码阅读的多了，就会形成一套流水线式的套路，先找 `package.json` ，去确定主入口，然后一步一步地去往内层读，大多数的目录名称都是语义化的。唯一阻碍你的可能就是英文意思，这个....读多了也能克服，我反正英语渣....

所以别看那些大佬看的很快，在这背后也是人家前期的积累，肯定看过不少框架源码。所以加强自己的心智模型的方法就是多看，哈哈哈哈，我仿佛说了废话，但是如何入门，可以看我后面部分，带你学习。



### 2.2 做大于看

遇到一个源码中的问题，往往大家就慌了，不知道他到底哪里出错了，源码这么多，调试起来肯定很麻烦，算了算了，换个方法试试？如果是对于一个业务紧急状态下，换方法可以说是比较明智的原则，因为软件最终服务于业务，如何快速解决确实是对的，但是对于我们日常的学习中，你遇到问题了，还是这样，那么很难挖掘深层次，也比较难提高。其实入手源码也很简单，你只要在源码中写上一个简单的 `console.log` ，因为其实如果你不长期维护一个源码框架，你对其实的一些实现细节是很难记住的。（反正我自己维护的库，好久没维护，过一段时间来看，也很难记住其中一些细节) 所以这个时候，你需要了解其中到底发生了什么，**看源码，不是真的看源码，你得去调试，去打印出其中的关键点。**例如其实很多源码问题，都是有错误栈的，你可以根据错误栈一步一步地去打印值，然后一步一步地去跟踪定位。（当然方法你用 `console.log` 还是用 `debugger` 都是无所谓，各种方法各有各的好处。）



## 3. 阅读源码前所需要的步骤

### 3.1.拉代码

#### 3.1.1 拉取到本地

很多人可能在这个步骤就有问题，github 一般来讲都比较慢, 很容易出现超时等问题。

`error: RPC failed; HTTP 504 curl 22 The requested URL returned error: 504 Gateway Time-out`

因为一般源码库经过长期的迭代，都是一个巨无霸的存在，所以你不要`clone`全部的代码，只需要指定获取最新的一次 `commit` 即可，通过指定 `--depth=1`就可以达到这个效果。

```
git clone --depth=1 xxxx
```

如果你只需要看某个版本，或者某个分支，可以像下面这样指定。

```
git clone -b xxx --depth=1 xxxx
```

#### 3.1.2 在线查看

如果你看的源码库不太复杂，你也可以选择在线查看, 当然不是 `github` 上面，那样太慢了。可以装一个叫做 `Gitpod Online IDE`的插件。

![image-20200420232349711](https://s3.qiufengh.com/blog/image-20200420232349711.png)



![image-20200420232418856](https://s3.qiufengh.com/blog/image-20200420232418856.png)

然后会在 clone 的地方多出一个小按钮，点击后。







### 3.2.看贡献指南





阅读前当前是拉取项目

需要注意 --depth

安装依赖

npm 和 yarn 是不一样的，需要特别注意





## 4.如何阅读源码以element-ui为例

### 4.1 快速起步

首先来看 `package.json`

```json
"scripts": {
		...
    "bootstrap": "yarn || npm i",
    "build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js",
    "dev": "npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js",
    "dev:play": "npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js",
    "dist": "npm run clean && npm run build:file && npm run lint && webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js && npm run build:utils && npm run build:umd && npm run build:theme",
    "test": "npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ BABEL_ENV=test karma start test/unit/karma.conf.js --single-run",
   	...
},
```

吧啦吧啦，有一堆的命令，但是我们不需要知道所有的，我们只需要知道怎么让这个项目跑起来，哦，常用的不就是

### 4.2 调试代码

### 4.3 目的驱动

### 4.4 了解生态





首先我们需要让这个项目跑起来



目录结构输出 `tree -L 2 ./ -I "node_modules|types"` 省去了一些不重要的部分。

```
├── build // 构建相关的脚本
├── components.json  // 映射json，用于按需加载的包
├── examples     // 使用示例
├── package.json  
├── packages 
│   ├── ...componments // 组件
│   ├── theme-chalk    // 组件样式
├── src							 //公共模块
│   ├── directives
│   ├── index.js
│   ├── locale
│   ├── mixins
│   ├── transitions 
│   └── utils				
├── test			 // 测试用例
│   ├── ssr
│   └── unit
```



框架



看 package.json -> 看 script 脚本 -> 



5.参考

 https://www.zhihu.com/question/19940741/answer/64032790