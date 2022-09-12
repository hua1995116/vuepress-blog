# AI 数字绘画 stable-diffusion 保姆级教程

## 简介

近段时间来，你可能在不少地方都看到了非常多这样的好看的画。

比如这样的赛博朋克风

prompt: Cyberpunk, 8k resolution, castle, the rose sea, dream

![yuantu.png](https://s3.mdedit.online/blog/B3HQRQMPsY52Q3tp.png?imageView2/0/format/webp/q/75)

水墨画风格

prompt: a watercolor ink painting of a fallen angel with a broken halo wielding a jagged broken blade standing on top of a skyscraper in the style of anti - art trending on artstation deviantart pinterest detailed realistic hd 8 k high resolution

![](https://s3.mdedit.online/blog/wfWpR6c6tJe6JtmR.jpg?imageView2/0/format/webp/q/75)

油画

prompt: portrait of bob barker playing twister with scarlett johansson, an oil painting by ross tran and thomas kincade

![](https://s3.mdedit.online/blog/i265BYKrNiXifjxz.jpg?imageView2/0/format/webp/q/75)

水彩画

prompt: a girl with lavender hair and black skirt, fairy tale style background, a beautiful half body illustration, top lighting, perfect shadow, soft painting, reduce saturation, leaning towards watercolor, art by hidari and krenz cushart and wenjun lin and akihiko yoshida

![](https://s3.mdedit.online/blog/GTadPf25DyfhWwyG.png?imageView2/0/format/webp/q/75)

并且在各种平台我们也是随处可见，以下分别为小红书、闲鱼、twitter

![yuantu-2.png](https://s3.mdedit.online/blog/Nbx6zppmEQGpxcMT.png?imageView2/0/format/webp/q/75)

这些图都很像是艺术家画的一样，但是他们却不是出自真正的的艺术家之手，而是 AI 艺术家。AI 就像 16 年打败李世石进军 围棋行业一样，开始进军艺术届了。

我们来看看 AI 绘画 发展的比较关键的时间线

- Disco Diffusion 是发布于 Google Colab 平台的一款利用人工智能深度学习进行数字艺术创作的工具，它是基于 MIT 许可协议的开源工具，可以在 Google Drive 直接运行，也可以部署到本地运行。

Disco Diffusion 有一个弊端，就是速度非常慢，动辄 半个小时起步。

- Midjourney 是 Disco Diffusion 的原作者 Somnai 所加入的 AI 艺术项目实验室。

Midjourney 对 Disco Diffusion 进行了改进，平均 1 分钟能出图。

- OpenAI 推出 DALL·E 2, DALL-E 2 实现了更高分辨率和更低延迟，而且还包括了新的功能，如编辑现有图像。

目前还没有按到 DALL·E 2 的体验资格。

- [stability.ai](http://stability.ai) 推出 Stable-Diffusion 并且开源了

一经推出就受到广大网友的喜爱，操作简单，出图快，平均 10-20 秒。

Stable-Diffusion 免费、生成速度又快，每一次生成的效果图就像是开盲盒一样，需要不断尝试打磨，所以大家都疯狂似的开始玩耍，甚至连特斯拉的前人工智能和自动驾驶视觉总监 Andrej Karpathy 都沉迷于此。

![](https://s3.mdedit.online/blog/KftKRrayaBdTi7J8.png?imageView2/0/format/webp/q/75)

而 [stability.ai](http://stability.ai) 却是一个年轻的英国团队

![](https://s3.mdedit.online/blog/hE7fh6sPGFaJpRaY.png?imageView2/0/format/webp/q/75)

他们的宗旨为 “\***\*AI by the people, for the people” ，\*\***中文翻译的大意为，人们创造 AI，并且 AI 服务于人，除了 stable-diffusion 他们还参与了众多的 AI 项目

![](https://s3.mdedit.online/blog/t7CcB3cfBXscmGkC.png?imageView2/0/format/webp/q/75)

今天主要介绍的就是 stable-diffusion 的玩法，官方利用 stable-diffusion 搭建的平台主要是 [dreamstudio.ai](http://dreamstudio.ai) 听这个名字就感觉很牛，梦幻编辑器（自己取得，勿喷，因为生成的图都很梦幻），你也可以自己使用 colab 来本地运行，下面就来详解介绍这两种方式

## 使用方式

### 1.官网注册账号

打开 [https://beta.dreamstudio.ai/](https://beta.dreamstudio.ai/) 选择一种注册方式，我这里使用了 Google 账号登录（后面也有相关的教程来教你如何来注册一个 Google 账号），你也可以选择自己的方式。

![](https://s3.mdedit.online/blog/bwih24SG2KYDYCym.png?imageView2/0/format/webp/q/75)

注册好后，就可以进入到这个界面。

![](https://s3.mdedit.online/blog/WH54N3wKGXP2s4Tb.png?imageView2/0/format/webp/q/75)

你可以直接在下方输入名词，也可以在打开右侧的设置按钮，里面会更详细的配置。

![](https://s3.mdedit.online/blog/fwEymHdCDkGbehxb.png?imageView2/0/format/webp/q/75)

输入好关键词后，直接点 `Dream` 按钮，等待 10 秒左右就可以生成图片。

![](https://s3.mdedit.online/blog/mhfb73RfpPp4SEW6.png?imageView2/0/format/webp/q/75)

当然这样的生成方式非常的方便，但是是有次数限制的。

![](https://s3.mdedit.online/blog/sttxtDw4KmdWC7yD.png?imageView2/0/format/webp/q/75)

可以看到右上角的点数，默认你注册账号会有 200 点点数，每次生成一张默认设置的图片就会消耗一个点数，如果你要生成更多的方式就需要付费了， 10 英镑 1000 点数。

![](https://s3.mdedit.online/blog/axjJf4YMpiR2p3QS.png?imageView2/0/format/webp/q/75)

如果你想获得更高精细程度的图片，单次则需要消耗更多的点数。以下是官方给出的价格表：

![](https://s3.mdedit.online/blog/2Qw8c4hsMaZQfZZJ.png?imageView2/0/format/webp/q/75)

而且使用这种方式，你生成图片的版权是自动转为为 CC0 1.0，你可以商用或者非商用你生成的图片，但是也会默认成为公共领域的资源。

![](https://s3.mdedit.online/blog/jC3JXepQM6RPGTxD.png?imageView2/0/format/webp/q/75)

### 2.使用 Colab（推荐）

这一种是我比较推荐的方式，因为这种方式你可以几乎无限地使用 Stable Diffusion，并且由于这种方式是你自己跑模型的方式生成的图片，版权归属于你自己。

Colab 是什么呢？

> Colaboratory 简称“Colab”，是 Google Research 团队开发的一款产品。在 Colab 中，任何人都可以通过浏览器编写和执行任意 Python 代码。它尤其适合机器学习、数据分析和教育目的。从技术上来说，Colab 是一种托管式 Jupyter 笔记本服务。用户无需设置，就可以直接使用，同时还能获得 GPU 等计算资源的免费使用权限。 —— [https://research.google.com/colaboratory/faq.html?hl=zh-CN](https://research.google.com/colaboratory/faq.html?hl=zh-CN)

由于 Colab 是 Google 的产品，因此你使用前**必须要拥有一个 Google 账户**，如果不知道怎么注册的划到最底下的 Google 账号注册教程。

而我们目前默认使用的是 Hugging face 开源的 colab 示例。

> Hugging face 是一家总部位于纽约的聊天机器人初创服务商，开发的应用在青少年中颇受欢迎，在上面存储了大量的模型，而 [Stability.ai](http://stability.ai/) 的 Stable \*\*\*\*Diffusion 也是开源在上面。

打开链接： [https://colab.research.google.com/github/huggingface/notebooks/blob/main/diffusers/stable_diffusion.ipynb](https://colab.research.google.com/github/huggingface/notebooks/blob/main/diffusers/stable_diffusion.ipynb)

打开后，点击右上角的连接。

![](https://s3.mdedit.online/blog/hBNiFdiEDsH8DPCm.png?imageView2/0/format/webp/q/75)

点击确定

![](https://s3.mdedit.online/blog/wNT7eQTPCjTpSAcN.png?imageView2/0/format/webp/q/75)

等连接上后我们运行第一段脚本，就是查看当前使用的机器。一般是从 K80、T4、P100、V100 中随机分配一个。

我拿到的是一个 Tesla T4 GPU 的机器，这里比较看人品。如果你拿到一个 V100 的一定要发一波炫耀一下。

![](https://s3.mdedit.online/blog/dBFJsJwej6iAiYFN.png?imageView2/0/format/webp/q/75)

然后继续跑下面的命令，安装必要的依赖，每次安装完成后，都会显示运行时间以及运行状态。

![](https://s3.mdedit.online/blog/r5HW7Zi2d6FYXQzJ.png?imageView2/0/format/webp/q/75)

![](https://s3.mdedit.online/blog/tDG5MctHKBn4BFfA.png?imageView2/0/format/webp/q/75)

运行到这一步，会要求你填写一个 huggingface_hub 的 token 链接

![](https://s3.mdedit.online/blog/ArrjTwZAFGHRNCJY.png?imageView2/0/format/webp/q/75)

来到 [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) 这个页面，如果没有登录默认会调到登录页

![](https://s3.mdedit.online/blog/PHha8eQmaJHXBEpD.png?imageView2/0/format/webp/q/75)

注册一个账号后，复制这个 Token 到 Colab 页面

![](https://s3.mdedit.online/blog/GGE2pyaKierB37Jc.png?imageView2/0/format/webp/q/75)

然后会提示你登录成功了，如果提示异常应该是你复制错了，这个时候你得点开秘钥，手动复制一下。

![](https://s3.mdedit.online/blog/WnBzPXQaeJEmyRwB.png?imageView2/0/format/webp/q/75)

然后接下来我们就开始拉取模型

![](https://s3.mdedit.online/blog/NDsW8eSAsNTJfdWT.png?imageView2/0/format/webp/q/75)

注意，这里你直接先运行，是会报错了，会显示 403

```jsx
{"error":"Access to model CompVis/stable-diffusion-v1-4 is restricted and you are not in the authorized list. Visit https://huggingface.co/CompVis/stable-diffusion-v1-4 to ask for access."}
```

这是因为你没有去 huggingface 授权访问。

打开 [https://huggingface.co/CompVis/stable-diffusion-v1-4](https://huggingface.co/CompVis/stable-diffusion-v1-4)

![](https://s3.mdedit.online/blog/4yD4NjTa6esNmkTz.png?imageView2/0/format/webp/q/75)

点击 运行这个仓库，然后再回到 Colab 就可以正常拉取模型了。

最后就到了激动人心的时候了，开始生成图片，运行以下两个步骤，prompt 就是描述，你可以输入任何你想输入的话语。

![](https://s3.mdedit.online/blog/5KQMyifGPAdzCf5z.png?imageView2/0/format/webp/q/75)

用官方默认的 prompt 点击运行就会生成一张宇航员骑马的照片（大约 20 秒左右）

![](https://s3.mdedit.online/blog/QQjk64HDN6t6CQ7i.png?imageView2/0/format/webp/q/75)

nice，这个就是我生成的图片。

以上基础的教程就完成了，后面还可以设置更多丰富的参数。

设置随机种子（先快速生成低质量图片看看效果，然后再调高画质）

![](https://s3.mdedit.online/blog/zsjpwbFtXM37BYh7.png?imageView2/0/format/webp/q/75)

调整迭代次数

![](https://s3.mdedit.online/blog/GD375kFXzrPNnJmR.png?imageView2/0/format/webp/q/75)

多列图片

![](https://s3.mdedit.online/blog/fF8yAFiK2GyNTMzQ.png?imageView2/0/format/webp/q/75)

设置宽高

![](https://s3.mdedit.online/blog/GMfczJXmGzxwrXcE.png?imageView2/0/format/webp/q/75)

总的来说我个人更加偏好这种方式，因为可以自己 diy，而且可以近乎无限地使用。

最后如果你想不好 prompt 的话，可以参考这个网站 [https://lexica.art/](https://lexica.art/) ，含有大量别人试验好的样子。

![](https://s3.mdedit.online/blog/twR2mZfXPz4Dry6d.png?imageView2/0/format/webp/q/75)

3.本地运行

如果你自己有高级显卡，可以自己尝试。

## 关于版权

确实总的来说，stable-diffusion 并没有特别限制，但是使用图片必须要遵守以下规则：

![](https://s3.mdedit.online/blog/6D58nziHh68YbmNf.png?imageView2/0/format/webp/q/75)

1.如果你是使用第三方平台，需要遵守第三方平台的一些规定，例如官方的 [dreamstudio.ai](https://beta.dreamstudio.ai/) 你可以自己商业或者非商用，但是默认你得也遵循 CC0 1.0 条约。

2.如果你使用自己本地部署，那么版权归属你自己。

## Google 账号注册

首先 emmm，科学 xx，懂得都懂

打开 [https://accounts.google.com/v3/signin/identifier?dsh=S-989160527%3A1661836665075766&continue=https%3A%2F%2Fwww.google.com%2F&ec=GAZAmgQ&hl=zh-CN&passive=true&flowName=GlifWebSignIn&flowEntry=ServiceLogin&ifkv=AQN2RmWH2zA7GGOXiR2mIL7T6SGoXLDpEOZ3gEGnQQfuG7ZguLJmi39jsX2U4YORUfFpDKLqAYNy](https://accounts.google.com/v3/signin/identifier?dsh=S-989160527%3A1661836665075766&continue=https%3A%2F%2Fwww.google.com%2F&ec=GAZAmgQ&hl=zh-CN&passive=true&flowName=GlifWebSignIn&flowEntry=ServiceLogin&ifkv=AQN2RmWH2zA7GGOXiR2mIL7T6SGoXLDpEOZ3gEGnQQfuG7ZguLJmi39jsX2U4YORUfFpDKLqAYNy)

点击创建账号 —— 个人用途

![](https://s3.mdedit.online/blog/pn2nJ4GnJKW7e3QX.png?imageView2/0/format/webp/q/75)

填写基本的个人信息

![](https://s3.mdedit.online/blog/nE8fYMRtiyBFDMYx.png?imageView2/0/format/webp/q/75)

填写手机号和年月信息

![](https://s3.mdedit.online/blog/brtctN6dPGGHNa5N.png?imageView2/0/format/webp/q/75)

然后手机收到一个验证码，点击验证，打工搞成

![](https://s3.mdedit.online/blog/3chceG5ze6BZiYEw.png?imageView2/0/format/webp/q/75)

然后点击跳过

![](https://s3.mdedit.online/blog/4ni2hFMxRc7D2XDs.png?imageView2/0/format/webp/q/75)

同意协议，大功告成！

---

放一波我最近生成的图，春夏秋冬的亭子

![ai-photo.png](https://s3.mdedit.online/blog/mZJ2QwwYaRYCyW22.png?imageView2/0/format/webp/q/75)

如果你有不明白或者是数字绘画爱好者欢迎交流呀。（严禁打广告、发不相关的内容！码过期的话加 qiufengblue）

![](AI%E6%95%B0%E5%AD%97%E7%BB%98%E7%94%BB%20stable-diffusion%20%E4%BF%9D%E5%A7%86%E7%BA%A7%E6%95%99%E7%A8%8B%20c7be30ea4a4749939c5ac9c782addfbc/CfpwE7PMSkWWpZCM.png)

## 参考文献

[https://www.51cto.com/article/716817.html](https://www.51cto.com/article/716817.html)
