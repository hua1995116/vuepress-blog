# 我惊了，文件下载原来有这么多玄机

【硬核】一文搞懂文件下载的奥秘。



不整不知道一整下一跳，大家好我是秋风，今天给大家带来的是

大家好，我是秋风，我的文章首发微信公众号 `秋风的笔记`，回复`陪伴` 二次，可加微信并且加入交流群，`秋风的笔记` 将一直陪伴你的左右。今天带来的主题是关于文件下载，在我之前曾经发过一篇文件上传的文章，反响还不错，时隔多日，由于最近有研究一些流媒体相关的下载，因此打算对下载做一个整理，因此他的兄弟篇 《文件下载原来有这么多玄机》 诞生了，带你领略文件下载的奥秘。本文会花费你较长的时间阅读，建议先收藏/点赞，然后查看你感兴趣的部分，平时也可以充当当做字典的效果来查询。

:) 不整不知道，一整，居然整出这么多情况，我只是想简单地做个页面仔。



后端

​	后端返回文件流

​	后端返回静态站点地址

​	后端返回字符串（base64）

前端	

​	原生代码实现下载

​		json

​		excel

​		word

​		批量打包下载

​		图片下载

​		canvas 下载

​	使用插件下载

​	下载到对应目录（实验性）

补充知识

​	多端的文件下载

​		electron

​		移动端

​			安卓

​			ios

​	大文件的分片下载（流媒体偏多）

​		nginx配置

​		node配置

​	自己小玩具试验

​		分片加速下载



本文后端所有示例均以 koa / 原生 js 实现。

## 后端

### 后端返回文件流

这种情况非常简单，我们只需要直接将后端接口以新的窗口打开，即可直接下载了。

```html
// 前端代码
<button id="oBtnDownload">点击下载</button>
<script src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
<script>
function download(url) {
    const aTag = document.createElement('a');
    aTag.download = url.split('/').pop();
    aTag.href = url;
    aTag.click()
}
oBtnDownload.onclick = function(){
    axios.get('http://localhost:8888/api/downloadUrl').then(res => {
        if(res.data.code === 0) {
            download(res.data.data.url);
        }
    })
}
</script>
```

```javascript
// 后端代码
router.get('/api/download', async (ctx) => {
    const { filename } = ctx.query;
    const fStats = fs.statSync(path.join(__dirname, './static/', filename));
    ctx.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${filename}`,
        'Content-Length': fStats.size
    });
    ctx.body = fs.readFileSync(path.join(__dirname, './static/', filename));
})
```

此形式主要是利用了 `Content-Disposition` 属性

我们来看看该字段的描述

> 在常规的HTTP应答中，`Content-Disposition` 响应头指示回复的内容该以何种形式展示，是以**内联**的形式（即网页或者页面的一部分），还是以**附件**的形式下载并保存到本地   --- 来源 MDN(https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Disposition)

再来看看它的语法

```
Content-Disposition: inline
Content-Disposition: attachment
Content-Disposition: attachment; filename="filename.jpg"
```

很简单，只要设置成最后一种形态我就能成功让文件从后端进行下载了。

### 后端返回静态站点地址

通过静态站点下载，这里要分为两种情况，一种为可能该服务自带静态目录，即为同源情况，第二种情况为适用了第三方静态存储平台，例如阿里云、腾讯云之类的进行托管，即非同源（当然也有些平台直接会返回）。

当我们拥有一个url ，很自然地就可以想到，`<a>` 标签，因为通过 `<a>`标签的 `download` 属性可以轻松地实现下载。

**简介**

`download`此属性指示浏览器下载 URL 而不是导航到它，因此将提示用户将其保存为本地文件。如果属性有一个值，那么此值将在下载保存过程中作为预填充的文件名（如果用户需要，仍然可以更改文件名）。此属性对允许的值没有限制，但是 `/` 和 `\` 会被转换为下划线。大多数文件系统限制了文件名中的标点符号，故此，浏览器将相应地调整建议的文件名。(参考 https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a)

> **注意:**
>
> - 此属性仅适用于[同源 URL](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)。
> - 尽管 HTTP URL 需要位于同一源中，但是可以使用 [`blob:` URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL.createObjectURL) 和 [`data:` URL](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) ，以方便用户下载使用 JavaScript 生成的内容（例如使用在线绘图 Web 应用程序创建的照片）。

**兼容性**

可以看到它的兼容性也非常的可观（https://www.caniuse.com/#search=download）

![image-20200817232216749](https://s3.qiufengh.com/blog/image-20200817232216749.png)

> 注： Chrome65 之前是支持 `download` 属性触发文件跨域下载的，之后则严格遵循同源策略，无法再通过 `download` 属性触发跨域资源的下载。而 FireFox 一直不支持跨域资源的 `download` 属性下载。

大致介绍了 `download`属性，我们可以知道这个 `download` 没有有它表现地这么简单，因此我们从同源和非同源分别讨论它的下载情况。

#### 同源

同源情况下是真的非常简单, 先上代码，直接调用一下函数就能轻松实现下载。

```js
function download(url) {
    const aTag = document.createElement('a');
    aTag.download = url.split('/').pop();
    aTag.href = url;
    aTag.click()
}
download(xxxx);
```

#### 非同源

我们也可以从 MDN 上看到，虽然 download 限制了非同源的情况，但是！！但是！！但是可以使用 [`blob:` URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL.createObjectURL) 和 [`data:` URL](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) ，因此我们只要将文件内容进行下载转化成 `blob` 就可以了。

```js
function download(url) {
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "blob";
    req.withCredentials = true;   
    req.onload = function (oEvent) {
        const content = req.response;
        const aTag = document.createElement('a');
        aTag.download = url.split('/').pop();
        const blob = new Blob([content])
        const blobUrl = URL.createObjectURL(blob);
        aTag.href = blobUrl;
        aTag.click();
        URL.revokeObjectURL(blob);
    };
    req.send();
}
download(xxxx)
```

现在我们也可以愉快地调用非同源的情况啦。

### 后端返回字符串（base64）

有时候我们也会遇到一些新手后端返回字符串的情况，这种情况很少见，但是来了我们也不慌，顺便可以向后端小哥秀一波操作，不管啥数据，咱都能给你下载下来。

>  ps: 前提是安全无污染 :)  , 我们是正经的文章。

这种情况下，我需要模拟下后端小哥的骚操作，因此有后端代码。

```js
// node 端
router.get('/api/base64', async (ctx) => {
    const { filename } = ctx.query;
    const content = fs.readFileSync(path.join(__dirname, './static/', filename));
    const fStats = fs.statSync(path.join(__dirname, './static/', filename));
    console.log(fStats);
    ctx.body = {
        code: 0,
        data: {
            base64: content.toString('base64'),
            filename,
            type: mime.getType(filename)
        }
    }
})
```

```html
// 前端
    <button id="oBtnDownload">点击下载</button>
<script src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
<script>
function download({ base64, filename, type }) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const array = Uint8Array.from(byteNumbers);
    const blob = new Blob([array], {type});
    const blobUrl = URL.createObjectURL(blob);
    const aTag = document.createElement('a');
    aTag.download = filename;
    aTag.href = blobUrl;
    aTag.click();
    URL.revokeObjectURL(blob);
}
oBtnDownload.onclick = function(){
    axios.get('http://localhost:8888/api/base64?filename=1597375650384.jpg').then(res => {
        if(res.data.code === 0) {
            download(res.data.data);
        }
    })
}
```

思路其实还是利用了我们上面说的 `<a>` 标签。但是在这个步骤前，多了一个步骤就是，需要将我们的 `base64` 字符串转化为二进制流，这个东西，在我的前一篇文件上传中也常常提到，毕竟文件就是以二进制流的形式存在。不过也很简单，js 拥有内置函数 `atob`。 极大地提高了我们转换的效率。

## 纯前端	

上面介绍借助后端来完成文件下载的相关方法，接下来我们来介绍介绍纯前端来完成文件下载的方法。

### json/text

下载text和json非常的简单，可以直接构造一个 Blob。

```
Blob(blobParts[, options])
返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
```

```html
// html
<textarea name="" id="text" cols="30" rows="10"></textarea>
<button id="textBtn">下载文本</button>
<p></p>
<textarea name="" id="json" cols="30" rows="10" disabled>
{
    "name": "秋风的笔记"
}
</textarea>
<button id="jsonBtn">下载JSON</button>
```

```js
//js
function downloadFun(obj, type, filename) {
        const blob = new Blob([obj], {type});
        const blobUrl = URL.createObjectURL(blob);
        const aTag = document.createElement('a');
        aTag.download = filename;
        aTag.href = blobUrl;
        aTag.click();
        URL.revokeObjectURL(blob);
}
textBtn.onclick = () => { // 下载text
        const value = text.value;
        downloadFun(value, 'text/plain', 'hello.txt');
}
jsonBtn.onclick = () => { // 下载json
        const value = json.value;
        downloadFun(value, 'application/json', 'hello.json');
}
```

### excel/word

excel 能干嘛呢？

主要是报表



word 和 excel 采用的是 `Office Open XML`规范(http://www.officeopenxml.com/)

我这里就来列一下 excel 和 word 分别怎么下载。

https://kodango.com/talking-about-the-structure-of-word-document

http://www.officeopenxml.com/

http://www.openoffice.org/

https://github.com/open-xml-templating/docxtemplater

https://stackoverflow.com/questions/15899883/generate-a-word-document-in-javascript-with-docx-js

https://stackoverflow.com/questions/44404622/create-simple-xlsx-excel-file-from-javascript-or-jquery

https://docx.js.org/#/

https://segmentfault.com/a/1190000018143902







https://docxtemplater.readthedocs.io/en/latest/installation.html#browser

https://docxtemplater.readthedocs.io/en/latest/generate.html#browser

https://docxtemplater.com/modules/html/

https://github.com/open-xml-templating/docxtemplater



https://github.com/dolanmiu/docx

https://codepen.io/dolanmiu/pen/RwNeObg?__cf_chl_jschl_tk__=ebcb82175aed7bd2ac283da59cf22f598746baba-1598456495-0-Ab08PRnTAQlbWh_I9KFXPbXZqX53iVYQa_XQae1axk3I1hFphogr_DWG5d9m9MUADlD37WD36FzUXormccVYpQ53SnJmN8IdHP8uRtfuQJ675jSnp2qmZhMyGXLSAfJR7WMHY88XPOs3ZiD3I67Bp8kbsoSrPw11kTc8RQbeAy5Y3A4nDj4hslOUYPZMAsdk6TIJzwk3LAA53R-fQ6UWdMQzQXCJs5JPEy9RmGM5l9YUA5LrGUVxMQV-S09qcNGjoNwQP9Gs1fQv6e_BYqWPokSHTNX3BAI-T7ErjQRmjjQwMHeG6CzV2NTd_tYZ762L-jhdg8s7RZD-bVlJiJ9tWT8OEN7bqZkmRwZVYAEv_WZp

https://www.jianshu.com/p/0de31429b12a

### zip下载

比如 tinypng

每次请求他都帮你去打包吗？

这不可能，我做不到。

https://github.com/Stuk/jszip



### 下载到对应目录（实验性）

![image-20200817234129788](https://s3.qiufengh.com/blog/image-20200817234129788.png)

在我电脑上都有这么一个浏览器，用来学习和调试 `chrome` 的最新新特性, 如果你的电脑没有，建议你安装一个。

玩这个特性需要打开 chrome 的实验特性 `chrome://flags` => `#native-file-system-api` => `enable`, 因为实验特性都会伴随一些安全或者影响原本的渲染的行为，因此我再次强烈建议，下载一个金丝雀版本的 chrome 来进行玩耍。

```html
<textarea name="" id="textarea" cols="30" rows="10"></textarea>
<p><button id="btn">下载</button></p>
<script>
    btn.onclick = async () => {
        const handler = await window.chooseFileSystemEntries({
            type: 'save-file',
            accepts: [{
                description: 'Text file',
                extensions: ['txt'],
                mimeTypes: ['text/plain'],
            }],
        });

        const writer = await handler.createWritable();
        await writer.write(textarea.value);
        await writer.close();
    }
</script>
```

实现起来非常简单。却飞一般的感觉。

![2020-08-18-00.13.29](https://s3.qiufengh.com/blog/2020-08-18-00.13.29.gif)

## 其他场景

### H5文件下载

安卓

浏览器直接下载文件

如果是下载 apk 安装，

https://www.jianshu.com/p/721b413de888

https://segmentfault.com/a/1190000015681014

https://github.com/jawidx/web-launch-app

https://juejin.im/post/6844904086463053837

ios

文件预览模式

安装应用

### Electron



https://caniuse.com/#feat=download

### 大文件的分片下载

最新在使用大文件的流媒体进行播放的时候，会发现资源返回的状态码为 206，而不是 200，并且会有许多 206 的请求。

#### Node配置



```js
router.get('/api/rangeFile', async(ctx) => {
    const { filename } = ctx.query;
    const { size } = fs.statSync(path.join(__dirname, './static/', filename));
    const range = ctx.headers['range'];
    // 3、通知浏览器可以进行分部分请求
    if (!range) {
        ctx.set('Accept-Ranges', 'bytes');
        ctx.body = fs.readFileSync(path.join(__dirname, './static/', filename));
        return;
    }
    const { start, end } = getRange(range);
    // 4、检查请求范围
    if (start >= size || end >= size) {
        ctx.response.status = 416;
        ctx.set('Content-Range', `bytes */${size}`);
        ctx.body = '';
        return;
    }
    ctx.response.status = 206;
    ctx.set('Accept-Ranges', 'bytes');
    ctx.set('Content-Range', `bytes ${start}-${end ? end : size - 1}/${size}`);
    ctx.body = fs.createReadStream(path.join(__dirname, './static/', filename), { start, end });
})
```



#### Nginx配置

一开始没有找到如何关闭 nginx 的 range，还是根据反推的方式，去查了 nginx 源码相关的内容，才发现原来是这个字段。

https://github.com/nginx/nginx/blob/release-1.13.6/src/http/modules/ngx_http_range_filter_module.c#L166

这也怪我一开始文档阅读不够仔细，浪费了大量的时间。



### 前端多线程下载

https://zhuanlan.zhihu.com/p/58888918



https://www.zhihu.com/question/376805151

https://www.zhihu.com/question/19914902



nginx 单个 tcp 限速

https://segmentfault.com/a/1190000011166016

https://blog.csdn.net/kikajack/article/details/79339521

https://www.cnblogs.com/wjoyxt/p/6128183.html

https://blog.csdn.net/weixin_41004350/article/details/97892629