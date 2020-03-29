# web上的原生图片懒加载(译)


原文链接: https://addyosmani.com/blog/


在这篇文章中，我们将看一下新的[加载](https://github.com/scott-little/lazyload)属性，它将原生的`<img>`和`<iframe>`延迟加载到网页上！ 对于好奇的人来说，这里有一个实际的预览：

```html
<img src="celebration.jpg" loading="lazy" alt="..." />
<iframe src="video-player.html" loading="lazy"></iframe>
```

我们希望在 ~ [Chrome 75](https://chromestatus.com/feature/5645767347798016) 能够正式使用以及正在深入研究我们即将发布的功能,让我们深入了解 loading 的工作原理。

## 引言

网页通常包含大量图像，这些图像会导致数据使用，页面膨胀以及页面加载的速度。许多这些图像都在屏幕外，需要用户滚动才能查看它们。

在以前，为了限制屏幕外图像对页面加载时间的影响，开发人员需要使用JavaScript库（如 [LazySizes](https://github.com/aFarkas/lazysizes)）来推迟获取这些图像，直到用户在它们附近滚动。


![without-lazyload@2x.png](https://s3.qiufengh.com//blog/without-lazyload@2x.png)

一个页面加载211张图片, 没有延迟加载的版本需要获取10MB的图像数据。 延迟加载版本（使用LazySizes）预先加载250KB - 当用户滚动体验时，将获取其他图像。 看 [WPT](https://webpagetest.org/video/compare.php?tests=190406_2K_30b9b9cd6b48735a41bce2daee27b7f5,190406_6R_4ce0ac65b7e11d2e132e4ea8d887edd9)

如果浏览器可以避免为您加载这些屏幕外图像怎么样？这将有助于更快地加载视图端口中的内容，减少整体网络数据使用和低端设备，减少内存使用。很好，我很高兴地分享，很快就可以使用图片和iframe的新加载属性。

### loading 属性

`loading`属性允许浏览器推迟加载屏幕外图像和iframe，直到用户在它们附近滚动。 loading支持三个值：

- lazy: 是延迟加载的一个很好的选择。
- eager: 不适合延迟加载。马上加载。
- auto: 浏览器将确定是否懒加载。

不指定属性将与设置load = auto具有相同的影响。

![loading-attribute@2x.png](https://s3.qiufengh.com//blog/loading-attribute@2x.png)

`<img>`和`<iframe>`的加载属性正在作为[HTML标准](https://github.com/whatwg/html/pull/3752)的一部分进行处理。



## Example 

loading属性适用于`<img>`（包括srcset和`<picture>`内部）以及`<iframe>`：

```html
<!-- Lazy-load an offscreen image when the user scrolls near it -->
<img src="unicorn.jpg" loading="lazy" alt=".."/>

<!-- Load an image right away instead of lazy-loading -->
<img src="unicorn.jpg" loading="eager" alt=".."/>

<!-- Browser decides whether or not to lazy-load the image -->
<img src="unicorn.jpg" loading="auto" alt=".."/>

<!-- Lazy-load images in <picture>. <img> is the one driving image 
loading so <picture> and srcset fall off of that -->
<picture>
  <source media="(min-width: 40em)" srcset="big.jpg 1x, big-hd.jpg 2x">
  <source srcset="small.jpg 1x, small-hd.jpg 2x">
  <img src="fallback.jpg" loading="lazy">
</picture>

<!-- Lazy-load an image that has srcset specified -->
<img src="small.jpg"
     srcset="large.jpg 1024w, medium.jpg 640w, small.jpg 320w"
     sizes="(min-width: 36em) 33.3vw, 100vw"
     alt="A rad wolf" loading="lazy">

<!-- Lazy-load an offscreen iframe when the user scrolls near it -->
<iframe src="video-player.html" loading="lazy"></iframe>

```

“当用户滚动到附近时”的确切启发式方法留给浏览器。一般来说，我们希望浏览器在进入视口之前会开始提取延迟img和iframe内容。这将增加img或iframe在用户滚动到它们时完成加载的更改。

注意：我建议我们将其命名为loading属性，因为它的命名与解码属性更接近。 以前的提议，例如lazyload属性，并不是因为我们需要支持多个值（lazy, eager 和 auto）。

## 功能兼容性测试

我们一直在考虑能够为 lazy-loading 提取和应用JavaScript库的重要性（对于跨浏览器支持）。 可以按如下方式检测对加载的支持：

```html
<script>
if ('loading' in HTMLImageElement.prototype) { 
    // Browser supports `loading`..
} else {
   // Fetch and apply a polyfill/JavaScript library
   // for lazy-loading instead.
}
</script>
```

注意：您还可以使用 loading 作为渐进增强。 支持该属性的浏览器可以使用load = lazy获取新的延迟加载行为，而不支持该属性的浏览器仍然会加载图像。

### 跨浏览器图像 lazy-loading

如果对延迟加载图像的跨浏览器支持很重要，那么如果在标记中使用`<img src = unicorn.jpg loading = lazy />`，那么仅对功能检测和延迟加载库是不够的。


标记需要使用类似`<img data-src = unicorn.jpg />`（而不是src，srcset或`<source>`）的东西，以避免在不支持新属性的浏览器中触发直接加载。 如果支持加载，可以使用JavaScript将这些属性更改为正确的属性，否则使用加载库。 你可以将其视为混合延迟加载。

### 下面是一个示例，展示了它可能的样子。

- 视口内/上方图像是常规的`<img>`标签。data-src会破坏预加载扫描程序，因此我们希望避免它出现在视口中的所有内容。
- 我们在图像上使用data-src以避免在不受支持的浏览器中出现直接的loading。 如果支持加载，我们将data-src转化为src
- 如果不支持加载，我们加载回退（LazySizes）并启动它。在这里，我们使用class = lazyload作为指示我们想要延迟加载的LazySizes图像的方法。

```html
<!-- Let's load this in-viewport image normally -->
<img src="hero.jpg" alt=".."/>

<!-- Let's lazy-load the rest of these images -->
<img data-src="unicorn.jpg" loading="lazy" alt=".." class="lazyload"/>
<img data-src="cats.jpg" loading="lazy" alt=".." class="lazyload"/>
<img data-src="dogs.jpg" loading="lazy" alt=".." class="lazyload"/>

<script>
  if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll("img.lazyload");
      images.forEach(img => {
          img.src = img.dataset.src;
      });
  } else {
      // Dynamically import the LazySizes library
    let script = document.createElement("script");
    script.async = true;
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.1.8/lazysizes.min.js";
    document.body.appendChild(script);
  }
</script>
```

以上是上述的替代方法，它依赖于[动态导入](https://developers.google.com/web/updates/2017/11/dynamic-import)来执行相同的降级库fetching：


```html
<!-- Let's load this in-viewport image normally -->
<img src="hero.jpg" alt=".."/>

<!-- Let's lazy-load the rest of these images -->
<img data-src="unicorn.jpg" loading="lazy" alt=".." class="lazyload"/>
<img data-src="cats.jpg" loading="lazy" alt=".." class="lazyload"/>
<img data-src="dogs.jpg" loading="lazy" alt=".." class="lazyload"/>

<script>
(async () => {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll("img.lazyload");
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Dynamically import the LazySizes library
        const lazySizesLib = await import('/lazysizes.min.js');
        // Initiate LazySizes (reads data-src & class=lazyload)
        lazySizes.init(); // lazySizes works off a global.
    }
})();
</script>
```

Andrea Verlicchi有一篇很好的文章，也看到 [hybrid lazy-loading](https://www.smashingmagazine.com/2019/05/hybrid-lazy-loading-progressive-migration-native/) 值得一读。

## Demo

[A loading=lazy demo featuring exactly 100 kitten pics](https://mathiasbynens.be/demo/img-loading-lazy) 是可用的。 看看这个！

<iframe width="640" height="320" src="https://www.youtube.com/embed/ZBvvCdhLKdw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Chrome 实现细节

我们强烈建议等待loading属性处于稳定版本你才可以将它使用于生产环境。 早期测试人员可能会发现以下注释很有帮助

### 尝试

转到chrome：// flags并打开“启用延迟帧加载”和“启用延迟图像加载”标志，然后重新启动Chrome。

### 配置

Chrome的延迟加载实现不仅基于当前滚动位置的接近程度，还基于连接速度。 对于不同连接速度，延迟帧和图像加载距离视口阈值是硬编码的，但可以从命令行覆盖。 这是一个覆盖图像的延迟加载设置的示例：

```shell
canary --user-data-dir="$(mktemp -d)" --enable-features=LazyImageLoading --blink-settings=lazyImageLoadingDistanceThresholdPxUnknown=5000,lazyImageLoadingDistanceThresholdPxOffline=8000,lazyImageLoadingDistanceThresholdPxSlow2G=8000,lazyImageLoadingDistanceThresholdPx2G=6000,lazyImageLoadingDistanceThresholdPx3G=4000,lazyImageLoadingDistanceThresholdPx4G=3000 'https://mathiasbynens.be/demo/img-loading-lazy'
```

以上命令对应于（当前）默认配置。 仅当滚动位置在图像的400像素内时，才将所有值更改为400以开始延迟加载。 下面我们还可以看到1像素的变化（本文前面的视频使用）：

```
canary --user-data-dir="$(mktemp -d)" --enable-features=LazyImageLoading --blink-settings=lazyImageLoadingDistanceThresholdPxUnknown=1,lazyImageLoadingDistanceThresholdPxOffline=1,lazyImageLoadingDistanceThresholdPxSlow2G=1,lazyImageLoadingDistanceThresholdPx2G=1,lazyImageLoadingDistanceThresholdPx3G=1,lazyImageLoadingDistanceThresholdPx4G=1 'https://mathiasbynens.be/demo/img-loading-lazy'
```

随着实施在未来几周内稳定，我们的默认配置很可能会发生变化。

### DevTools

在Chrome中加载的实现细节是它在页面加载时获取前2KB的图像。 如果服务器支持范围请求，则前2KB可能包含图像尺寸。 这使我们能够生成/显示具有相同尺寸的占位符。 前2KB也可能包括像图标这样的资产的整个图像。

![lazy-load-devtools.png](https://s3.qiufengh.com//blog/lazy-load-devtools.png)

当用户即将看到它时，Chrome会抓取其余的图像字节。Chrome DevTools的一个警告是，这可能导致（1）在DevTools网络面板中“出现”双重提取和（2）资源计时对每个图像有2个请求。

### 确定服务器上的加载支持

在理想的情况下，您不需要依赖客户机上的JavaScript特性检测来决定是否需要加载降级库——您可以在提供包含JavaScript延迟加载库的HTML之前处理这个问题。客户机提示可以启用这样的检查。

正在考虑传递 loading 首选项的提示，但目前处于早期讨论阶段。

## 总结

给`<img loading>`一个建议，让我们知道你的想法。 我对人们如何找到跨浏览器的故事以及是否有任何我们错过的边缘情况特别感兴趣。 我们希望今年夏天在Chrome 76上发布loading属性。


## 参考文献

- https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/jxiJvQc-gVg/wurng4zZBQAJ
- https://github.com/whatwg/html/pull/3752
- https://github.com/scott-little/lazyload
- https://mathiasbynens.be/demo/img-loading-lazy