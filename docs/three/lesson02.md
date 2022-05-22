# 造个海洋球池来学习物理引擎【Three.js系列】

大家好，我是秋风。今天想要和大家分享的呢，是做一个海洋球池。

海洋球大家都见过吧？就是商场里非常受小孩子们青睐的小球，自己看了也想往里蹦跶的那种。

![Untitled](https://s3.qiufeng.blue/blog/cCAyfZNcxtBMRZwr.png?imageView2/0/format/webp/q/75)

图源于网络

就想着做一个海洋球池，然后顺便带大家来学习学习 Three.js 中的物理引擎。

那么让我们开始吧，要实现一个海洋球池，那么首先肯定得有“球”吧。

因此先带大家来实现一个小球，而恰恰在 Three.js 中定义一个小球非常的简单。因为 Three.js 给我们提供非常丰富几何形状 API ，大概有十几种吧。

![Untitled](https://s3.qiufeng.blue/blog/WkZPxEmtz2eYw5QS.png?imageView2/0/format/webp/q/75)

提供的几何形状恰巧有我们需要的球形， 球形的 API  叫 SphereGeometry。

```jsx
SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
```

这个API 一共有 7 个参数，但是呢，我们需要用到就只有前3个参数，后面的暂时不需要管。

Radius 的意思很简单，就是半径，说白了就是设置小球的大小，首先我们设置小球的大小，设置为 0.5，然后其次就是 widthSegments 和 heightSegments ，这俩值越大，球的棱角就越少，看起来就越细腻，但是精细带来的后果就是性能消耗越大，widthSegments 默认值为32，heightSegments默认值为 16 ，我们可以设置 20, 20 

```jsx
const sphereGeometry = new THREE.SphereGeometry(0.5, 20, 20);
```

这非常的简单，虽然小球有了形状，我们还得给小球设置上材质，材质就是类似我们现实生活中的材料，不是是只要是球形的就叫一个东西，比如有玻璃材质的弹珠，有橡胶材质的网球等等，不同的材质会与光的反射不一样，看起来的样子也不一样。在 Three.js 中我们就设置一个标准物理材质 `MeshStandardMaterial` ，它可以设置金属度和粗糙度，会对光照形成反射，然后把球的颜色设置成红色，

```jsx
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: '#ff0000'
});
const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

scene.add(mesh);
```

然后我们将它添加到我们的场景中，emmm，看起来黑乎乎的一片。

![Untitled](https://s3.qiufeng.blue/blog/Hx6CidPH5FnwC7Ra.png?imageView2/0/format/webp/q/75)

“上帝说要有光，于是就有了光”，黑乎乎是正常的，因为在我们场景中没有灯光，这个意思很简单，当夜晚的时候，关了灯当然是伸手不见五指。于是我们在场景中加入两盏灯，一个环境灯，一个直射灯，灯光在本篇文章中不是重点，所以就不会展开描述。只要记住，”天黑了，要开灯”

```jsx
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, -1)
scene.add(directionalLight)
```

![Untitled](https://s3.qiufeng.blue/blog/4d4hTN2FPSQdpbri.png?imageView2/0/format/webp/q/75)

嗯！ 现在这个球终于展现出它的样子了。

一个静态的还海洋球肯定没有什么意思，我们需要让它动起来，因此我们需要给它添加物理引擎。有了物理引擎之后小球就会像现实生活中的样子，有重力，在高空的时候它会做自由落地运动，不同材质的物体落地的时候会有不同的反应，网球落地会弹起再下落，铅球落地则是静止的。

常用的 3d 物理引擎有Physijs 、Ammo.js 、Cannon.js 和 Oimo.js 等等。这里我们用到的则是 Cannon.js 

在 Cannon.js 官网有很多关于 3d 物理的效果，详细可以看他的官网 [https://pmndrs.github.io/cannon-es/](https://pmndrs.github.io/cannon-es/)

![Untitled](https://s3.qiufeng.blue/blog/MnRZ4zZZ3Tt7G5Rk.png?imageView2/0/format/webp/q/75)

引入 Cannon.js 

```jsx
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.19.0/dist/cannon-es.js';
```

首先先创建一个物理的世界，并且设置重力系数 9.8 

```jsx
const world = new CANNON.World();

world.gravity.set(0, -9.82, 0);
```

在物理世界中创建一个和我们 Three.js 中一一对应的小球，唯一不一样的就是需要设置 mass，就是小球的重量。

```jsx
const shape = new CANNON.Sphere(0.5);

const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
});

world.addBody(body);
```

然后我们再修改一下我们的渲染逻辑，我们需要让每一帧的渲染和物理世界对应。

```jsx
+ const clock = new THREE.Clock();
+ let oldElapsedTime = 0;

const tick = () => {
+   const elapsedTime = clock.getElapsedTime()
+   const deltaTime = elapsedTime - oldElapsedTime;
+   oldElapsedTime = elapsedTime;

+   world.step(1 / 60, deltaTime, 3);

    controls.update();

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick();
```

但是发现我们的小球并没有动静，原因是我们没有绑定物理世界中和 Three.js 小球的关系。

```jsx
const tick = () => {
	...
+ mesh.position.copy(body.position);
	...
}
```

来看看现在的样子。

![2022-05-21 20.27.23.gif](https://s3.qiufeng.blue/blog/QsHK3zdPMrbGDmwf.gif?imageView2/0/format/webp/q/75)

小球已经有了物理的特性，在做自由落体了~ 但是由于没有地面，小球落向了无尽的深渊，我们需要设置一个地板来让小球落在一个平面上。

创建 Three.js 中的地面， 这里主要用到的是 `PlaneGeometry`  它有4个参数

```jsx
PlaneGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
```

和之前类似我们只需要关注前 2 个参数，就是平面的宽和高，由于平面默认是 x-y 轴的平面，由于Three.js 默认用的是右手坐标系，对应的旋转也是右手法则，所以逆时针为正值，顺时针为负值，而我们的平面需要向顺时针旋转 90°，所以是 -PI/2 

```jsx
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: '#777777',
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI * 0.5;
scene.add(plane);
```

然后继续绑定平面的物理引擎，写法基本和 Three.js 差不多，只是 API 名字不一样

```jsx
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);
```

来看看效果：

![2022-05-22 00.16.34.gif](https://s3.qiufeng.blue/blog/43iQz5Y7RCcmpYWT.gif?imageView2/0/format/webp/q/75)

但是这个效果仿佛是一个铅球落地的效果，没有任何回弹以及其他的效果。为了让小球不像铅球一样直接落在地面上，我们需要给小球增加弹性系数。

```jsx
const defaultMaterial = new CANNON.Material("default");

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        restitution: 0.4,
    }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

...
const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
+   material: defaultMaterial,
}); 
...
```

查看效果：

![2022-05-22 01.54.06.gif](https://s3.qiufeng.blue/blog/nHaEnFzbnWTnW3zQ.gif?imageView2/0/format/webp/q/75)

海洋球池当然不能只有一个球，我们需要有很多很多球，接下来我们再来实现多个小球的情况，为了生成多个小球，我们需要写一个随机小球生成器。

```jsx
const objectsToUpdate = [];
const createSphere = (radius, position) => {
	const sphereMaterial = new THREE.MeshStandardMaterial({
	    metalness: 0.3,
	    roughness: 0.4,
	    color: Math.random() * 0xffffff
	});
	const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
	mesh.scale.set(radius, radius, radius);
	mesh.castShadow = true;
	mesh.position.copy(position);
	scene.add(mesh);
	
	const shape = new CANNON.Sphere(radius * 0.5);
	const body = new CANNON.Body({
	    mass: 1,
	    position: new CANNON.Vec3(0, 3, 0),
	    shape: shape,
	    material: defaultMaterial,
	});
	body.position.copy(position);
	
	world.addBody(body);
	
	objectsToUpdate.push({
	    mesh,
	    body,
	});
};
```

以上只是对我们之前写的代码做了一个函数封装，并且让小球的颜色随机，我们暴露出小球的位置以及小球的大小两个参数。

最后我们需要修改一下更新的逻辑，因为我们需要在每一帧修改每个小球的位置信息。

```jsx
const tick = () => {
...
for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
}
...
}
```

紧接着我们再来写一个点击事件，点击屏幕的时候能生成 100 个海洋球。

```jsx
window.addEventListener('click', () => {

  for (let i = 0; i < 100; i++) {
      createSphere(1, {
          x: (Math.random() - 0.5) * 10,
          y: 10,
          z: (Math.random() - 0.5) * 10,
      });
  }
}, false);
```

查看下效果：

![2022-05-22 02.02.11 (1).gif](https://s3.qiufeng.blue/blog/b2ABCZrYBWad8amB.gif?imageView2/0/format/webp/q/75)

初步的效果已经实现了，由于我们的池子只有底部一个平面，没有设置任何墙，所以小球就四处散开了。所以大家很容易地想到，我们需要建设4面墙，由于墙和底部平面有的区别就是有厚度，它不是一个单纯的面，因此我们需要用到新的形状 —— `BoxGeometry` , 它一共也有7个参数，但是我们也只需要关注前3个，对应的就是长宽高。

```jsx
BoxGeometry(width : Float, height : Float, depth : Float, widthSegments : Integer, heightSegments : Integer, depthSegments : Integer)
```

现在我们来建立一堵 长20, 宽 5, 厚度为 0.1 墙。

```jsx
const box = new THREE.BoxGeometry(20, 5, 0.1);
const boxMaterial = new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
});

const box = new THREE.Mesh(box, boxMaterial);
box.position.set(0, 2.5, -10);
scene.add(box)
```

现在它长成了这个样子：

![Untitled](https://s3.qiufeng.blue/blog/kYYRMeM3KcHwNK8d.png?imageView2/0/format/webp/q/75)

接着我们”依葫芦画瓢“完成剩下3面墙：

![Untitled](https://s3.qiufeng.blue/blog/SJwSe4nBJnzbMyAx.png?imageView2/0/format/webp/q/75)

然后我们也给我们的墙添加上物理引擎，让小球触摸到的时候，仿佛是真的碰到了墙，而不是穿透墙。

```jsx
const halfExtents = new CANNON.Vec3(20, 5, 0.1)
const boxShape = new CANNON.Box(halfExtents)
const boxBody1 = new CANNON.Body({
    mass: 0,
    material: defaultMaterial,
    shape: boxShape,
})

boxBody1.position.set(0, 2.5, -10);

world.addBody(boxBody1);
...
boxBody2
boxBody3
boxBody4
```

查看效果

![2022-05-22 12.34.35 (1).gif](https://s3.qiufeng.blue/blog/AWcFTNjha58tzKKP.gif?imageView2/0/format/webp/q/75)

收获满满一盆海洋球

![Untitled](https://s3.qiufeng.blue/blog/RaxGbnH7MhZ3eAFQ.png?imageView2/0/format/webp/q/75)

大功告成！

来总结一下我们本期学习的内容，一共用到  SphereGeometry、PlaneGeometry、 BoxGeometry，然后学习了 Three.js 几何体 与  物理引擎 cannon.js 绑定，让小球拥有物理的特性。

主要得步骤为

- 定义小球
- 引入物理引擎
- 将 Three.js 和 物理引擎结合
- 生成随机球
- 定义墙

好了，以上就是本章的全部内容了，下一个篇章再见。