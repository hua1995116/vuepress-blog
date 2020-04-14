# 10 种跨域解决方案（附终极方案）

## 写在前面

嗯。又来了，又说到跨域了，这是一个老生常谈的话题，以前我觉得这种基础文章没有什么好写的，会想着你去了解底层啊，不是很简单吗。但是最近在开发一个 **vscode 插件** 发现，当你刚入门一样东西的时候，你不会想这么多，因为你对他不熟悉，当你遇到不会的东西，你就是想先找到解决方案，然后通过这个解决方案再去深入理解。就比如跨域，新人或者刚接触的人对它并不是那么熟悉，所以说列出一些自己积累的方案，以及一些常用的场景来给他人带来一些解决问题的思路，这件事是有意义的。（写完之后还发现真香。以后忘了还能回来看看）

其实现在的环境对于刚入门的前端来说，非常的不友好，一方面吧，很多刚新人没有经历过工具的变更时代，另一方面框架的迭代更新速度很快。在以前你可能掌握几种常见的手法就好了。但是现在 `webpack-dev-server`、`vue-cli`、`parcel`，这些脚手架都进行了一层封装，对于熟悉的人可能很简单，但是对于还未入门的人来说，简直就是一个黑盒，虽然用起来很方便，但是某一天遇到了问题，你对它不熟悉，你就会不知道所错。（但是别慌，主流 cli 的跨域方式我都会讲到）

讲着讲着有点偏离方向，可能我讲的也并不一定是正确的。下面切入正题。

本文会以 **「What-How-Why」** 的方式来进行讲解。而在在 How （如何解决跨域，将会提供标题的 11 种方案。）

**重要的说明: 在文中，web 端地址为 localhost:8000 服务端地址为 localhost:8080,这一点希望你能记住，会贯穿全文，你也可以把此处的两端的地址代入你自己的地址。**

![cors](https://s3.qiufengh.com/blog/cors.png)

以下所有代码均在 [https://github.com/hua1995116/node-demo/tree/master/node-cors](https://github.com/hua1995116/node-demo/tree/master/node-cors)

![image-20200413192431636](https://s3.qiufengh.com/blog/image-20200413192431636.png)

## 一、跨域是什么？

### 1.同源策略

跨域问题其实就是浏览器的同源策略所导致的。

> **同源策略**是一个重要的安全策略，它用于限制一个[origin](https://developer.mozilla.org/zh-CN/docs/Glossary/源)的文档或者它加载的脚本如何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介。
>
> --来源 MDN

当跨域时会收到以下错误

![image-20200413205559124](https://s3.qiufengh.com/blog/image-20200413205559124.png)

### 2.同源示例

那么如何才算是同源呢？先来看看 url 的组成部分

`http://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument`

![image-20200412171942421](https://s3.qiufengh.com/blog/image-20200412171942421.png)

只有当

**protocol（协议）、domain（域名）、port（端口）三者一致。**

**protocol（协议）、domain（域名）、port（端口）三者一致。**

**protocol（协议）、domain（域名）、port（端口）三者一致。**

才是同源。

以下协议、域名、端口一致。

http://www.example.com:80/a.js

http://www.example.com:80/b.js

以下这种看上去再相似也没有用，都不是同源。

http://www.example.com:8080

http://www2.example.com:80

在这里注意一下啊，这里是为了突出端口的区别才写上端口。在默认情况下 http 可以省略端口 80， https 省略 443。这别到时候闹笑话了，你和我说 http://www.example.com:80 和 http://www.example.com 不是同源，他俩是一个东西。

http://www.example.com:80 === http://www.example.com

https://www.example.com:443 === https://www.example.com

唔，还是要说明一下。

## 二、如何解决跨域？

### 1.CORS

跨域资源共享([CORS](https://developer.mozilla.org/zh-CN/docs/Glossary/CORS)) 是一种机制，它使用额外的 [HTTP](https://developer.mozilla.org/zh-CN/docs/Glossary/HTTP) 头来告诉浏览器 让运行在一个 origin (domain) 上的 Web 应用被准许访问来自不同源服务器上的指定的资源。当一个资源从与该资源本身所在的服务器**不同的域、协议或端口**请求一个资源时，资源会发起一个**跨域 HTTP 请求**。

而在 cors 中会有 `简单请求` 和 `复杂请求`的概念。

**浏览器支持情况**

当你使用 IE<=9, Opera<12, or Firefox<3.5 或者更加老的浏览器，这个时候请使用 JSONP 。

#### a.简单请求

不会触发 [CORS 预检请求](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS#Preflighted_requests)。这样的请求为“简单请求”，请注意，该术语并不属于 [Fetch](https://fetch.spec.whatwg.org/) （其中定义了 CORS）规范。若请求满足所有下述条件，则该请求可视为“简单请求”：

情况一: 使用以下方法(意思就是以下请求意外的都是非简单请求)

- [`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET)
- [`HEAD`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/HEAD)
- [`POST`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST)

情况二: 人为设置以下集合外的请求头

- [`Accept`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept)
- [`Accept-Language`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Language)
- [`Content-Language`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Language)
- [`Content-Type`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Type) （需要注意额外的限制）
- `DPR`
- `Downlink`
- `Save-Data`
- `Viewport-Width`
- `Width`

情况三：`Content-Type`的值仅限于下列三者之一：(例如 application/json 为非简单请求)

- `text/plain`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

情况四:

请求中的任意[`XMLHttpRequestUpload`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestUpload) 对象均没有注册任何事件监听器；[`XMLHttpRequestUpload`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestUpload) 对象可以使用 [`XMLHttpRequest.upload`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/upload) 属性访问。

情况五:

请求中没有使用 [`ReadableStream`](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 对象。

#### b.非简单请求

除以上情况外的。

#### c.Node 中的解决方案

##### 原生方式

我们来看下后端部分的解决方案。`Node` 中 `CORS` 的解决代码.

```javascript
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", ctx.headers.origin);
  ctx.set("Access-Control-Allow-Credentials", true);
  ctx.set("Access-Control-Request-Method", "PUT,POST,GET,DELETE,OPTIONS");
  ctx.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, cc"
  );
  if (ctx.method === "OPTIONS") {
    ctx.status = 204;
    return;
  }
  await next();
});
```

##### 第三方中间件

为了方便也可以直接使用中间件

```javascript
const cors = require("koa-cors");

app.use(cors());
```

##### 关于 cors 的 cookie 问题

想要传递 `cookie` 需要满足 3 个条件

1.web 请求设置`withCredentials`

这里默认情况下在跨域请求，浏览器是不带 cookie 的。但是我们可以通过设置 `withCredentials` 来进行传递 `cookie`.

```javascript
// 原生 xml 的设置方式
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
// axios 设置方式
axios.defaults.withCredentials = true;
```

2.`Access-Control-Allow-Credentials` 为 `true`

3.`Access-Control-Allow-Origin`为非 `*`

这里请求的方式，在 `chrome` 中是能看到返回值的，但是只要不满足以上其一，浏览器会报错，获取不到返回值。

![image-20200412201424024](https://s3.qiufengh.com/blog/image-20200412201424024.png)

```
Access to XMLHttpRequest at 'http://127.0.0.1:8080/api/corslist' from origin 'http://127.0.0.1:8000' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
```

![image-20200412201411481](https://s3.qiufengh.com/blog/image-20200412201411481.png)

```
Access to XMLHttpRequest at 'http://127.0.0.1:8080/api/corslist' from origin 'http://127.0.0.1:8000' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
```

![image-20200412201530087](https://s3.qiufengh.com/blog/image-20200412201530087.png)

#### d.前端示例

分别演示一下前端部分 `简单请求` 和 `非简单请求`

##### 简单请求

```html
<script src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
<script>
  axios.get("http://127.0.0.1:8080/api/corslist");
</script>
```

##### 非简单请求

这里我们加入了一个非集合内的 `header` 头 `cc` 来达到非简单请求的目的。

```html
<script src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
<script>
  axios.get("http://127.0.0.1:8080/api/corslist", { header: { cc: "xxx" } });
</script>
```

![image-20200412201158778](https://s3.qiufengh.com/blog/image-20200412201158778.png)

![image-20200412195829232](https://s3.qiufengh.com/blog/image-20200412195829232.png)

##### 小结

1、 在新版的 chrome 中，如果你发送了复杂请求，你却看不到 `options` 请求。可以在这里设置 `chrome://flags/#out-of-blink-cors` 设置成 `disbale` ，重启浏览器。对于非简单请求就能看到 `options` 请求了。

2、 一般情况下后端接口是不会开启这个跨域头的，除非是一些与用户无关的不太重要的接口。

### 2.Node 正向代理

代理的思路为，利用服务端请求不会跨域的特性，让接口和当前站点同域。

**代理前**

![image-20200412202320482](https://s3.qiufengh.com/blog/image-20200412202320482.png)

**代理后**

![image-20200412202358759](https://s3.qiufengh.com/blog/image-20200412202358759.png)

这样，所有的资源以及请求都在一个域名下了。

#### a.cli 工具中的代理

##### 1) Webpack (4.x)

在`webpack`中可以配置`proxy`来快速获得接口代理的能力。

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./index.js"
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    port: 8000,
    proxy: {
      "/api": {
        target: "http://localhost:8080"
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "webpack.html"
    })
  ]
};
```

修改前端接口请求方式，改为不带域名。（因为现在是同域请求了）

```html
<button id="getlist">获取列表</button>
<button id="login">登录</button>
<script src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
<script>
  axios.defaults.withCredentials = true;
  getlist.onclick = () => {
    axios.get("/api/corslist").then(res => {
      console.log(res.data);
    });
  };
  login.onclick = () => {
    axios.post("/api/login");
  };
</script>
```

##### 2) Vue-cli 2.x

```javascript
// config/index.js

...
proxyTable: {
  '/api': {
     target: 'http://localhost:8080',
  }
},
...
```

##### 3) Vue-cli 3.x

```
// vue.config.js 如果没有就新建
```

```javascript
module.exports = {
  devServer: {
    port: 8000,
    proxy: {
      "/api": {
        target: "http://localhost:8080"
      }
    }
  }
};
```

##### 4) Parcel (2.x)

```
// .proxyrc
{
  "/api": {
    "target": "http://localhost:8080"
  }
}
```

看到这里，心里一句 xxx 就会脱口而出，一会写配置文件，一会 proxyTable ，一会 proxy，怎么这么多的形式？学不动了学不动了。。。不过也不用慌，还是有方法的。以上所有配置都是有着共同的底层包 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) .里面需要用到的各种 `websocket` ，`rewrite` 等功能，直接看这个库的配置就可以了。关于 http-proxy-middleware 这个库的原理可以看我这篇文章 [https://github.com/hua1995116/proxy](https://github.com/hua1995116/proxy) 当然了。。。对于配置的位置入口还是非统一的。教一个搜索的技巧吧，上面配置写哪里都不用记的，想要哪个框架的 直接 google 搜索 xxx proxy 就行了。

例如 vue-cli 2 proxy 、 webpack proxy 等等....基本会搜到有官网的配置答案，通用且 nice。

#### b.使用自己的代理工具

[cors-anywhere](https://github.com/Rob--W/cors-anywhere)

**服务端**

```javascript
// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || "0.0.0.0";
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 7777;

var cors_proxy = require("cors-anywhere");
cors_proxy
  .createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie", "cookie2"]
  })
  .listen(port, host, function() {
    console.log("Running CORS Anywhere on " + host + ":" + port);
  });
```

**前端代码**

```html
<script src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
<script>
  axios.defaults.withCredentials = true;
  getlist.onclick = () => {
    axios
      .get("http://127.0.0.1:7777/http://127.0.0.1:8080/api/corslist")
      .then(res => {
        console.log(res.data);
      });
  };
  login.onclick = () => {
    axios.post("http://127.0.0.1:7777/http://127.0.0.1:8080/api/login");
  };
</script>
```

**效果展示**

![image-20200413161243734](https://s3.qiufengh.com/blog/image-20200413161243734.png)

**缺点**

无法专递 cookie，原因是因为这个是一个代理库，作者觉得中间传递 cookie 太不安全了。https://github.com/Rob--W/cors-anywhere/issues/208#issuecomment-575254153

#### c.charles

##### 介绍

这是一个测试、开发的神器。[介绍与使用](https://juejin.im/post/5b8350b96fb9a019d9246c4c)

利用 charles 进行跨域，本质就是请求的拦截与代理。

在 `tools/map remote` 中设置代理

![image-20200412232733437](https://s3.qiufengh.com/blog/image-20200412232733437.png)

![image-20200412232724518](https://s3.qiufengh.com/blog/image-20200412232724518.png)

##### 前端代码

```html
<button id="getlist">获取列表</button>
<button id="login">登录</button>
<script src="https://cdn.bootcss.com/axios/0.19.2/axios.min.js"></script>
<script>
  axios.defaults.withCredentials = true;
  getlist.onclick = () => {
    axios.get("/api/corslist").then(res => {
      console.log(res.data);
    });
  };
  login.onclick = () => {
    axios.post("/api/login");
  };
</script>
```

##### 后端代码

```javascript
router.get("/api/corslist", async ctx => {
  ctx.body = {
    data: [{ name: "秋风的笔记" }]
  };
});

router.post("/api/login", async ctx => {
  ctx.cookies.set("token", token, {
    expires: new Date(+new Date() + 1000 * 60 * 60 * 24 * 7)
  });
  ctx.body = {
    msg: "成功",
    code: 0
  };
});
```

##### 效果

访问 http://localhost:8000/charles

![image-20200412232231554](https://s3.qiufengh.com/blog/image-20200412232231554.png)

![image-20200412232752837](https://s3.qiufengh.com/blog/image-20200412232752837.png)

完美解决。

唔。这里又有一个注意点。在 `Mac mojave 10.14` 中会出现 `charles` 抓不到本地包的情况。这个时候需要自定义一个域名，然后配置`hosts`指定到`127.0.0.1`。然后修改访问方式 `http://localhost.charlesproxy.com:8000/charles`。

![image-20200412233258107](https://s3.qiufengh.com/blog/image-20200412233258107.png)

![image-20200412233317027](https://s3.qiufengh.com/blog/image-20200412233317027.png)

### 3.Nginx 反向代理

##### 介绍

Nginx 则是通过反向代理的方式，（这里也需要自定义一个域名）这里就是保证我当前域，能获取到静态资源和接口，不关心是怎么获取的。[nginx 安装教程](https://blog.csdn.net/diaojw090/article/details/89135073)

![image-20200412233536522](https://s3.qiufengh.com/blog/image-20200412233536522.png)

配置下 hosts

`127.0.0.1 local.test`

配置 nginx

```
server {
        listen 80;
        server_name local.test;
        location /api {
            proxy_pass http://localhost:8080;
        }
        location / {
            proxy_pass http://localhost:8000;
        }
}
```

启动 nginx

`sudo nginx`

重启 nginx

`sudo nginx -s reload`

##### 实现

前端代码

```html
<script>
  axios.defaults.withCredentials = true;
  getlist.onclick = () => {
    axios.get("/api/corslist").then(res => {
      console.log(res.data);
    });
  };
  login.onclick = () => {
    axios.post("/api/login");
  };
</script>
```

后端代码

```javascript
router.get("/api/corslist", async ctx => {
  ctx.body = {
    data: [{ name: "秋风的笔记" }]
  };
});

router.post("/api/login", async ctx => {
  ctx.cookies.set("token", token, {
    expires: new Date(+new Date() + 1000 * 60 * 60 * 24 * 7)
  });
  ctx.body = {
    msg: "成功",
    code: 0
  };
});
```

##### 效果

访问 `http://local.test/charles`

浏览器显示

![image-20200413000229326](https://s3.qiufengh.com/blog/image-20200413000229326.png)

### 4.JSONP

`JSONP` 主要就是利用了 `script` 标签没有跨域限制的这个特性来完成的。

**使用限制**

仅支持 GET 方法，如果想使用完整的 REST 接口，请使用 CORS 或者其他代理方式。

**流程解析**

1.前端定义解析函数（例如 jsonpCallback=function(){....}）

2.通过 params 形式包装请求参数，并且声明执行函数(例如 cb=jsonpCallback)

3.后端获取前端声明的执行函数（jsonpCallback），并以带上参数并调用执行函数的方式传递给前端。

**使用示例**

后端实现

```javascript
const Koa = require("koa");
const fs = require("fs");
const app = new Koa();

app.use(async (ctx, next) => {
  if (ctx.path === "/api/jsonp") {
    const { cb, msg } = ctx.query;
    ctx.body = `${cb}(${JSON.stringify({ msg })})`;
    return;
  }
});

app.listen(8080);
```

普通 js 示例

```html
<script type="text/javascript">
  window.jsonpCallback = function(res) {
    console.log(res);
  };
</script>
<script
  src="http://localhost:8080/api/jsonp?msg=hello&cb=jsonpCallback"
  type="text/javascript"
></script>
```

JQuery Ajax 示例

```html
<script src="https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js"></script>
<script>
  $.ajax({
    url: "http://localhost:8080/api/jsonp",
    dataType: "jsonp",
    type: "get",
    data: {
      msg: "hello"
    },
    jsonp: "cb",
    success: function(data) {
      console.log(data);
    }
  });
</script>
```

**原理解析**

其实这就是 js 的魔法

我们先来看最简单的 js 调用。嗯，很自然的调用。

```html
<script>
  window.jsonpCallback = function(res) {
    console.log(res);
  };
</script>
<script>
  jsonpCallback({ a: 1 });
</script>
```

我们稍稍改造一下，外链的形式。

```html
<script>
  window.jsonpCallback = function(res) {
    console.log(res);
  };
</script>
<script src="http://localhost:8080/api/a.js"></script>

// http://localhost:8080/api/a.js jsonpCallback({a:1});
```

我们再改造一下，我们把这个外链的 js 就当做是一个动态的接口，因为本身资源和接口一样，是一个请求，也包含各种参数，也可以动态化返回。

```html
<script>
  window.jsonpCallback = function(res) {
    console.log(res);
  };
</script>
<script src="http://localhost:8080/api/a.js?a=123&cb=sonpCallback"></script>

// http://localhost:8080/api/a.js jsonpCallback({a:123});
```

你仔细品，细细品，是不是 jsonp 有的优势就是 script 加载 js 的优势，加载的方式只不过换了一种说法。这也告诉我们一个道理，很多东西并没有那么神奇，是在你所学的知识范围内。就好比，桃树和柳树，如果你把他们当成很大跨度的东西去记忆理解，那么世上这么多树，你真的要累死了，你把他们都当成是树，哦吼？你会突然发现，你对世界上所有的树都有所了解，他们都会长叶子，光合作用....当然也有个例，但是你只需要去记忆这些细微的差别，抓住主干。。。嗯，反正就这么个道理。

### 5.Websocket

[WebSocket](http://dev.w3.org/html5/websockets/) 规范定义了一种 API，可在网络浏览器和服务器之间建立“套接字”连接。简单地说：客户端和服务器之间存在持久的连接，而且双方都可以随时开始发送数据。详细教程可以看 https://www.html5rocks.com/zh/tutorials/websockets/basics/

这种方式本质没有使用了 HTTP 的响应头, 因此也没有跨域的限制，没有什么过多的解释直接上代码吧。

前端部分

```html
<script>
  let socket = new WebSocket("ws://localhost:8080");
  socket.onopen = function() {
    socket.send("秋风的笔记");
  };
  socket.onmessage = function(e) {
    console.log(e.data);
  };
</script>
```

后端部分

```javascript
const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });
server.on("connection", function(socket) {
  socket.on("message", function(data) {
    socket.send(data);
  });
});
```

### 6.window.postMessage

**window.postMessage()** 方法可以安全地实现跨源通信。通常，对于两个不同页面的脚本，只有当执行它们的页面位于具有相同的协议（通常为 https），端口号（443 为 https 的默认值），以及主机 (两个页面的模数 [`Document.domain`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/domain)设置为相同的值) 时，这两个脚本才能相互通信。**window.postMessage()** 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。

#### 用途

1.页面和其打开的新窗口的数据传递

2.多窗口之间消息传递

3.页面与嵌套的 iframe 消息传递

#### 用法

详细用法看 https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage

`otherWindow.postMessage(message, targetOrigin, [transfer]);`

- otherWindow: 其他窗口的一个引用，比如 iframe 的 contentWindow 属性、执行[window.open](https://developer.mozilla.org/en-US/docs/DOM/window.open)返回的窗口对象、或者是命名过或数值索引的[window.frames](https://developer.mozilla.org/en-US/docs/DOM/window.frames)。
- message: 将要发送到其他 window 的数据。
- targetOrigin: 通过窗口的 origin 属性来指定哪些窗口能接收到消息事件.

- transfer(可选) : 是一串和 message 同时传递的 [`Transferable`](https://developer.mozilla.org/zh-CN/docs/Web/API/Transferable) 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权

#### 示例

index.html

```html
<iframe
  src="http://localhost:8080"
  frameborder="0"
  id="iframe"
  onload="load()"
></iframe>
<script>
  function load() {
    iframe.contentWindow.postMessage("秋风的笔记", "http://localhost:8080");
    window.onmessage = e => {
      console.log(e.data);
    };
  }
</script>
```

another.html

```html
<div>hello</div>
<script>
  window.onmessage = e => {
    console.log(e.data); // 秋风的笔记
    e.source.postMessage(e.data, e.origin);
  };
</script>
```

### 7.document.domain + Iframe

从第 7 种到第 9 种方式，我觉得别人的写的已经很好了，为了完整性，我就拿别人的了。如有雷同....（不对，就是雷同....）不要说不出来。

**该方式只能用于二级域名相同的情况下，比如 `a.test.com` 和 `b.test.com` 适用于该方式**。 只需要给页面添加 `document.domain ='test.com'` 表示二级域名都相同就可以实现跨域。

```bash
www.   baidu.  com     .
三级域  二级域   顶级域   根域
```

```html
// a.test.com
<body>
  helloa
  <iframe
    src="http://b.test.com/b.html"
    frameborder="0"
    onload="load()"
    id="frame"
  ></iframe>
  <script>
    document.domain = "test.com";
    function load() {
      console.log(frame.contentWindow.a);
    }
  </script>
</body>
```

```html
// b.test.com
<body>
  hellob
  <script>
    document.domain = "test.com";
    var a = 100;
  </script>
</body>
```

### 8.window.location.hash + Iframe

#### 实现原理

原理就是通过 url 带 hash ，通过一个非跨域的中间页面来传递数据。

#### 实现流程

一开始 a.html 给 c.html 传一个 hash 值，然后 c.html 收到 hash 值后，再把 hash 值传递给 b.html，最后 b.html 将结果放到 a.html 的 hash 值中。 同样的，a.html 和 b.htm l 是同域的，都是 `http://localhost:8000`，而 c.html 是`http://localhost:8080`

```html
// a.html
<iframe src="http://localhost:8080/hash/c.html#name1"></iframe>
<script>
  console.log(location.hash);
  window.onhashchange = function() {
    console.log(location.hash);
  };
</script>
```

```html
// b.html
<script>
  window.parent.parent.location.hash = location.hash;
</script>
```

```html
// c.html
<body></body>
<script>
  console.log(location.hash);
  const iframe = document.createElement("iframe");
  iframe.src = "http://localhost:8000/hash/b.html#name2";
  document.body.appendChild(iframe);
</script>
```

### 9.window.name + Iframe

window 对象的 name 属性是一个很特别的属性，当该 window 的 location 变化，然后重新加载，它的 name 属性可以依然保持不变。

其中 a.html 和 b.html 是同域的，都是`http://localhost:8000`，而 c.html 是`http://localhost:8080`

```html
// a.html
<iframe
  src="http://localhost:8080/name/c.html"
  frameborder="0"
  onload="load()"
  id="iframe"
></iframe>
<script>
  let first = true;
  // onload事件会触发2次，第1次加载跨域页，并留存数据于window.name
  function load() {
    if (first) {
      // 第1次onload(跨域页)成功后，切换到同域代理页面
      iframe.src = "http://localhost:8000/name/b.html";
      first = false;
    } else {
      // 第2次onload(同域b.html页)成功后，读取同域window.name中数据
      console.log(iframe.contentWindow.name);
    }
  }
</script>
```

b.html 为中间代理页，与 a.html 同域，内容为空。

```html
// b.html
<div></div>
```

```html
// c.html
<script>
  window.name = "秋风的笔记";
</script>
```

通过 iframe 的 src 属性由外域转向本地域，跨域数据即由 iframe 的 window.name 从外域传递到本地域。这个就巧妙地绕过了浏览器的跨域访问限制，但同时它又是安全操作。

### 10.浏览器开启跨域（终极方案）

其实讲下其实跨域问题是浏览器策略，源头是他，那么能否能关闭这个功能呢？

答案是肯定的。

**注意事项: 因为浏览器是众多 web 页面入口。我们是否也可以像客户端那种，就是用一个单独的专门宿主浏览器，来打开调试我们的开发页面。例如这里以 chrome canary 为例，这个是我专门调试页面的浏览器，不会用它来访问其他 web url。因此它也相对于安全一些。当然这个方式，只限于当你真的被跨域折磨地崩溃的时候才建议使用以下。使用后，请以正常的方式将他打开，以免你不小心用这个模式干了其他的事。**

#### Windows

```
找到你安装的目录
.\Google\Chrome\Application\chrome.exe --disable-web-security --user-data-dir=xxxx
```

#### Mac

`~/Downloads/chrome-data` 这个目录可以自定义.

```
/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary  --disable-web-security --user-data-dir=~/Downloads/chrome-data
```

#### 效果展示

![image-20200413143102377](https://s3.qiufengh.com/blog/image-20200413143102377.png)

嗯，使用起来很香，但是再次提醒，一般情况千万别轻易使用这个方式，这个方式好比七伤拳，使用的好威力无比，使用不好，很容易伤到自己。

## 三、为什么需要跨域？

在最一开始，我们知道了，跨域只存在于浏览器端。而浏览器为 web 提供访问入口。我们在可以浏览器内打开很多页面。正是这样的开放形态，所以我们需要对他有所限制。就比如林子大了，什么鸟都有，我们需要有一个统一的规范来进行约定才能保障这个安全性。

### 1.限制不同源的请求

这里还是用最常用的方式来讲解，例如用户登录 a 网站，同时新开 tab 打开了 b 网站，如果不限制同源， b 可以像 a 网站发起任何请求，会让不法分子有机可趁。

### 2.限制 dom 操作

我举个例子吧, 你先登录下 www.baidu.com ,然后访问我这个网址。

https://zerolty.com/node-demo/index.html

![image-20200413190413758](https://s3.qiufengh.com/blog/image-20200413190413758.png)

你会发现，这个和真实的百度一模一样，如果再把域名搞的相似一些，是不是很容易被骗，如果可以进行 dom 操作...那么大家的信息在这种钓鱼网站眼里都是一颗颗小白菜，等着被收割。

> 可以在 http 返回头 添加`X-Frame-Options: SAMEORIGIN` 防止被别人添加至 iframe。

## 写在最后

以上最常用的就是前 4 种方式，特别是第 2 种非常常见，我里面也提到了多种示例，大家可以慢慢消化一下。希望未来有更加安全的方式来限制 web ，解决跨域的头疼，哈哈哈哈。

**有一个不成熟的想法，可以搞这么一个浏览器，只让访问内网/本地网络，专门给开发者用来调试页面用，对于静态资源可以配置白名单，这样是不是就没有跨域问题了，23333。上述如有错误，请第一时间指出，我会进行修改，以免给大家来误导。**

欢迎关注公众号 **「秋风的笔记」**，主要记录日常中觉得有意思的工具以及分享开发实践，保持深度和专注度。

<img src="https://s3.qiufengh.com/blog/weixin-gongzhonghao.png" alt="weixin-gongzhonghao" style="width: 500px;text-align:center" />

也可以扫码加我微信好友，拉你进交流群聊 5 毛钱的天。群里有很多大佬，解决问题也很积极，说实话，这篇文章就是一个例子，发现群里好多人常常遇到这相关的问题，干脆来一篇总结。

<img src="https://s3.qiufengh.com/blog/1581349909092.jpg" alt="1581349909092" style="width: 300px;text-align:center" />

## 参考

https://stackoverflow.com/questions/12296910/so-jsonp-or-cors

https://juejin.im/post/5c23993de51d457b8c1f4ee1#heading-18

https://juejin.im/post/5a6320d56fb9a01cb64ee191

https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS

https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy
