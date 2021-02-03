# pkg版本规范管理自动化最佳实践

# 前提

何为版本？版本即语义版本控制（ Semantic version 后面简称为 SemVer ）是一种版本控制系统，在过去几年中一直在不断发展。 随着每天都在构建新的插件，插件，扩展和库，拥有通用的软件开发项目版本化方法是一件好事，可以帮助我们跟踪正在发生的事情。

SemVer 的格式式为 x.y.z，其中：

x代表主要版本( Major )

y代表次要版本( Minor )

z代表补丁( Patch )

## SemVer如何工作？

通过 SemVer 来确定你应该发布的版本类型是很简单的。

如果你修复 bug 或者一些细节修改，那么这将被归类为补丁，在这种情况下你应该升级z。

如果你以向后兼容的方式实现新功能，那么你将升级y，因为这就是所谓的次要版本。

另一方面，如果你实现了可能破坏现有API的新东西，你需要升级x，因为它是一个主要版本（ Major ）。想要了解更多请看后面的<更多须知>。

# 开始

语义化的版本控制对应用来说是非常重要的，当然，让版本升级就变成了一件看似不重要却非常重要的事情，在我们开发过程中，或者你遇到过这样的情况？

- 由于版本控制概念模糊或者忘记，build 完应用都是随便改的版本或者是完全忘记修改版本。
- 每次 build 完需要改版本太麻烦，懒得改。

基于这样的场景下，我开发了这款自动版本升级管理工具 [auto-vers](https://www.npmjs.com/package/auto-vers)

github: https://github.com/zerolty/auto-version

# 相同库比较

|项目 | [npm-auto-version](<https://github.com/yahoo/npm-auto-version>) | [update-version](<https://www.npmjs.com/package/update-version>) | [auto-vers](https://github.com/zerolty/auto-version) |
| --------  | -----: | :----: |       :----: |
| git tag   | 支持  | 不支持 |     支持 |
| 自动更新   | 不支持  | 支持 |     支持 |
| 提示更新   | 不支持  | 不支持 |     支持 |

# 手动与auto-vers比较

下面是我们需要手动改（前提需要知道改成什么，并且不能忘记修改！）
![auto-vers-manual.gif](https://s3.qiufengh.com/blog/1568533450852.gif)


下面是使用了auto-vers的方式。

![auto-vers-auto.gif](https://s3.qiufengh.com/blog/1568533451244.gif)

# 拥有的功能

- [x] 更新 major, minor, patch, premajor, preminor, prepatch or prerelease
- [x] 在更新时候提示选择
- [x] 支持git tag方式
- [ ] 根据git commit的信息来自动推荐合适的版本

# 使用
Node 和 Cli两种引入方式。

```shell
npm i auto-vers -g 
```

## Cli

### 基础模式


```shell
cat package.json
{
    ...
    "version": "1.0.0"
    ...
}
```

```
auto-vers -i
```


```shell
cat package.json
{
    ...
    "version": "1.0.1"
    ...
}
```

### 确认模式

```
auto-vers -i -c
```
![auto-vers-confirm.gif](https://s3.qiufengh.com/blog/1568533450891.gif)


### 提示模式

```
auto-vers -t
```
![auto-vers-tip1.gif](https://s3.qiufengh.com/blog/1568533450886.gif)

如果你不想更新 , 你可以使用 `ctrl` + `c` 去停止。

### 提示和Git组合模式

使用这个选项后，在你选择一个版本后，会自动帮你提交一个commit，并且打上一个tag。

```
auto-vers -t -g 
```

### 直接更改模式

```
auto-vers 1.2.0 
```
or 
```
auto-vers -v 1.2.0 
```
![auto-vers-direct.gif](https://s3.qiufengh.com/blog/1568533450988.gif)



options
```shell
auto-vers 1.0.0

Auto update version for your application
Usage: auto-vers [options] <version> [[...]]

Options
-v --version <version>
        Can update version directly.
-i --inc --increment [<level>]
        Increment a version by the specified level. Level can
        be one of: major, minor, patch, premajor, preminor
        , prepatch or prerelease. Default level is 'patch'.
        Only one version may be specified.
-e --extra [<value>]
        This is for prerelease extra data
        Such as 'beta','alpha'
-c --confirm
        Do not update the version directly, you can confirm.
        This is a safe mode.
-t --tip
        Provide choice to you. If you don't know how to update
        you can choose this option.
-g --git
        Help you make a tag.(Make you have a git repo)
```

# 最佳实践

> 在你打包完你的项目同时运行这个命令是一个非常好的选择。

## 基础的方式

```json
"script": {
    "build": "babel ./src --out-dir ./dist",
    "tip": "npm run build && auto-vers -t",
    "version": "npm run build && auto-vers -t -g",
}
```

在你写好一段打包命令后，紧接着跟上`auto-vers -t`，将会给你提示需要升级至多少版本，这对你来说会有一定的指示意义。帮助你更好地区判断你需要升级至什么版本。`auto-vers -t -g` 这个命令适合于你单独发布一个版本，可以一键式的帮助你从修改 package.json -> git commit -> git tag -> git push origin [tagname] 整个流程。

## 中级的方式

```json
"script": {
    "build": "babel ./src --out-dir ./dist",
    "patch": "npm run build && auto-vers -i -c",
    "minor": "npm run build && auto-vers -i minor -c",
    "major": "npm run build && auto-vers -i major -c",
    "beta": "npm run build && auto-vers -i prerelease -c",
}
```

这个方式针对熟悉这个模式的人，每次需要打包只需要执行对应的命令。(增加参数`-c --confirm`,这是一个安全的方式去升级，帮助你确认是否升级正确，如果对你而言是一个繁琐的步骤即可去掉。）

## 高级的方式

`git-hooks`

如果你没有注册`pre-commit`和`post-commit`，可以直接移动进你的.git/hooks目录下

```
mv githook-*/*  .git/hooks/
```

如果你本地存在hooks，将项目下的hook，手动添加到你的hook下

```
cat githook-*/pre-commit >> .git/hooks/pre-commit
```

当你提交 commit 的时候，会自动跳出选择界面，选择后升级对应的版本。 （注意：如果在你的程序中有相关 commit 命令，请使用`--no-verify`来跳过此钩子，否则将循环调用）

# 更多须知

## 为什么选择SemVer

> 因为不规范的版本号基本上没有任何意义。从`4.1.0` 升级`4.2`？ 好的。 为什么？ 为什么不是`5`？ 为什么不是`4.1.1`？ 为什么不是`4.11`？ 为什么不是`4.1.0-aplha.0`？

> 严格的指导原则有助于为版本号提供意义。例如，如果您看到版本`1.3.37`，那么您将知道这是第一个主要版本，但已经有3个次要版本带来了新功能。 但是，您还会注意到这是此次要版本中的第37个补丁，这意味着涉及很多错误（很少或很大）。

> 它还有助于管理依赖关系，`"babel-cli": "~6.26.0",` 我们引入了`babel-cli`, 可以得知他的版本是`6.26.0`，他会锁定`x,y` 这是一种比较保守的方式, 根据规则可以得知，z的升级不会导致我们api重大的改变以及引入新的功能,。但是如果`babel-cli`不遵循 SemVer , 在升级z的时候引入了破坏性的变化，这会使得我们的应用出现bug或者变得不可用。正是因为有了 SemVer 的规范，使得我们能够放心地锁定 x,y, 让 z 可以自动升级，因为 z 的升级可能会修复一些小 bug 或者一些细节的改进, 在不破坏我们的应用同时能够对已知bug进行修复。

## 更多技巧

既然你已经知道 SemVer 是什么以及自动更新的方法，那么讲一些更新的时候注意事项吧。

**开始于0.1.0**

使用SemVer时需要注意的一点是它从`0.1.0`开始，而不是像我们想象的那样从`0.0.1`开始。这是有道理的，因为我们不是从补丁开始，而是从一组功能开始，作为项目的初稿，因此版本为`0.1.0`。


**在1.0.0之前只是开发阶段**

每当你构建一个新的软件时，总会有一个迷茫阶段，你一直在问自己：我什么时候应该发布第一个正式的主要版本？

以下是一些帮助你回答这个问题的提示：如果您的应用已经在生产中使用或者用户依赖于它，那么你应该已经达到了`1.0.0`。此外，如果你有打破当前的API，这同样表示你需要升级你的主版本号了。

否则，请记住`1.0.0`以下的版本基 本上是开发热潮时期，你专注于完成你的功能。在`1.0.0`之前，你不应该害怕任何破坏性的功能，这样当达到`1.0.0`时，它就会稳定。

**关于预发布pre-realease**

在部署主要版本之前，你通常会经历大量需要一次又一次测试的工作，以确保一切正常。 

使用SemVer，可以通过在版本中附加标识符来定义预发布。 例如，版本`1.0.0`的预发行版可能是`1.0.0-alpha.1`。 然后，如果需要另一个预版本，它将变为`1.0.0-alpha.2`，依此类推。

# 总结

通过了上面的基础介绍，如果你没有使用 SemVer ，没有理由不在你的下一个项目（或当前项目？）上使用它。 它不仅有助于你的项目版本变得有意义，而且还有助于其他可能将你的项目用作依赖项的人。说了这么多，最终还是希望大家能够更加规范地开发项目不仅帮助他人，而且有利于自己。可能我开发的这个项目不是那么完美，但是初衷是来提高大家规范的效率。有bug请多多指出，有功能上的问题也请直言不讳。

# 友情链接

[蓝色的秋风](https://huayifeng.top/) 
[无影er](https://github.com/renjie1996/Maple-FrontEnd-Blog)

# 参考

https://medium.com/fiverr-engineering/major-minor-patch-a5298e2e1798

https://www.sitepoint.com/semantic-versioning-why-you-should-using/

# 更多请关注

![](https://s3.qiufengh.com/blog/gongzhonghao.png)