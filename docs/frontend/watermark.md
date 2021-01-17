# 从破解某定设计网站谈前端水印(详细教程)

## 前言

最近在写公众号的时候，常常会自己做首图，并且慢慢地发现沉迷于制作首图，感觉扁平化的设计的真好好看。慢慢地萌生了一个做一个属于自己的首图生成器的想法。

![haibai-shuiyin](https://s3.qiufengh.com/blog/haibai-shuiyin.jpg?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

制作呢，当然也不是拍拍脑袋就开始，在开始之前，就去研究了一下**某在线设计网站**（如果有人不知道的话，可以说一下，这是一个在线制作海报之类的网站 T T 像我们这种内容创作者用的比较多），毕竟人家已经做了很久了，我只是想做个方便个人使用的。毕竟以上用 PS 做着还是有一些废时间，由于组成的元素都很简单，做一个自动化生成的完全可以。

但是研究着研究着，就看到了**某在线设计网站**的水印，像这种技术支持的网站，最重要的防御措施就是水印了,**水印能够很好的保护知识产权。**

慢慢地路就走偏了，开始对它的水印感兴趣了。不禁发现之前只是大概知道水印的生成方法，但是从来没有仔细研究过，本文将以以下的路线进行讲解。以下所有代码示例均在

> https://github.com/hua1995116/node-demo/tree/master/watermark

![watermark-simple](https://s3.qiufengh.com/blog/watermark-simple.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

## 明水印

>  **水印**（watermark）是一种容易识别、被夹于[纸](https://zh.wikipedia.org/wiki/纸)内，能够透过光线穿过从而显现出各种不同阴影的技术。

水印的类型有很多，有一些是整图覆盖在图层上的水印，还有一些是在角落。

![image-20201128225753178](https://s3.qiufengh.com/blog/image-20201128225753178.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

![image-20201128172843243](https://s3.qiufengh.com/blog/image-20201128172843243.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

![image-20201122184251938](https://s3.qiufengh.com/blog/image-20201122184251938.png)

那么这个水印怎么实现呢？熟悉 PS 的朋友，都知道 PS 有个叫做图层的概念。

![image-20201123230350901](https://s3.qiufengh.com/blog/image-20201123230350901.png)

网页也是如此。我们可以通过绝对定位，来将水印覆盖到我们的页面之上。

![image-20201123230659874](https://s3.qiufengh.com/blog/image-20201123230659874.png)

最终变成了这个样子。

![1606144217031](https://s3.qiufengh.com/blog/1606144217031.jpg)

等等，但是发现少了点什么。直接覆盖上去，就好像是一个蒙层，我都知道这样是无法触发底下图层的事件的，此时就要介绍一个css属性`pointer-events`。

> **`pointer-events`** CSS 属性指定在什么情况下 (如果有) 某个特定的图形元素可以成为鼠标事件的 [target](https://developer.mozilla.org/zh-CN/docs/Web/API/event.target)。

当它的被设置为 `none` 的时候，能让元素实体虚化，虽然存在这个元素，但是该元素不会触发鼠标事件。详情可以查看 [CSS3 pointer-events:none应用举例及扩展 « 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2011/12/css3-pointer-events-none-javascript/) 。

这下理清了实现原理，等于成功了一半了！

![72_c2ae29ca4f8c9769e1f8792146c8365c](https://s3.qiufengh.com/blog/72_c2ae29ca4f8c9769e1f8792146c8365c.jpg)

### 明水印的生成

明水印的生成方式主要可以归为两类，一种是 纯 html 元素(纯div)，另一种则为背景图（canvas/svg）。

下面我分别来介绍一下，两种方式。

### div实现

我们首先来讲比较简单的 div 生成的方式。就按照我们刚才说的。

```html
// 文本内容
<div class="app">
        <h1>秋风</h1>
        <p>hello</p>
</div>
```

首先我们来生成一个水印块，就是上面的 一个个`秋风的笔记`。这里主要有一点就是设置一个透明度（为了让水印看起来不是那么明显，从而不遮挡我们的主要页面），另一个就是一个旋转，如果是正的水平会显得不是那么好看，最后一点就是使用 `userSelect` 属性，让此时的文字无法被选中。

**userSelect**

> [CSS](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 属性 `user-select` 控制用户能否选中文本。除了文本框内，它对被载入为 [chrome](https://developer.mozilla.org/zh-CN/docs/Glossary/Chrome) 的内容没有影响。

```js
function cssHelper(el, prototype) {
  for (let i in prototype) {
    el.style[i] = prototype[i]
  }
}
const item = document.createElement('div')
item.innerHTML = '秋风的笔记'
cssHelper(item, {
  position: 'absolute',
  top: `50px`,
  left: `50px`,
  fontSize: `16px`,
  color: '#000',
  lineHeight: 1.5,
  opacity: 0.1,
  transform: `rotate(-15deg)`,
  transformOrigin: '0 0',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})
```

有了一个水印片，我们就可以通过计算屏幕的宽高，以及水印的大小来计算我们需要生成的水印个数。

```js
const waterHeight = 100;
const waterWidth = 180;
const { clientWidth, clientHeight } = document.documentElement || document.body;
const column = Math.ceil(clientWidth / waterWidth);
const rows = Math.ceil(clientHeight / waterHeight);
for (let i = 0; i < column * rows; i++) {
    const wrap = document.createElement('div');
    cssHelper(wrap, Object.create({
        position: 'relative',
        width: `${waterWidth}px`,
        height: `${waterHeight}px`,
        flex: `0 0 ${waterWidth}px`,
        overflow: 'hidden',
    }));
    wrap.appendChild(createItem());
    waterWrapper.appendChild(wrap)
}
document.body.appendChild(waterWrapper)
```

这样子我们就完美地实现了上面我们给出的思路的样子啦。

![image-20201130003407877](https://s3.qiufengh.com/blog/image-20201130003407877.png)

### 背景图实现

#### canvas

`canvas`的实现很简单，主要是利用`canvas` 绘制一个水印，然后将它转化为 base64 的图片，通过`canvas.toDataURL()` 来拿到文件流的 url ，关于文件流相关转化可以参考我之前写的文章[一文带你层层解锁「文件下载」的奥秘](https://juejin.cn/post/6867469476196155400), 然后将获取的 url 填充在一个元素的背景中，然后我们设置背景图片的属性为重复。

```css
.watermark {
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    pointer-events: none;
    background-repeat: repeat;
}
```

```js
function createWaterMark() {
  const angle = -20;
  const txt = '秋风的笔记'
  const canvas = document.createElement('canvas');
  canvas.width = 180;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 180, 100);
  ctx.fillStyle = '#000';
  ctx.globalAlpha = 0.1;
  ctx.font = `16px serif`
  ctx.rotate(Math.PI / 180 * angle);
  ctx.fillText(txt, 0, 50);
  return canvas.toDataURL();
}
const watermakr = document.createElement('div');
watermakr.className = 'watermark';
watermakr.style.backgroundImage = `url(${createWaterMark()})`
document.body.appendChild(watermakr);
```

#### svg

svg 和 canvas 类似，主要还是生成背景图片。

```js
function createWaterMark() {
  const svgStr =
    `<svg xmlns="http://www.w3.org/2000/svg" width="180px" height="100px">
      <text x="0px" y="30px" dy="16px"
      text-anchor="start"
      stroke="#000"
      stroke-opacity="0.1"
      fill="none"
      transform="rotate(-20)"
      font-weight="100"
      font-size="16"
      >
      	秋风的笔记
      </text>
    </svg>`;
  return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgStr)))}`;
}
const watermakr = document.createElement('div');
watermakr.className = 'watermark';
watermakr.style.backgroundImage = `url(${createWaterMark()})`
document.body.appendChild(watermakr);
```

### 明水印的破解一

以上就很快实现了水印的几种方案。但是对于有心之人来说，肯定会想着破解，以上破解也很简单。

打开了` Chrome Devtools` 找到对应的元素，直接按 `delete` 即可删除。

![image-20201128175505927](https://s3.qiufengh.com/blog/image-20201128175505927.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

### 明水印的防御

这样子的水印对于大概知道控制台操作的小白就可以轻松破解，那么有什么办法能防御住这样的操作呢？

答案是肯定的，js 有一个方法叫做 `MutationObserver`，能够监控元素的改动。

MutationObserver 对现代浏览的兼容性还是不错的，MutationObserver是元素观察器，字面上就可以理解这是用来观察Node（节点）变化的。MutationObserver是在DOM4规范中定义的，它的前身是MutationEvent事件，最低支持版本为 ie9 ，目前已经被弃用。

![img](https://s3.qiufengh.com/blog/164f589be481b344.png)

在这里我们主要观察的有三点

- 水印元素本身是否被移除
- 水印元素属性是否被篡改（display: none ...）
- 水印元素的子元素是否被移除和篡改 （element生成的方式 ）

来通过 MDN 查看该方法的使用示例。

```js
const targetNode = document.getElementById('some-id');

// 观察器的配置（需要观察什么变动）
const config = { attributes: true, childList: true, subtree: true };

// 当观察到变动时执行的回调函数
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);
```

而`MutationObserver`主要是监听子元素的改动，因此我们的监听对象为 `  document.body`, 一旦监听到我们的水印元素被删除，或者属性修改，我们就重新生成一个。通过以上示例，加上我们的思路，很快我们就写一个监听删除元素的示例。（监听属性修改也是类似就不一一展示了）

```js
// 观察器的配置（需要观察什么变动）
const config = { attributes: true, childList: true, subtree: true };
// 当观察到变动时执行的回调函数
const callback = function (mutationsList, observer) {
// Use traditional 'for loops' for IE 11
  for (let mutation of mutationsList) {
    mutation.removedNodes.forEach(function (item) {
      if (item === watermakr) {
      	document.body.appendChild(watermakr);
      }
    });
  }
};
// 监听元素
const targetNode = document.body;
// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);
// 以上述配置开始观察目标节点
observer.observe(targetNode, config);
```

我们打开控制台来检验一下。

![2020-11-28-21.11.25](https://s3.qiufengh.com/blog/2020-11-28-21.11.25.gif)

这回完美了，能够完美抵御一些开发小白了。

那么这样就万无一失了吗？显然，道高一尺魔高一丈，毕竟前端的一切都是不安全的。

### 明水印的破解二

在一个高级前端工程师面前，一切都是纸老虎。接下来我就随便介绍三种破解的方式。

#### 第一种

打开` Chrome Devtools`，点击设置 - Debugger - Disabled JavaScript .

![1606569631600](https://s3.qiufengh.com/blog/1606569631600.jpg?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

然后再打开页面，`delete`我们的水印元素。

![image-20201128212007999](https://s3.qiufengh.com/blog/image-20201128212007999.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

#### 第二种

复制一个 body 元素，然后将原来 body 元素的删除。

![image-20201128212148446](https://s3.qiufengh.com/blog/image-20201128212148446.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

#### 第三种

打开一个代理工具，例如 `charles`，将生成水印相关的代码删除。

### 破解实践

接下来我们实战一下，通过预先分析，我们看到某在线设计网站的内容是以 div 的方式实现的，所以可以利用这种方案。 打开 https://www.gaoding.com/design?id=33931419&simple=1  (仅供举例学习)

![image-20201128212301927](https://s3.qiufengh.com/blog/image-20201128212301927.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

打开控制台，`Ctrl + F` 搜索 `watermark` 相关字眼。（这一步是作为一个程序员的直觉，基本上你要找什么，搜索对应的英文就可以 ~）

![image-20201128212425716](https://s3.qiufengh.com/blog/image-20201128212425716.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

很快我们就找到了水印图。发现直接删除，没有办法删除水印元素，根据我们刚才学习的，肯定是利用了`MutationObserver`  方法。我们使用我们的第一个破解方法，将 JavaScript 禁用，再将元素删除。

![image-20201128212612430](https://s3.qiufengh.com/blog/image-20201128212612430.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

水印已经消失了。

但是这样真的就万事大吉了吗？

![image-20201123233342701](https://s3.qiufengh.com/blog/image-20201123233342701.png)

不知道你有没有听过一种东西，看不见摸不着，但是它却真实存在，他的名字叫做暗水印，我们将时间倒流到 16 年间的月饼门事件，因为有员工将内网站点截图了，但是很快被定位出是谁截图了。

![](https://pic1.zhimg.com/80/ba2894f9f99e05ec9219679512fbf362_1440w.jpg?source=1940ef5c)

虽然你将一些可见的水印去除了，但是还会存在一些不可见的保护版权的水印。（这就是防止一些坏人拿去作另外的用途）

## 暗水印

>  暗水印是一种肉眼不可见的水印方式，可以保持图片美观的同时，保护你的资源版权。

暗水印的生成方式有很多，常见的为通过修改**RGB 分量值的小量变动**、DWT、DCT 和 FFT 等等方法。

通过介绍前端实现 **RGB 分量值的小量变动** 来揭秘其中的奥秘，主要参考 [不能说的秘密——前端也能玩的图片隐写术 | AlloyTeam](http://www.alloyteam.com/2016/03/image-steganography/#prettyPhoto)。

我们都知道图片都是有一个个像素点构成的，每个像素点都是由 RGB 三种元素构成。当我们把其中的一个分量修改，人的肉眼是很难看出其中的变化，甚至是像素眼的设计师也很难分辨出。

![image-20201128213551039](https://s3.qiufengh.com/blog/image-20201128213551039.png)

你能看出其中的差别吗？根据这个原理，我们就来实践吧。(女孩子可以掌握方法后可以拿以下图片进行试验测试)

![qiufeng-super](https://s3.qiufengh.com/blog/qiufeng-super.png)

首先拿到以上图片，我们先来讲解解码方式，解码其实很简单，我们需要创建一个规律，再通过我们的规律去解码。现在假设的规律为，我们将所有像素的 R 通道的值为奇数的时候我们创建的通道密码，举个简单的例子。

![image-20201128220542389](https://s3.qiufengh.com/blog/image-20201128220542389.png)

例如我们把以上当做是一个图形，加入他要和一个中文的 "一" 放进图像，例如我们将 "一" 放入第二行。按照我们的算法，我们的图像会变成这个样子。

![image-20201128220833657](https://s3.qiufengh.com/blog/image-20201128220833657.png)

解码的时候，我们拿到所有的奇数像素将它渲染出来，例如这里的 '5779' 是不是正好是一个 "一"，下面就转化为实践。

### 解码过程

首先创建一个 `canvas` 标签。

```html
 <canvas id="canvas" width="256" height="256"></canvas>
```

```js
var ctx = document.getElementById('canvas').getContext('2d');
var img = new Image();
var originalData;
img.onload = function () {
  // canvas像素信息
  ctx.drawImage(img, 0, 0);
  originalData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  console.log()
  processData(ctx, originalData)
};
img.src = 'qiufeng-super.png';
```

我们打印出这个数组，会有一个非常大的数组，一共有 256 * 256 * 4 = 262144 个值。因为每个像素除了 RGB 外还有一个 alpha 通道，也就是我们常用的透明度。

![image-20201128215615494](https://s3.qiufengh.com/blog/image-20201128215615494.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

上面也说了，我们的 R 通道为奇数的时候 ，就我们的解密密码。因此我们只需要所有的像素点的 R 通道为奇数的时候，将它填填充，不为奇数的时候就不填充，很快我们就能得到我们的隐藏图像。

```js
var processData = function (ctx, originalData) {
    var data = originalData.data;
    for (var i = 0; i < data.length; i++) {
        if (i % 4 == 0) {
            // R分量
            if (data[i] % 2 == 0) {
                data[i] = 0;
            } else {
                data[i] = 255;
            }
        } else if (i % 4 == 3) {
            // alpha通道不做处理
            continue;
        } else {
            // 关闭其他分量，不关闭也不影响答案
            data[i] = 0;
        }
    }
    // 将结果绘制到画布
    ctx.putImageData(originalData, 0, 0);
}
processData(ctx, originalData)
```

解密完会出现类似于以下这个样子。

![image-20201128220100175](https://s3.qiufengh.com/blog/image-20201128220100175.png)

那我们如何加密的，那就相反的方式就可以啦。(这里都用了 [不能说的秘密——前端也能玩的图片隐写术](http://www.alloyteam.com/2016/03/image-steganography/) 中的例子，= = 我也能写出一个例子，但是觉得没必要，别人已经写得很好了，我们只是讲述这个方法，需要代码来举例而已)

### 编码过程

加密呢，首先我们需要获取加密的图像信息。

```js
var textData;
var ctx = document.getElementById('canvas').getContext('2d');
ctx.font = '30px Microsoft Yahei';
ctx.fillText('秋风的笔记', 60, 130);
textData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
```

然后提取加密信息在待加密的图片上进行处理。

```js
var mergeData = function (ctx, newData, color, originalData) {
    var oData = originalData.data;
    var bit, offset;  // offset的作用是找到alpha通道值，这里需要大家自己动动脑筋

    switch (color) {
        case 'R':
            bit = 0;
            offset = 3;
            break;
        case 'G':
            bit = 1;
            offset = 2;
            break;
        case 'B':
            bit = 2;
            offset = 1;
            break;
    }

    for (var i = 0; i < oData.length; i++) {
        if (i % 4 == bit) {
            // 只处理目标通道
            if (newData[i + offset] === 0 && (oData[i] % 2 === 1)) {
                // 没有信息的像素，该通道最低位置0，但不要越界
                if (oData[i] === 255) {
                    oData[i]--;
                } else {
                    oData[i]++;
                }
            } else if (newData[i + offset] !== 0 && (oData[i] % 2 === 0)) {
                // // 有信息的像素，该通道最低位置1，可以想想上面的斑点效果是怎么实现的
                oData[i]++;
            }
        }
    }
    ctx.putImageData(originalData, 0, 0);
}
```

主要的思路还是我一开始所讲的，在有像素信息的点，将 R 偶数的通道+1。在没有像素点的地方将 R 通道转化成偶数，最后在 `img.onload` 调用 `processData(ctx, originalData)` 。

```js
img.onload = function () {
  // 获取指定区域的canvas像素信息
  ctx.drawImage(img, 0, 0);
  originalData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  console.log(originalData)
	processData(ctx, originalData)
};
```

以上方法就是一种比较简单的加密方式。以上代码都放到了仓库 `watermark/demo/canvas-dark-watermark.html` 路径下，方法都封装好了~。

但是实际过程需要更专业的加密方式，例如利用傅里叶变化公式，来进行频域制定数字盲水印，这里就不详细展开讲了，以后研究完再详细讲~

 

![img](https://images2015.cnblogs.com/blog/900740/201705/900740-20170501131510273-349045491.png)



### 破解实践

听完上述的介绍，那么某在线设计网站是不是很有可能使用了暗水印呢？

当然啦，通过我对某在线设计网站的分析，我分析了以下几种情况，我们一一来进行测试。

![暗水印2](https://s3.qiufengh.com/blog/暗水印2.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

我们先通过免费下载的图片来进行分析。打开 https://www.gaoding.com/design?id=13964513159025728&mode=user

![image-20201128230510959](https://s3.qiufengh.com/blog/image-20201128230510959.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

![image-20201128230557383](https://s3.qiufengh.com/blog/image-20201128230557383.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

通过实验（实验主要是去分析他各个场景下触发的请求），发现在下载免费图片的时候，发现它都会去向阿里云发送一个 POST 请求，这熟悉的请求域名以及熟悉的数据封装方式，这不就是 阿里云 OSS 客户端上传方式嘛。这就好办了，我们去查询一下阿里云是否有生成暗水印的相关方式，从而来看看某在线设计网站是否含有暗水印。很快我们就从官方文档搜索到了相关的文档，且对于低 QPS 是免费的。（这就是最好理解的连带效应，例如我们觉得耐克阿迪啥卖运动类服饰，你买了他的鞋子，可能还会想买他的衣服）

![image-20201128231110192](https://s3.qiufengh.com/blog/image-20201128231110192.png?imageView2/0/q/75|watermark/1/image/aHR0cHM6Ly9zMy5xaXVmZW5naC5jb20vd2F0ZXJtYXJrL3dhdGVybWFyay5wbmc=/dissolve/50/gravity/SouthEast/dx/0/dy/0)

```js
const { RPCClient } = require("@alicloud/pop-core");
var client = new RPCClient({
  endpoint: "http://imm.cn-shenzhen.aliyuncs.com",
  accessKeyId: 'xxx',
  accessKeySecret: 'xxx',
  apiVersion: "2017-09-06",
});
(async () => {
  try {
        var params = {
          Project: "test-project",
          ImageUri: "oss://watermark-shenzheng/source/20201009-182331-fd5a.png",
            TargetUri: "oss://watermark-shenzheng/dist/20201009-182331-fd5a-out.jpg",
            Model: "DWT"
        };
        var result = await client.request("DecodeBlindWatermark", params);
        
        console.log(result);
      } catch (err) {
        console.log(err);
      }
})()
```

我们写了一个demo进行了测试。由于阿里云含有多种暗水印加密方式，为啥我使用了 `DWT` 呢？因为其他几种都需要原图，而我们刚才的测试，他上传只会上传一个文件到 OSS ，因此大致上排除了需要原图的方案。

![image-20201128231801100](https://s3.qiufengh.com/blog/image-20201128231801100.png)

但是我们的结果却没有发现任何加密的迹象。

为什么我们会去猜想阿里云的图片暗水印的方式？因为从上传的角度来考虑，我们上传的图片 key 的地址即是我们下载的图片，也就是现在存在两种情况，一就是通过阿里云的盲水印方案，另一种就是上传前进行了水印的植入。现在看来不是阿里云水印的方案，那么只是能是上传前就有了水印。

这个过程就有两种情况，一是生成的过程中加入的水印，前端加入的水印。二是物料图含有水印。

对于第一种情况，我们可以通过 `dom-to-image` 这个库，在前端直接进行下载，或者使用截图的方式。目前通过直接下载和通过站点内生成，发现元素略有不同。

![image-20201128235427912](https://s3.qiufengh.com/blog/image-20201128235427912.png)

第一个为我通过 `dom-to-image` 的方式下载，第二种为站点内下载，明显大了一些。（有点怀疑他在图片生成中可能做了什么手脚）

但是感觉前端加密的方式比较容易破解，最坏的情况想到了对素材进行了加密，但是这样的话就无从破解了（但是查阅了一些资料，由于某在线设计网站站点素材大多是透明背景的，这种加密效果可能会弱一些，以后牛逼了再来补充）。目前这一块暂时还不清楚，探究止步于此了。

### 攻击实验

那如果一张图经过暗水印加密，他的抵抗攻击性又是如何呢？

![1605680005172-out1](https://s3.qiufengh.com/blog/1605680005172-out1.jpg)

![1605680005172-decode2](https://s3.qiufengh.com/blog/1605680005172-decode2.jpg)

这是一张通过阿里云 `DWT`暗水印进行的加密，解密后的样子为"秋风"字样，我们分别来测试一下。

#### 加一些元素

![1605680005172-out-el](https://s3.qiufengh.com/blog/1605680005172-out-el.jpg)

![1605680005172-decode-out-el](https://s3.qiufengh.com/blog/1605680005172-decode-out-el.jpg)

结果: 识别效果不错

#### 截图

![1605680005172-out-cut1](https://s3.qiufengh.com/blog/1605680005172-out-cut1.jpg)

![1605680005172-decode-out-cut1](https://s3.qiufengh.com/blog/1605680005172-decode-out-cut1.jpg)



结果: 识别效果不错

#### 大小变化

![1605680005172-out-scale](https://s3.qiufengh.com/blog/1605680005172-out-scale.jpg)

![1605680005172-out-decode-scale](https://s3.qiufengh.com/blog/1605680005172-out-decode-scale.jpg)

结果：识别效果不错

#### 加蒙层

![1605680005172-out-bg](https://s3.qiufengh.com/blog/1605680005172-out-bg.jpg)

![1605680005172-decode-out-bg](https://s3.qiufengh.com/blog/1605680005172-decode-out-bg.jpg)

结果： 直接就拉胯了。

**可见，暗水印的抵抗攻击性还是蛮强的，是一种比较好的抵御攻击的方式~**

## 最后

以上仅仅为技术交流~ 大家不要在实际的场景盲目使用，商业项目违规使用后果自负 ~ 或者期待一下我接下来想搞的这个个人免费首图生成器~ 喜欢文章的小伙伴可以点个赞哦 ~ 欢迎关注公众号 **秋风的笔记** ，学习前端不迷路。



## 参考

https://imm.console.aliyun.com/cn-shenzhen/project?accounttraceid=1280c6af416744a38e9acf63c4e0878cjdet

https://help.aliyun.com/document_detail/138800.html?spm=a2c4g.11186623.6.656.3bd46bb4oglhEr

https://oss.console.aliyun.com/bucket/oss-cn-shenzhen/watermark-shenzheng/object?path=dist%2F

https://juejin.cn/post/6844903650054111246

https://www.zhihu.com/question/50677827/answer/122388524

https://www.zhihu.com/question/50735753








