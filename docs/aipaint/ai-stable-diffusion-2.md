# 用Colab免费部署自己的AI绘画云平台—— Stable Diffusion

AI绘画门槛又又又降低了，从最开始需要花半天时间折腾的 Disco-Diffusion ，紧接着 **Stable Diffusion**  在 github 上开源，各家平台都推出了云平台，让用户通过轻松的点击、选择、输入就能生成一张张AI图。

再到现在！！！使用 webui 在 github 上开源了，不仅有手动教程、docker 教程，还有 Colab 傻瓜式的集成方案。

webui github 地址： [https://github.com/sd-webui/stable-diffusion-webui](https://github.com/sd-webui/stable-diffusion-webui)

## 平台搭建

今天就来交大家如果来搭建和使用这个云平台。

### 第一步:  打开链接

 [https://colab.research.google.com/github/altryne/sd-webui-colab/blob/main/Stable_Diffusion_WebUi_Altryne.ipynb](https://colab.research.google.com/github/altryne/sd-webui-colab/blob/main/Stable_Diffusion_WebUi_Altryne.ipynb#scrollTo=BTH_drY9KZ4k)

![Untitled](https://s3.mdedit.online/blog/HsSW87hmCrntGkCP.png?imageView2/0/format/webp)

### 第二步: 连接运行时

打开后，点击右上角的`连接`。

![Untitled](https://s3.mdedit.online/blog/tZEY3XspJQpZa8is.png?imageView2/0/format/webp)

点击`确定`

![Untitled](https://s3.mdedit.online/blog/2rRNWSnnF58wijrt.png?imageView2/0/format/webp)

等连接上后我们运行第一段脚本，就是查看当前使用的机器。一般是从 K80、T4、P100、V100 中随机分配一个。

### 第三步: 设置 Token

点击这个 **1 - Setup stage** 左边的小箭头进行展开

![Untitled](https://s3.mdedit.online/blog/spSJNGHYwwbBMmwN.png?imageView2/0/format/webp)

划到 **1.4 Connect to Google Drive**

![Untitled](https://s3.mdedit.online/blog/yAs8ZA4Wbnp2z3f5.png?imageView2/0/format/webp)

勾选 download_if_missing ，然后到  [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)  复制你的 toekn 并填入，关于 huggingface 如何注册，可以看我上一篇文章《[AI数字绘画 stable-diffusion 保姆级教程](https://mp.weixin.qq.com/s?__biz=MzkyOTIxMDAzNw==&mid=2247492892&idx=1&sn=c69e4d2782098efc644b151dbd2049d5&chksm=c20faec6f57827d0442f5697b1a5a31ee15933956e45302411ecbee3b8708c5b218bd8e1d4e9&scene=21&token=1095602716&lang=zh_CN#wechat_redirect)》

### 第四步: 设置密码

划到 **2 - Run the Stable Diffusion webui** 部分，因为要部署一个服务，当然得设置一个密码，不然人人都可以随意使用你的服务了。

![Untitled](https://s3.mdedit.online/blog/Y287SpM5TcTRFPXh.png?imageView2/0/format/webp)

## 第五步：运行服务

将他们收起来，依次运行以下步骤

![Untitled](https://s3.mdedit.online/blog/8pzee5XW4Ry8epN8.png?imageView2/0/format/webp)

### 第六步： 打开 Web 服务

![Untitled](https://s3.mdedit.online/blog/24R8PSw8hS8wQnp3.png?imageView2/0/format/webp)

账号为 webui，密码如果设置了就是你设置的密码。

## 使用教程

打开后就是这样一个界面，主要包含了4块功能，text2img，img2img，人脸修复算法，照片清晰化。

![Untitled](https://s3.mdedit.online/blog/fpd7aKJ2KHdDrx7n.png?imageView2/0/format/webp)

## text2img

我们首先来看 text2img，也就是输入一段文字就可以生成一张照片。

![Untitled](https://s3.mdedit.online/blog/WdysHAyPHjzYhRXJ.png?imageView2/0/format/webp)

然后来看生成的一些案例吧

prompt: a girl with lavender hair and black skirt, fairy tale style background, a beautiful half body illustration, top lighting, perfect shadow, soft painting, reduce saturation, leaning towards watercolor, art by hidari and krenz cushart and wenjun lin and akihiko yoshida

![Untitled](https://s3.mdedit.online/blog/sKTYxRPXWWfJ2Z35.png?imageView2/0/format/webp)

```jsx
rimuru looking into the camera, beautiful face, ultra realistic, fully clothed, intricate details, highly detailed, 8 k, photorealistic, octane render, unreal engine, photorealistic, portrait
```

![Untitled](https://s3.mdedit.online/blog/zsHAWFW6sWEcT4CQ.png?imageView2/0/format/webp)

((a point coloration cat by the lakeside)), big face, small ears, play in the snow, sharp focus, illustration, highly detailed, concept art, matte, anime, trending on artstation

![Untitled](https://s3.mdedit.online/blog/QdY3iYDzFDEcfNXi.png?imageView2/0/format/webp)

prompt:  Cyberpunk, 8k resolution, castle, the rose sea, dream

![yuantu.png](https://s3.mdedit.online/blog/NHKNMGNSwSQiBHSd.png?imageView2/0/format/webp)

水墨画风格

prompt: a watercolor ink painting of a fallen angel with a broken halo wielding a jagged broken blade standing on top of a skyscraper in the style of anti - art trending on artstation deviantart pinterest detailed realistic hd 8 k high resolution

![Untitled](https://s3.mdedit.online/blog/KA7CztnAB52SbRCG.png?imageView2/0/format/webp)

## img2img

这个功能则是利用图片生成图片的功能。

![Untitled](https://s3.mdedit.online/blog/M8kiG6FpHaQ3XGmQ.png?imageView2/0/format/webp)

![Untitled](https://s3.mdedit.online/blog/xdbZnNShddaBQYw6.png?imageView2/0/format/webp)

这里需要注意的是，不知道是不是我电脑的分辨率问题，默认宽高为 512 和 256，这个时候会报以下错误，但是将宽度调整成 1024 * 512 就没有问题

```jsx
RuntimeError: The size of tensor a (128) must match the size of tensor b (32) at non-singleton dimension 3
```

生成的一些案例：

A fantasy landscape, trending on artstation

![Untitled](https://s3.mdedit.online/blog/yFcXRpw5tFENjGCp.png?imageView2/0/format/webp)

A fantasy landscape, trending on artstation

![Untitled](https://s3.mdedit.online/blog/3bX6trfTNhJSjdj4.png?imageView2/0/format/webp)

a nike sneakers

![Untitled](https://s3.mdedit.online/blog/mKa8DX5rsCMFJ4yp.png?imageView2/0/format/webp)

## 人像优化

直接将老照片拖入框框。

案例：

![Untitled](https://s3.mdedit.online/blog/EDk55tRByGTQ6i6P.png?imageView2/0/format/webp)

## 清晰度优化

如果你觉得你生成的图片质量不够，可以使用这个功能进行4倍图进行放大。这个功能生成时间比较久，需要耐心等待, 大约5-10分钟，最终生成的清晰度提升还是蛮大的。

案例：

![Untitled](https://s3.mdedit.online/blog/ChN3m6h34fBkcAFJ.png?imageView2/0/format/webp)

最后附上一个常见参数说明

![Untitled](https://s3.mdedit.online/blog/QxTMwsFWG7hkRXeN.png?imageView2/0/format/webp)

更多内容请查看我整理的 Notion 文档 [https://qiufeng.notion.site/06fab45ec290447ba41c3fd0f6e78fac](https://www.notion.so/06fab45ec290447ba41c3fd0f6e78fac)， 包含了 10+个 AI 绘画平台，SD 和 DD 使用教程，调参教程以及其他的文档。

![Untitled](https://s3.mdedit.online/blog/6N7xbF33ayRKpxAY.png?imageView2/0/format/webp)