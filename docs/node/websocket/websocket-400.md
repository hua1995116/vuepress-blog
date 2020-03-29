# nginx转发websocket,状态码400

# 起因

之前自己写了一个websocket的项目
[https://github.com/hua1995116/webchat](https://github.com/hua1995116/webchat)

部署项目我用的是nginx转发,通过将请求转发到我本地项目的端口

```nginx
  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_set_header X-NginX-Proxy true;
    proxy_pass http://localhost:9090;
  }
```

以上是我原来的nginx转发，将真实ip以及接口转发到真实服务器。虽然我的项目完美运行了，但是一直报错。

```shell
failed: Error during WebSocket handshake: Unexpected response code: 400
```

# 解决

由于对于项目本身运行并没有影响，我就一直没有解决，直到今天，想做一次版本更新，实在是受不了这个报错了。

翻译了一些nginx官方文档以及issue。得知以下解决方案，以下是[nginx官方](https://www.nginx.com/blog/websocket-nginx/)推荐的配置。

```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "ugrade";
```

在最一开始的配置加上这几句

```nginx
  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_set_header X-NginX-Proxy true;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "ugrade";
    proxy_pass http://localhost:9090;
  }
```

第一行告诉Nginx在与Node后端通信时使用HTTP/1.1，这是WebSockets所必需的。接下来的两个告诉Nginx响应升级请求为websocket，当浏览器想要使用WebSocket过程时候，需要指定的header，这一[维基百科](https://en.wikipedia.org/wiki/HTTP/1.1_Upgrade_header)上有提到，是因为当客户端发送一个```Connection: Upgrade``` nginx 并不知道这是一个websocket请求，所以需要显示地指定，并且使用101交换协议。

> The server, if it supports the protocol, replies with the same Upgrade: WebSocket and Connection: Upgrade headers and completes the handshake.[3] 






# 参考文献

[https://www.nginx.com/blog/websocket-nginx/](https://www.nginx.com/blog/websocket-nginx/)

[https://github.com/socketio/socket.io/issues/1942](https://github.com/socketio/socket.io/issues/1942)


[https://chrislea.com/2013/02/23/proxying-websockets-with-nginx/](https://chrislea.com/2013/02/23/proxying-websockets-with-nginx/)

[https://en.wikipedia.org/wiki/HTTP/1.1_Upgrade_header](https://en.wikipedia.org/wiki/HTTP/1.1_Upgrade_header)

[http://blog.jobbole.com/48358/](http://blog.jobbole.com/48358/)