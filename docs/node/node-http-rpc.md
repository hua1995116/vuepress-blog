# Node服务间调用的两种方式

其实这个问题对于服务端而言是常见的问题，但是还是想讲一讲。回归问题，服务端最常用的两种方式就是 REST 和 RPC。

![image-20200406164304121](https://s3.qiufengh.com/blog/image-20200406164304121.png)

## 什么是 REST

REST(REpresentational State Transfer) 表现层状态转移。由Roy Fielding在他的[论文](https://link.zhihu.com/?target=http%3A//www.ics.uci.edu/~fielding/pubs/dissertation/top.htm)中提出。REST用来描述客户端通过某种形式获取服务器的数据，这些数据资源的格式通常是JSON或XML。同时，这些资源的表现或资源的集合是可以修改的，伴随着行为和关系可以通过多媒体来发现。

一句话描述就是:**URL定位资源，用HTTP动词（GET,POST,DELETE,DETC）描述操作。**（摘自 https://www.zhihu.com/question/28557115/answer/41265890）



我们很容易的可以创建这样的一个服务并且使用另一个服务调用它。

### **服务创建**

```javascript
const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();
router.get('/v1/getList', async (ctx) => {
    ctx.body = {
        data: [{ user: 'qiufeng', age: 18 }],
        msg: 'success',
        errno: 0
    }
});
app.use(router.routes());
app.listen(3000);
```

### **服务调用**

```javascript
const Koa = require('koa');
const axios = require('axios');
const router = require('koa-router')();
const app = new Koa();
router.get('/v1/getSuperList', async (ctx) => {
    const result = await axios.get('http://127.0.0.1:3000/v1/getList');
    console.log(result);
    ctx.body = {
        data: result.data.data.map(item => ({...item, github: 'hua1995116'})),
        msg: 'success',
        errno: 0
    }
});
app.use(router.routes());
app.listen(3001);
```

### 客户端呈现

![image-20200406172749853](https://s3.qiufengh.com/blog/image-20200406172749853.png)



### 使用的场景

常用服务间调用以 REST 方式有以下实际案例: 

1.微信公众号扫码回调。

2.支付宝、微信支付相关的回调请求。

## 什么是RPC

RPC（即Remote Procedure Call，远程过程调用）通常指服务与服务之间的调用方式。而这种方式也是企业服务内部常用的模式。

### RPC 调用常用的框架

Motan、Dubbox、Thrift、gRPC、rpcx。

其中 gPRC和 thrift 为跨平台框架，下面就重点来讲下 thrift，当然下面的讲解不是以偏概全，我想的是以小见大，抓住 RPC 的几个特点。

### 什么是 Thrift 

Thrift 是 Facebook 于 2007 年开发的跨语言的 RPC 框架；用户通过 Thrift 的 IDL（接口定义语言）来描述接口函数及数据类型，然后通过 Thrift 的编译环境生成各种语言类型的接口文件，用户可以根据自己的需要采用不同的语言开发客户端代码和服务器端代码。

#### Thrift  Node实现方式

首先需要安装 thrift https://thrift.apache.org/download

这里取了一个官方的示例

```
// hello.thrift
service HelloSvc {
    string hello_func(),
}

service TimesTwo {
    i64 dbl(1: i64 val),
}
```

运行  `thrift --gen js:node hello.thrift`

会生成以下结构

```
gen-nodejs
├── HelloSvc.js
├── TimesTwo.js
└── hello_types.js
```

```javascript
//server.js
var thrift = require('thrift');                 	
var helloSvc = require('./gen-nodejs/HelloSvc');
//ServiceHandler: Implement the hello service 
var helloHandler = {
  hello_func: function (result) {
    console.log("Received Hello call");
    result(null, "Hello from Node.js");
  }
};
//ServiceOptions: The I/O stack for the service
var helloSvcOpt = {                       		
    handler: helloHandler,                      	
    processor: helloSvc,                         	
    protocol: thrift.TJSONProtocol,                 
    transport: thrift.TBufferedTransport 		
};                                  
//ServerOptions: Define server features
var serverOpt = {                          	
   services: {                         
      "/hello": helloSvcOpt                 
   }                               
}                                   
//Create and start the web server 
var port = 9090;                            		
thrift.createWebServer(serverOpt).listen(port);                        	
console.log("Http/Thrift Server running on port: " + port);
```

```javascript
// client.js
var thrift = require('thrift');
var helloSvc = require('./gen-nodejs/HelloSvc.js');

var options = {
   transport: thrift.TBufferedTransport,
   protocol: thrift.TJSONProtocol,
   path: "/hello",
   headers: {"Connection": "close"},
   https: false
};

var connection = thrift.createHttpConnection("localhost", 9090, options);
var client = thrift.createHttpClient(helloSvc, connection);

connection.on("error", function(err) {
   console.log("Error: " + err);
});

client.hello_func(function(error, result) {
   console.log("Msg from server: " + result);
});
```

运行` server.js & client.js`

```
client>Msg from server: Hello from Node.js

server>Received Hello call
```

#### Thrift 使用场景

公司内部服务之间相互调用（对于性能要求比较高的）



## 比较 REST(HTTP) 和 RPC(Thrift)

### TCP握手

http

需要进行三次握手

Thrift

不需要握手，可以保持长连接

### 请求内容

http



Thrift



### 编写的成本

http

容易

thrift

有一定的复杂度

### 性能对比

![image-20200406182224521](https://s3.qiufengh.com/blog/image-20200406182224521.png)

来源: https://cnodejs.org/topic/553a1cad63b7692e48bbb715

## 加餐-如何定义自己的协议



定义自己的协议标准

需要用TCP/IP暴露的 socket 接口，在 node 中就是 net 模块

如何把 TCP/IP 协议比作设计图，那么 socket 就是模具。一个为定义，另一个为真实的实现。

上一期中讲到的文件上传，实现。

压力测试



## 总结

以上写的比较基础，但是能让大家大概了解 Node 服务之间的调用方式以及场景选择，感谢阅读，如有问题欢迎指出。



## 参考

https://blog.csdn.net/xuduorui/article/details/77938644

https://www.zhihu.com/question/41609070/answer/1030913797



### 序列化

http

采用 json 方式，易读，方便，但是解析速度慢

Thrift

不易读, 向后兼容有一定的约定限制，解析速度快