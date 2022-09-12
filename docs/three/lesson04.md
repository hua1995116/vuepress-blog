# 细数实现全景图 VR 的几种方式（panorama/cubemap/eac）/ 一起来实现全景图 VR 吧！

本篇是 Three.js 系列的第四篇内容，想看其他内容可以看上方 ☝️，今天就给大家来介绍介绍全景图相关的知识，我们知道因为最近疫情的影响，大家都没办法出门，很多全景的项目火了，比如各个著名的风景区都开放了 VR。

![Untitled](https://s3.mdedit.online/blog/AQZnPrmE72CFSDFb.png?imageView2/0/format/webp/q/75)

除此之外，VR 设备也是非常的火热，在我国 2022 年上半年，VR 市场销售额突破了 8 亿元，同比增长了 81%

![Untitled](https://s3.mdedit.online/blog/hzBj57FK4MT5NFHx.png?imageView2/0/format/webp/q/75)

而在国外呢，截至 2022 年 Q1 ，已经卖出了 1480 万台！

![Untitled](https://s3.mdedit.online/blog/GxekW2JDTWa8CxxR.png?imageView2/0/format/webp/q/75)

因为我们学习制作 VR 技术就是顺势而为，毕竟雷布斯说过，“站在风口上
，猪都可以飞起来”。

接下来我就谈谈目前展示主要有几种形式。目前展示 VR 主要有 3 种 主流方式，分别为 建模 、建模 + 全景图 和 全景图

|          | 建模    | 建模+全景图  | 全景图             |
| -------- | ------- | ------------ | ------------------ |
| 代表作品 | VR 游戏 | 贝壳系列看房 | 普通云游览、云游览 |
| 体验     | 极好    | 好           | 中等               |

我们来实际体验一下他们的差异

![2022-08-20 21.00.21-min.gif](https://s3.mdedit.online/blog/S28iSTytih3a4kEH.gif?imageView2/0/format/webp/q/75)

以上为 VR 游戏《雇佣战士》的体验，视角切换非常的流畅，且场景非常的大，玩过 3D 类型游戏的朋友就能明白。这种场景都是通过建模来完成，利用 blender、3D Max、maya 等建模软件，再使用 Unity、UE 等游戏开发平台，各种效果可以说非常的好。

![2022-08-20 21.02.02-min.gif](https://s3.mdedit.online/blog/R6yHyYQ3DkYTKpsX.gif?imageView2/0/format/webp/q/75)

而到了贝壳这种呢，则是通过建模加上全景图两种方式结合使用，模型和全景图是通过线下采集得到，但是对于这种看房页面，要在 Web 上渲染精细的模型资源消耗是巨大的，因此他们采取了一个折中的方案，就是粗糙模型 + 全景图，通过模型来补间场景切换的突变感，变化过程中明显能感受的掉帧的感觉。虽然效果不如纯手动建模来的精细，但是总的来说体验也非常不错了。

![2022-08-20 21.04.04-min.gif](https://s3.mdedit.online/blog/2pCGsE73Mb8tZT3Z.gif?imageView2/0/format/webp/q/75)

最后这种云游览，则是直接通过两张全景图直接切换得到的，这种方式最为简单，当然效果远远前面两种，但是单张图片的全景视角比起静态的图片而言，也是增加了空间感。

用表格总结起来就是以下：

|          | 建模                  | 建模+全景图      | 全景图             |
| -------- | --------------------- | ---------------- | ------------------ |
| 代表作品 | VR 游戏《雇佣战士》   | 贝壳系列看房     | 普通云游览、云游览 |
| 实现难度 | 很难                  | 难               | 简单               |
| 过渡效果 | 极度真实              | 好               | 一般               |
| 模型     | Blender、3D Max、maya | 带有光学传感相机 | 普通 360 相机      |

由于全景图是通过一个个点位拍摄而得到的。因此它无法拥有位置信息，也就是各个点位的依赖关系，因此当在切换场景的时候，我们无法得到沉浸式的过渡效果；而贝壳则是通过利用了模型的补间来改善过渡；VR 游戏《雇佣战士》则是纯手动建模，因此效果非常好。

今天我们主要讲解的就是全景图模式(因为它比较简单)，当然也不是想象中那么简单，只是相比前两种方式而言，难度是下降了一个坡度，毕竟学习都是从兴趣开始的，一开始来个高难度的，简直就是劝退了。

首先我们先来了解一些前置知识，目前主流全景图都有什么格式？

我翻阅总结后目前最常用的大约为以下三种

- 等距柱状投影格式（Equirectangular）
- 等角度立方体贴图格式（Equi-Angular Cubemap）
- 立方体贴图（Cube Map )

## 等距柱状投影

也就是最常见的世界地图的投影方式，做法是将经线和纬线等距地（或有疏密地）投影到一个矩形平面上。

![Untitled](https://s3.mdedit.online/blog/WzQJYRGN3Pi5CacT.png?imageView2/0/format/webp/q/75)

这种格式的优点是比较直观，并且投影是矩形的。缺点也很明显，球体的上下两极投影出来的像素数很多，而细节内容比较丰富的赤道区域相比来说像素数就很少，导致还原时清晰度比较糟糕。另外，这种格式的画面在未渲染的情况下扭曲比较明显。

## 立方体贴图

是另一种全景画面的储存格式，做法是将球体上的内容向外投影到一个立方体上，然后展开，而它对比等距柱状投影的优势是，在相同分辨率下，它的图片体积更小，约为 等距柱状投影 的 1/3

![Untitled](https://s3.mdedit.online/blog/iDK66xyJTyKpYTyt.png?imageView2/0/format/webp/q/75)

## 等角度立方体贴图

是谷歌所提出的进一步优化的格式，方法是更改优化投影时的采样点位置，使得边角与中心的像素密度相等。

![Untitled](https://s3.mdedit.online/blog/fwCZbmaSteeYGK62.png?imageView2/0/format/webp/q/75)

这样做的好处就是在相同的源视频分辨率下可以提高细节部分的清晰度。排版如下：

![Untitled](https://s3.mdedit.online/blog/65eB7ZRBapwFcbFJ.png?imageView2/0/format/webp/q/75)

我们简单总结一下：

|            | 等距柱状投影 | 立方体贴图 | 等角度立方体贴图 |
| ---------- | ------------ | ---------- | ---------------- |
| 图源       | 简单         | 一般       | 难               |
| 技术实现   | 简单         | 简单       | 一般             |
| 图片体积   | V            | 1/3 V      | 1/3 ~ 1/4 V      |
| 图片清晰度 | 一般         | 好         | 更好             |

> v 为基准体积

接下来就到了我们使用 Three.js 来实现以上效果的时刻了。

## 等距柱状投影

这种方式实现起来比较简单。首先我们在 [https://www.flickr.com/](https://www.flickr.com/) 找一张全景图。

![52298757180_942ae51202_k.jpg](https://s3.mdedit.online/blog/sce6RA4N78EXtkEk.jpg?imageView2/0/format/webp/q/75)

在前面的介绍中我们可以得到 2:1 的等距投影全景图对应的几何体为球形，还记得我们在前《造一个海洋球》学过，如何来创建一个球体，没错就是 `**SphereGeometry**`。

```
... 省略场景初始化等代码

// 创建一个球体
const geometry = new THREE.SphereGeometry(30, 64, 32);

// 创建贴图, 并设置为红色
const material = new THREE.MeshBasicMaterial({
	color: "red",
});

// 创建对象

const skyBox = new THREE.Mesh(geometry, material);

// 添加对象到场景中

scene.add(skyBox);

// 设置在远处观看
camera.position.z = 100
...
```

然后我们就得到了一个小红球：

![Untitled](https://s3.mdedit.online/blog/4DhNAcATmKyeMitr.png?imageView2/0/format/webp/q/75)

嗯，现在为止你已经学会了如果创建一个小红球，接下来还有 2 个步骤加油！

接下来呢，我们就将我们的 2:1 的全景图贴到我们的球体上

```
const material = new THREE.MeshBasicMaterial({
-    //color: "red",
+    map: new THREE.TextureLoader().load('./images/panorama/example.jpg')
});
```

我们就得到了一个类似地球仪的球体。

![2022-08-21 16.13.10.gif](https://s3.mdedit.online/blog/FAyRBdNBTQJ7MtiN.gif?imageView2/0/format/webp/q/75)

现在我们要做的，就是我们不想在远处观看这些内容，而是要“身临其境”！

所以我们需要把相机移动到球体的内部，而不是在远处观看

```
- camera.position.z = 100
+ camera.position.z = 0.01
```

这个时候我们发现，突然漆黑一篇。

小问题，这是由于在 3d 渲染中，默认物体只会渲染一个面，这也是为了节省性能。当然我们可以也通过让物体默认只渲染内部，这就需要通过声明贴图的法线方向了，过程不是本节课的讨论范围这里只提供一个思路。幸好 Three.js 给我们提供了一个简单的方法 `THREE.DoubleSide` ，通过这个方法，就能让我们的物体渲染两个面。这样我们即使在物体内部也能看到贴图啦。

```
const material = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('./images/panorama/example.jpg'),
+	side: THREE.DoubleSide,
});
```

![2022-08-21 16.25.03 (1).gif](https://s3.mdedit.online/blog/GizyMRPKDWZZWYRX.gif?imageView2/0/format/webp/q/75)

现在我们只用了 `**SphereGeometry**` 球体快速实现了全景的效果。

## 立方体贴图

立方体贴图就和它的名字一样，我们只需要使用一个立方体就能渲染出来一个全景效果，但是 2:1 的全景图肯定是不能直接使用的，我们首先需要通过 工具来进行转化，目前有两种比较方便的方式。

- [https://jaxry.github.io/panorama-to-cubemap/](https://jaxry.github.io/panorama-to-cubemap/)
- ffmpeg 5.x 使用命令 `ffmpeg -i example.jpg -vf v360=input=equirect:output=c3x2 example-cube.jpg`

最终我们可以得到以下 6 张图

![example-cube.jpg](https://s3.mdedit.online/blog/zi7Kds38xwTBb7AX.jpg?imageView2/0/format/webp/q/75)

开始来写我们的代码

```jsx

... 省略场景初始化等代码
// 创建立方体
const box = new THREE.BoxGeometry(1, 1, 1);

// 创建贴图
function getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {
	const textures = [];
	for (let i = 0; i < tilesNum; i++) {
	    textures[i] = new THREE.Texture();
	}
	new THREE.ImageLoader()
	    .load(atlasImgUrl, (image) => {
	        let canvas, context;
	        const tileWidth = image.height;
	        for (let i = 0; i < textures.length; i++) {
	            canvas = document.createElement('canvas');
	            context = canvas.getContext('2d');
	            canvas.height = tileWidth;
	            canvas.width = tileWidth;
	            context.drawImage(image, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);
	            textures[i].image = canvas;
	            textures[i].needsUpdate = true;
	        }
	    });
	return textures;
}

const textures = getTexturesFromAtlasFile( './images/cube/example-cube.jpg', 6 );
const materials = [];

for ( let i = 0; i < 6; i ++ ) {
	materials.push( new THREE.MeshBasicMaterial( {
	    map: textures[ i ],
	    side: THREE.DoubleSide
	} ) );
}
const skyBox = new THREE.Mesh(box, materials);
scene.add(skyBox);
...
```

这里有一个注意点，就是在 Three.js 中如果有多张贴图，是支持以数组形式传入的，例如此例子中，传入的顺序为 “左右上下前后”

![2022-08-21 16.25.03 (1).gif](https://s3.mdedit.online/blog/GizyMRPKDWZZWYRX.gif?imageView2/0/format/webp/q/75)

此时我们也得到了上方一样的效果。

## 等角度立方体贴图

这里也和 cubemap 一样，我们需要通过工具转化才能得到对应格式的图片。这里只需要了 5.x 的 ffmpeg，因为它自带一个 360 filter ，能够处理 EAC 的转化。首先通过以下命令得到一张 eac 的图。

![example-eac.jpg](https://s3.mdedit.online/blog/infS2XwBNz8HnMiJ.jpg?imageView2/0/format/webp/q/75)

```jsx
ffmpeg -i example.jpg -vf v360=input=equirect:output=eac example-eac.jpg
```

这里由于 Three.js 默认不支持 EAC 的渲染，因此我们使用了一个 `egjs-view360`来进行渲染 ，原理为自己手写一个 shader 来处理 EAC 这种情况，这里暂时先不展开讲解，过程比较枯燥，后续单开一个章节来说明。

使用 `egjs-view360` 来渲染 EAC 图，整体比较简单

```jsx
...省略依赖库
<div class="viewer" id="myPanoViewer">
</div>

<script>

    var PanoViewer = eg.view360.PanoViewer;
    var container = document.getElementById("myPanoViewer");
    var panoViewer = new PanoViewer(container, {
        image: "./images/eac/example-eac.jpg",
        projectionType: "cubestrip",
        cubemapConfig: {
            order: "BLFDRU",
            tileConfig: [{ rotation: 0 }, { rotation: 0 }, { rotation: 0 }, { rotation: 0 }, { rotation: -90 }, { rotation: 180 }],
            trim: 3
        }
    });

    PanoControls.init(container, panoViewer);
    PanoControls.showLoading();
</script>
```

![2022-08-21 16.25.03 (1).gif](https://s3.mdedit.online/blog/GizyMRPKDWZZWYRX.gif?imageView2/0/format/webp/q/75)
我们最终也能得到以上的结果。

这里再给一组文件体积的数据：(所有图片统一使用了 tinypng 进行了压缩去除无效信息)

![Untitled](https://s3.mdedit.online/blog/5Q7iKHzBBQwQpeed.png?imageView2/0/format/webp/q/75)

最终得出了一个这样的排名：

体验： EAC > CubeMap > Equirectangular

文件体积：CubeMap < EAC < Equirectangular

上手难度 ：EAC < CubeMap < Equirectangular

所以如果你想要高体验高画质，那么你就选择 EAC，如果想要带宽小，那么就选择 CubeMap，如果你是个初学者想要快速实现效果，那么就使用 Equirectangular ！

以上所有代码均在：[https://github.com/hua1995116/Fly-Three.js](https://github.com/hua1995116/Fly-Three.js) 中可以找到。

这里最后补充一个小提示，球形贴图的一个好处就是天然地可以作为小行星的展示，例如这种特效。

![3133178949-afe8bcc0dcf43048.gif](https://s3.mdedit.online/blog/HbAJYpDpsJWj4Asd.gif?imageView2/0/format/webp/q/75)

本期我们通过了从 VR 的发展现状、VR 的几种实现方式，再到通过 Equirectangular、CubeMap、Equi-Angular Cubemap 三种全景图来实现 VR 进行了讲解，希望对你有所帮助，我们下期再见。👋🏻

参考资料

[https://www.bilibili.com/read/cv788511](https://www.bilibili.com/read/cv788511)

[https://www.trekview.org/blog/2021/projection-type-360-photography/](https://www.trekview.org/blog/2021/projection-type-360-photography/)

[https://ourcodeworld.com/articles/read/843/top-7-best-360-degrees-equirectangular-image-viewer-javascript-plugins](https://ourcodeworld.com/articles/read/843/top-7-best-360-degrees-equirectangular-image-viewer-javascript-plugins)

[https://jiras.se/ffmpeg/equiangular.html](https://jiras.se/ffmpeg/equiangular.html)

[https://blog.google/products/google-ar-vr/bringing-pixels-front-and-center-vr-video/](https://blog.google/products/google-ar-vr/bringing-pixels-front-and-center-vr-video/)

[https://jiras.se/ffmpeg/mono.html](https://jiras.se/ffmpeg/mono.html)

[https://ffmpeg.org/ffmpeg-filters.html#v360](https://ffmpeg.org/ffmpeg-filters.html#v360)

[https://blog.csdn.net/qiutiantxwd/article/details/107283224](https://blog.csdn.net/qiutiantxwd/article/details/107283224)
