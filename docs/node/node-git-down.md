# 对症下药，快速下载github单个文件夹

# 瞎扯淡的前言

前几日遇到一个比较麻烦的事情，刚好周末有时间，不知道大家是否和我一样，在github阅读源码的时候，只想看他的src目录，当然在github上面阅读非常的麻烦，各种快捷都用不了，函数跳转，全局搜索….等等。但是。。。

关键来了，很有源码整个项目都非常的大，介于github网速不好的情况下，我都得等好久才把资源下载下来，但是我只需要看某个文件夹，这不是资源的浪费吗？而且非常影响自己追求知识的心。对！(假装认真脸。我这么想学习，你还给我整一个仓库，还得让我找对应的文件，真的好麻烦。)

本着不重复造轮子的心态，我先在查阅了现有的插件是否可以实现这个功能，如果有我就可以很愉快的使用了，我也不需要再来造个轮子。

看了知乎上面火热的讨论，但是感觉方法依旧是非常的麻烦。好不容易看到排名第一的实现方案，但是loading一直等待中，最终还是没实现自己想要的方案。

[如何从 GitHub 上下载单个文件夹？](https://www.zhihu.com/question/2536941)

然后再看了看chrome插件（[Octotree](https://chrome.google.com/webstore/detail/octotree/bkhaagjahfmjljalopjnoealnfndnagc)）

这个插件能显示树状github目录，还提供了单个文件的下载。但是我要的是文件夹啊。。。单个文件github本身就提供这个功能。心态有点崩溃，找了半天找不到啊。

# 重点

咳咳，重点。鉴于以上的调研以及自己遇上的问题，然后撸了一个node小工具。

[https://github.com/hua1995116/git-down-repo](https://github.com/hua1995116/git-down-repo)

使用方式，很简单，拥有node环境就好

```Shell
npm install git-down-repo -g // 安装全局

gitdown https://github.com/hua1995116/webchat/tree/master/config // 下载单个文件夹
```

# 功能（默认下载到本地执行目录）

```gitdown url```

url 替换成github上的url，例子如下：

- 下载整个仓库（默认master）

```gitdown https://github.com/hua1995116/webchat  ```

- 下载某个仓库的dev分支

```gitdown https://github.com/hua1995116/webchat dev ```

- 下载仓库单个文件夹

```gitdown https://github.com/hua1995116/webchat/tree/master/config ```

- 下载单个文件

```gitdown https://github.com/hua1995116/webchat/blob/master/config/dev.env.js  ```



# 结语

- 如果觉得对你有帮助可以给我的小工具点个star([https://github.com/hua1995116/git-down-repo](https://github.com/hua1995116/git-down-repo))
- 如果你觉得没有用或者有啥意见可以提[issue](https://github.com/hua1995116/git-down-repo/issues)给我，我会继续改进，包你满意（斜眼笑)