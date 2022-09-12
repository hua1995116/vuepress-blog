# Three.js 系列: 游戏中的第一/三人称视角

大家好，我是秋风，在上一篇中说到了 Three.js 系列的目标以及宝可梦游戏，那么今天就来通过 Three.js 来谈谈关于游戏中的视角跟随问题。

相信我的读者都或多或少玩一些游戏，例如王者荣耀、绝地求生、宝可梦、塞尔达、原神之类的游戏。那么你知道他们分别是什么视角的游戏么？你知道第一人称视角和第三人称视角的差异么？通过代码我们怎么能实现这样的效果呢？

如果你对以上问题好奇，并且不能完全回答。那么请跟随着我一起往下看吧。

## 视角讲解

首先我们先来看看第一人称视角、第三人称视角的概念。其实对于我们而言 第一人称 和 第三人称，是非常熟悉的，第一人称就是以自己的口吻讲述一件事，例如自传都是以这种形式抒写，第三人称则是以旁观者，例如很多小说，都是以他（xxx）来展开式将的，观众则是以上帝视角看着这整个故事。对应的第一人称视角、第三人称视角也是相同的概念，只不过是视觉上面。

**那么他们各自有上面区别呢？**

第一人称视角的有点是可以给玩家带来最大限度的沉浸感，从第一人称视角“我”去观察场景和画面，可以让玩家更加细致地感受到其中的细节，最常见的就是类似绝地求生、极品飞车之类的。

![](https://s3.mdedit.online/blog/image_three1.png?imageView2/0/q/75)

而第一人称视角也有他的局限性。玩家的视野受限，无法看到更广阔的的视野。另一个就是第一人称视角会给玩家带来“3D 眩晕感”。当反应速度更不上镜头速度的时候会造成眩晕感。

那么第三人称视角呢？他的优势就是自由，视野开阔，人物移动和视角是分开的，一个用来操作人物前进方向，另一个则是用来操控视野方向。

![](https://s3.mdedit.online/blog/image_1_three1.png?imageView2/0/q/75)

它的劣势就是无法很好的聚焦局部，容易错过细节。

但是总的来说，目前大多数游戏都提供了两种视角的切换来满足不同的情形。例如绝对求生中平时走路用第三人称视角跟随移动，开枪的时候一般用第一人称视角。

好了，到目前为主我们已经知道了第一人称视角、第三人称视角各自概念、区别。那么我们接下来以第三人称视角为例，展开分析我们该如何实现这样的一个效果呢？（第三人称的编写好后，稍加修改就可以变成第一人称，因此以更加复杂的第三人称为例）

把大象放入冰箱需要几步？三步！打开冰箱，把大象放进冰箱，关上冰箱。显然如果真的要把大象放进冰箱是很难的事情，但是从宏观角度来看，就是三个步骤。

因此我们也将实现第三人称视角这个功能分成三步：

## 步骤拆分

以下的步骤拆分不会包含任何代码，请放心使用:

1.人物如何运动

我们都知道在物理真实的世界中，我们运动起来是靠我们双腿，迈开就动起来了。那这个过程从更宏观的角度来看是怎么样的呢？其实如果从地球外，从一个更远的角度来看，我们做运动更像是一个个平移变化。

相同地，我们在计算机中来表示运动也就是运用了平移变化。平移变化详细大家以前都比较熟悉，如果现在不熟悉了呢，也没有什么关系，先看下面的坐标轴。（小方块的边长是 1）

![](https://s3.mdedit.online/blog/image_2_three1.png?imageView2/0/q/75)

小方块从 A1 位置移动到位置 A2 就是平移变化，如果用数学表达式来表示的话就是

![](https://s3.mdedit.online/blog/image_3_three1.png?imageView2/0/q/75)

上面是什么意思呢？就是说我们让小方块中所有的小点的 x 值都加 2，而 y 的值不变。我们随意取一些值来验证一下。

例如 A1 位置小方块，左下角是 (0,0), 通过以上变化，就变成了 (2, 0)，我们来 A2 中看小方块新的位置就是 (2, 0)；再用右上角的 (1,1) 代入，发现就变成了(3,1)，和我们真实移动到的位置也是一样的。所以上面的式子没有什么问题。

但是后来呢，大家觉得像上面那样的式子用来表示稍微有点不够通用。至于这里为什么说不够通用，在后面的系列文章中会详细讲解，因为还涉及到了其他变化，例如旋转、缩放，他们都可以用一个矩阵来进行描述，因此如果平移也能够用矩阵的方式来表达，那么整个问题就变得简单了，也就是说：

**运动变化 = 矩阵变化**

我们来看看把最开始的式子变成矩阵是什么样子的：

![](https://s3.mdedit.online/blog/image_4_three1.png?imageView2/0/q/75)

可以简单讲解一下右边这个矩阵是怎么来的

![](https://s3.mdedit.online/blog/image_5_three1.png?imageView2/0/q/75)

左上角的这个部分称为单位矩阵，后面的 2 0 则就是我们需要的平移变化，至于为什么从 2 维变成了 3 维，则是因为引入了一个齐次矩阵的概念。同样的原理，类比到 3 维，我们就需要用到 4 维矩阵。

所以说，我们通过一系列的例子，最终想要得到的一个结论就是，所有的运动都是**矩阵变化**。

![](https://s3.mdedit.online/blog/image_6_three1.png?imageView2/0/q/75)

2.镜头朝向人物

我们都知道，在现实世界中我们眼睛看出去的视野是有限的，在电脑中也是一样的。

假设在电脑中我们的视野是 3 \* 3 的方格，我们还是以之前坐标轴举例子，黄色区域是我们的视野可见区域：

![](https://s3.mdedit.online/blog/image_7_three1.png?imageView2/0/q/75)

现在我们让小块往右移动 3 个单位，再网上移动 1 个单位。

![](https://s3.mdedit.online/blog/image_8_three1.png?imageView2/0/q/75)

这个时候我们会发现，我们的视野内已经看不到这个小块了。试想一下，我们正在玩一个射击游戏，敌人在眼前移动，我们为了找到它会在怎么办？没错，我们会旋转我们的脑袋，从而使得敌人暴露在我们的视野内。就像这样：

![](https://s3.mdedit.online/blog/image_9_three1.png?imageView2/0/q/75)

这下就把敌人锁定住了，能够始终让人物出现在我们的视野内并且保持相对静止。

3.镜头与人物同距

光有镜头朝向人物还不够，我们还得让我们的镜头和人物同距。为什么这么说呢，首先还是我们坐标轴的例子，但是这次我们将扩充一个 z 轴：然后我们看看正常下的平面截图

![](https://s3.mdedit.online/blog/image_10_three1.png?imageView2/0/q/75)

截图：

![](https://s3.mdedit.online/blog/image_11_three1.png?imageView2/0/q/75)

现在我们将我们的小块往-Z 移动 1 个单位：

![](https://s3.mdedit.online/blog/image_12_three1.png?imageView2/0/q/75)

截图：

![](https://s3.mdedit.online/blog/image_13_three1.png?imageView2/0/q/75)

这个时候我们发现这个小方块变小了，并且随着小方块往 -z 方向移动的越多，我们看到的小块会越来越小。这个时候我们明明没有改变我们的视角，但是还是无法很好的跟踪小块。因此我们需要移动为我们视角的位置，当我们看不清一个远处的路标的时候，我们会怎么办？没错，凑近点！

![](https://s3.mdedit.online/blog/image_14_three1.png?imageView2/0/q/75)

截图：

![](https://s3.mdedit.online/blog/image_15_three1.png?imageView2/0/q/75)

完美！现在我们通过三个方向的讲解，将如果实现一个第三人称视角的功能从理论上面实现了！

![](https://s3.mdedit.online/blog/image_16_three1.png?imageView2/0/q/75)

## 搞代码

接下来我们只需要按照我们的以上的理论，来实现代码就好了，代码无法就是我们用另一种语言的实现方式，知道了原理都是非常简单的。

1.初始化画布场景

```JavaScript
<canvas class="webgl"></canvas>
...
<script>
// 创建场景
const scene = new THREE.Scene()
// 加入相机
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.y = 6;
camera.position.z = 18;
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true; // 设置阻尼，需要在 update 调用
scene.add(camera);
// 渲染
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera);
</script>
```

场景、相机、渲染器是一些比较固定的东西，这一节不主要进行讲解，可以理解为我们项目初始化的时候一些必备的语句。

这个时候我们打开页面，是黑乎乎的一片，为了美观，我给整个场景加上一个地板。

```JavaScript
// 设置地板
const geometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
// 地板贴图
const floorTexture = new THREE.ImageUtils.loadTexture( '12.jpeg' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 10, 10 );
// 地板材质
const floorMaterial = new THREE.MeshBasicMaterial({
    map: floorTexture,
    side: THREE.DoubleSide
});

const floor = new THREE.Mesh(geometry, floorMaterial);
// 设置地板位置
floor.position.y = -1.5;
floor.rotation.x = - Math.PI / 2;

scene.add(floor);
```

![](https://s3.mdedit.online/blog/image_17_three1.png?imageView2/0/q/75)

这个时候画面还不错~

2.人物运动

根据理论，我们需要加入一个人物，这里为了方便，也还是加入一个小方块为主：

```JavaScript
 // 小滑块
const boxgeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterials = [];
for (let i = 0; i < 6; i++) {
    const boxMaterial = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
    });
    boxMaterials.push(boxMaterial);
}
// 小块
const box = new THREE.Mesh(boxgeometry, boxMaterials);
box.position.y = 1;
box.position.z = 8;

scene.add(box);

```

为了好看，我给小块加了六面不同的颜色。

![](https://s3.mdedit.online/blog/image_18_three1.png?imageView2/0/q/75)

虽然看起来还是有点简陋，但是俗话说高端的食材往往只需要最朴素的烹饪方式。小块虽小，但是五脏俱全。

现在我们渲染出了小块后，要做的事情就是绑定快捷键。

![](https://s3.mdedit.online/blog/image_19_three1.png?imageView2/0/q/75)

对应的代码：

```JavaScript
// 控制代码
const keyboard = new THREEx.KeyboardState();
const clock = new THREE.Clock();
const tick = () => {
    const delta = clock.getDelta();
    const moveDistance = 5 * delta;
    const rotateAngle = Math.PI / 2 * delta;

    if (keyboard.pressed("down"))
        box.translateZ(moveDistance);
    if (keyboard.pressed("up"))
        box.translateZ(-moveDistance);
    if (keyboard.pressed("left"))
        box.translateX(-moveDistance);
    if (keyboard.pressed("right"))
        box.translateX(moveDistance);

    if (keyboard.pressed("w"))
        box.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
    if (keyboard.pressed("s"))
        box.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
    if (keyboard.pressed("a"))
        box.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
    if (keyboard.pressed("d"))
        box.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick();
```

这里解释一下 translateZ、translateX，这俩函数就是字面意思，往 z 轴 和 x 轴移动，如果想要往前，就往 -z 轴移动，如果是往 左就是往 -x 轴移动。

`clock.getDelta ()` 是什么意思呢？简单说`.getDelta ()`方法的功能就是获得前后两次执行该方法的时间间隔。例如我们想要在 1 秒内往前移动 5 个单位，但是直接移动肯定比较生硬，因此我们想加入动画。我们知道为了实现流畅的动画，一般通过浏览器的 API`requestAnimationFrame`实现，浏览器会控制渲染频率，一般性能理想的情况下，每秒`s`渲染 60 次左右，在实际的项目中，如果需要渲染的场景比较复杂，一般都会低于 60，也就是渲染的两帧时间间隔大于 16.67ms。因此为了移动这 5 个单位，我们将每一帧该移动的距离，拆分到了这 60 次渲染中。

最后来说说 `rotateOnAxios`，这个主要就是用来控制 小盒子的旋转。

> .rotateOnWorldAxis ( axis : Vector3, angle : Float ) : this
> axis -- 一个在世界空间中的标准化向量。  
> angle -- 角度，以弧度来表示。

3.相机与人物同步

回顾理论部分，我们最后一个步骤就是想要让相机（人眼）和物体保持相对静止的，也就是距离不变。

```JavaScript
const tick = () => {
  ...
  const relativeCameraOffset = new THREE.Vector3(0, 5, 10);

  const cameraOffset = relativeCameraOffset.applyMatrix4( box.matrixWorld );

  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;
  // 始终让相机看向物体
  controls.target = box.position;
  ...
}
```

这里有个比较核心的点就是 `relativeCameraOffset.applyMatrix4( box.matrixWorld );` 其实这个我们在理论部分说过了，因为我们的物体移动的底层原理就是做矩阵变化，那么想要让相机（人眼）和物体的距离不变，我们只需要让相机（人眼）和物体做相同的变化。而在 Three.js 中物体所有的自身变化都记录在 `.matrix` 里面，只要外部的场景不发生变化，那么`.matrixWorld` 就等于 `.matrix` 。而`applyMatrix4` 的意思就是相乘的意思。

![](https://s3.mdedit.online/blog/image_20_three1.png?imageView2/0/q/75)

## 效果演示

这样我就最终实现了整个功能！我们下期见！

![](https://s3.mdedit.online/blog/2022-02-13-20.45.21.gif?imageView2/0/q/75)

源码地址： https://github.com/hua1995116/Fly-Three.js
