# 在 vscode 中写 Markdown 如何装X

之前写 md 文档都是用的 Typora ,这款编辑器很简洁方便, 但是在处理图片的时候有点蛋疼，当然你可以用付费插件自动上传，但是秉着勤俭节约的特质，我就逛了逛了其他方案。然后发现其实用 vscode 写 Markdown 也非常爽啊。

# 主题插件

这一步其实很重要，毕竟写文章，一方面是写的好，另一方面是排版好看清楚，可以说 Github 主题的 md 渲染方式是个人最喜欢的了，简洁清爽又不失专业。

[Markdown Preview Github Styling](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles)

![](https://s3.qiufengh.com/blog/1568533451215.png)

# 图片自动工具

[PicGo](https://marketplace.visualstudio.com/items?itemName=Spades.vs-picgo)

这是一款 vscode 插件，支持快捷键将你的图片上传到远端，默认用的是图床 [sm.ms](https://sm.ms/)（免费的）。 但是个人建议配置自己的七牛云  存储或者阿里云等。毕竟自己的东西更加安全可靠一些。

支持截图上传，本地上传等方式直接转化成线上地址，无需手动在图床上传再来回粘贴。

![](https://s3.qiufengh.com/blog/1568533450833.gif)

# 录制 Gif 工具

强烈推荐 [Gifox](https://gifox.io/) 。当然还有 [Kap](https://getkap.co/)，这个生成的gif太大了。

这是一款高颜而且高质量的 Gif 生成工具, 一般生成的 gif 只有几百 k。 我[这篇文章](https://juejin.im/post/5c4454146fb9a04a0164a289)基本上的 gif 图只有 100k 左右。

![](https://s3.qiufengh.com/blog/1568533450950.png)

# 目录以及快捷键

[Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)

支持以下功能 + 快捷键

按下 shift + command + p 可以查看。

![1548070992634.jpg](https://s3.qiufengh.com/blog/1568533450911.jpg)



| Key                                               | Command          |
| ------------------------------------------------- | ---------------- |
| <kbd>Ctrl</kbd> + <kbd>B</kbd>                    | 切换粗体         |
| <kbd>Ctrl</kbd> + <kbd>I</kbd>                    | 切换斜体         |
| <kbd>Alt</kbd> + <kbd>S</kbd>                     | 切换下划线       |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>]</kbd> | 标题升级         |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>[</kbd> | 标题降级         |
| <kbd>Ctrl</kbd> + <kbd>M</kbd>                    | 切换数学环境     |
| <kbd>Alt</kbd> + <kbd>C</kbd>                     | 选中/不选中任务  |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> | 切换预览         |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> <kbd>V</kbd>       | 将预览切换到侧边 |

# 截图工具

qq/微信自带的快捷功能即可。

当然如果你想要这种高大上的截图，带阴影的。

![linec1](https://s3.qiufengh.com/blog/1568533450896.png)

这个其实是 Mac 自带的功能。

Command + Shift + 3

这个组合键可以将当前屏幕的整个图像截取下来，然后以「屏幕快照 + 日期」的编号形式命名，并自动以.PNG 格式保存到桌面。

Command + Shift + 4

这个组合键可以截取当前屏幕上任意一块区域的图像，按完组合键即可松手，然后鼠标自动变为一个标准器，当你移动光标（用鼠标单击拖动或是在触控板上三指同时拖动）选择截取区域时，旁边会出现一个即时变化的长宽像素数值，确定后松开手势（或鼠标）即可完成截图。同样，这种操作以「屏幕快照 + 日期」的编号形式命名，并自动以.PNG 格式保存到桌面。

Command + Shift + 4 + Spacebar

如果你想完整的截取屏幕上某一个窗口的图像，可以先按完 Command + Shift + 4 的组合键，然后按下空格键（或者 Command + Shift + 4 + 空格键同时按下），光标会自动变成一个照相机图标，此时所有区域处于蒙版状态，将光标移动到目标窗口单击即可完成截图。

如果你不选择任何窗口，只是把光标放在桌面上，单击就会自动截取整个背景壁纸的图像，注意，是背景壁纸。同样，这种操作以「屏幕快照 + 日期」的编号形式命名，并自动以.PNG 格式保存到桌面。


# 特效

代码的阴影: https://carbon.now.sh/ （装 X 必备）

![code-github.png](https://s3.qiufengh.com/blog/1568533451280.png)


# 移动端套壳

![1548073669419.jpg](https://s3.qiufengh.com/blog/1568533450937.jpg)

Android、iOS、Window各种壳。

https://mockuphone.com/

生成的图片较大, 这张图约为1.7M。所以需要后面的图片压缩。

![iphonex_landscape.png](https://s3.qiufengh.com/blog/1568533451144.png)



# 图片压缩

[Tinypng](https://tinypng.com/)  可以看到效果巨明显。

![1548073057845.jpg](https://s3.qiufengh.com/blog/1568533450939.jpg)


# 写到最后

大家就可以开心地装X了，有了这么些强大的工具，嗯，真香。

推荐阅读： [pkg版本规范管理自动化最佳实践](https://juejin.im/post/5c4454146fb9a04a0164a289)

# 友情链接

[蓝色的秋风](https://github.com/hua1995116) [无影er](https://github.com/renjie1996)

# 参考

https://www.ifanr.com/app/546621

# 更多请关注

![](https://s3.qiufengh.com/blog/erweima.jpg)