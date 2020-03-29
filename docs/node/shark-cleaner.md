# shark-cleaner: 一个Node Cli 实现的垃圾清理工具(深层清理开发垃圾)

## 前言

![1584517625611](https://s3.qiufengh.com/blog/1584517625611.jpg)

就是这个恶毒的提示，太让我烦恼了，一开始我用了腾讯的 lemon 清理工具，但是发现他并不能很好地解决我的问题，没有办法完全找出我的缓存文件。由于本人是 256G Mac （穷....），真的，256G 太不够用了（当然不是因为我....的原因），俗话说贫穷限制了我的想象力，但是没有限制我的创造力。另一点，就是本人是个写前端的，通过对本地的`node_modules` ， `npm` ，`yarn cache` 等缓存的分析，发现让我大吃一惊，几十G的缓存。

基于以上前提，我就开发了一个工具，名字叫 [shark-cleaner](https://github.com/hua1995116/shark-cleaner)，寓意就是想让它想鲨鱼一样，快速！能够快速找出我本地文件中的软件开发缓存。

这是它已经为我清理出的`node_modules`垃圾。

![1584506218384](https://s3.qiufengh.com/blog/1584506218384.jpg)

## 技术方案

### 社区现状

#### 1.直接命令行

 **Mac / Linux:**

```bash
$ cd documents
$ find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \;
```

**Windows:**

```bash
$ cd documents
$ FOR /d /r . %d in (node_modules) DO @IF EXIST "%d" rm -rf "%d"
```

**Powershell Users:**

```bash
Get-ChildItem -Path "." -Include "node_modules" -Recurse -Directory | Remove-Item -Recurse -Force
```

#### 2.命令行工具

https://github.com/voidcosmos/npkill

### 我的技术方案

社区有一些相关的方案，但是我想的是能够提供一个可视化的，跨平台的，并且有详细颗粒度信息的工具。

一开始我想的是 `electron`来做这件事是比较合适的，但是我想等不及想要更加快速的开发，想着是先用命令行代替。（其实核心功能实现后，迁移到 `electron` 还是很方便的）。

因此我采用了一种 `web + node cli `  的方式。下面是工具的主架构，有点类似于` electron` 的思路吧

![image-20200323183613601](https://s3.qiufengh.com/blog/image-20200323183613601.png)

## 功能实现

视频展示地址: https://s3.qiufengh.com/shark-cleaner/shark-cleaner.mp4

### 自定义目录扫描

如果你的项目都在一个目录下，建议填写你的项目主目录，这样会大大加快扫描的速度。

<img src="https://s3.qiufengh.com/shark-cleaner/shark-init.jpg" width="300"/>

<img src="https://s3.qiufengh.com/shark-cleaner/shark-scanner.jpg" width="300"/>



<img src="https://s3.qiufengh.com/shark-cleaner/shark-computed.jpg" width="300"/>

### 支持静态目录扫描

由于一些目录是固定的，因此为静态列表扫描方式。

![image-20200323201436758](https://s3.qiufengh.com/blog/image-20200323201436758.png)

### 支持详情查看

获取 `package.json` 中的 `author` 和 `description` 进行展示，以及标注完整路径，可以帮助回忆，来确定是否删除。

![image-20200323201418168](https://s3.qiufengh.com/blog/image-20200323201418168.png)

### 支持多选

文件太多了？shift + click 来支持多选模式。

![2020-03-23-20.22.19](https://s3.qiufengh.com/blog/2020-03-23-20.22.19.gif)

### i18n支持

国外用户也可以轻松享受到这个工具带来的遍历

![image-20200323202346856](https://s3.qiufengh.com/blog/image-20200323202346856.png)

![image-20200323202329590](https://s3.qiufengh.com/blog/image-20200323202329590.png)



## 如何使用

```bash
npm install -g shark-cleaner

shark
```

## TODO

1.主流语言的缓存路径支持（包括但不限`Go` 、`Python`、`Java`等）

2.Node 缓存部分的完善（包括yarn、npm）

3.Electron客户端的支持

4.支持按照时间维护来推测清理（例如某个项目1个月未修改来识别需要清理缓存，提高识别垃圾的准确性。）

5.完善的错误提示（文件清理失败等）

6.logo设计

7.统计已经帮助用户清理的垃圾

8.清理历史记录，帮助用户能够快速下回删除的依赖包。



## 最后

该工具是我断断续续写了一周完成的，不免有许多`Bug`，如果使用过程有问题请以 `Github Issues` 方式提给我，我会尽量在第一时间进行介入。初衷是，希望它能成为`一款专为程序员定制的清理垃圾工具`。如果你知道语言缓存目录，请求 pr 或者 Issues 方式提给我。

感谢大家，如果觉得该工具对你起到了作用，请不要吝啬你的 `star`。(当然非常欢迎感兴趣的小伙伴来贡献代码呀) T T 你们的 `star` 是对我最大的鼓励，让我有足够的动力去不断维护它，迭代它，然后，让你们的开发环境变得更美好，更加整洁。

Github地址: https://github.com/hua1995116/shark-cleaner

