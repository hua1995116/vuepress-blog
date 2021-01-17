# 这个插件居然让vscode变成了交友工具(以码会友)

也许有了这款插件你就能找到这样子的女朋友了。

![1607829213979](https://s3.qiufengh.com/blog/1607829213979.jpg)

事情到底是怎么样子的呢？最近看到别人发了一款~~交友的软件~~（ VSCode 插件）。

![1607827977440](https://s3.qiufengh.com/blog/1607827977440.jpg)

看着这个熟悉的动画... 这不就是探探的那个交互动画嘛。好家伙，有点东西啊。

然后我就迫不及待地在 VSCode 搜索这个插件 `vsinder`。

![1607827150611](https://s3.qiufengh.com/blog/1607827150611.jpg)

![image-20201213113724228](https://s3.qiufengh.com/blog/image-20201213113724228.png)

立马对 VSCode 进行升级

突然又爆了一个错误。

> Could not create temporary directory: Permission denied

纳尼。没有什么能够阻挡我交友的步伐(啊,不... 是学习的步伐)

一番谷歌后，发现是因为某个目录没有权限。

```
> ll ~/Library/Caches | grep VSCode
drwxr-xr-x    5 xxxx  staff   160B Dec 13 10:33 com.microsoft.VSCode
drwxr--r--    2 root       staff    64B Aug 27 14:06 com.microsoft.VSCode.ShipIt
```

因此需要 `com.microsoft.VSCode.ShipIt` 授权。

利索地敲下以下代码。

```
sudo chown $USER ~/Library/Caches/com.microsoft.VSCode.ShipIt
```

然后将 VSCode 升级到了最新版本。

![image-20201213112628994](https://s3.qiufengh.com/blog/image-20201213112628994.png)

然后回到安装界面进行安装，过了一会，左侧就会出现这样一个图标。

![image-20201213112513902](https://s3.qiufengh.com/blog/image-20201213112513902.png)

使用 Github 进行登录。

![1607828259083](https://s3.qiufengh.com/blog/1607828259083.jpg)

登录完了之后会让你填写一些基本信息。

![1607828328158](https://s3.qiufengh.com/blog/1607828328158.jpg)

然后再写一个代码片段去展现自己。

![1607828460392](https://s3.qiufengh.com/blog/1607828460392.jpg)

作为打工人的我，默默地写下了....

```js
console.log(rich) // rich is not defined
```

然后就可以开始左右滑块去交友了。点击 `start swiping`

![1607828689337](https://s3.qiufengh.com/blog/1607828689337.jpg)

效果图如下

![2020-12-13-11.07.1](https://s3.qiufengh.com/blog/2020-12-13-11.07.1.gif)

一匹配成功，你就可以和对方聊天。。。我暂时没有成功，就放一下作者的截图

![1607828960861](https://s3.qiufengh.com/blog/1607828960861.jpg)

看作者的表情就可以知道，聊得很欢乐。

如果你想要在下班路上继续保持这个~~交友~~学习的状态。作者还写了[iOS](https://apps.apple.com/us/app/vsinder/id1542523079?itsct=apps_box&itscg=30200) 和 [Android](https://play.google.com/store/apps/details?id=com.benawad.vsinder) 版本。

心动了吗，心动了吗，心动了吗，趁着周末，快去以码会友吧！



