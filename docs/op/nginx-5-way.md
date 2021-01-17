
5个前端必会的Nginx场景，领略Nginx之美

每个场景都对应一些基础点，但是都是非常重要的。

多域名

多个域名监听 80端口原理

跨域
proxy

反向代理
正向代理


负载均衡
负载均衡算法
upstream

node 多个服务
负载均衡的算法



多路由多目录
规则优先级
当我们的项目日常复杂的时候或者我们想通过一个域名，通过前缀来区分多个项目的时候，就可以使用这个功能。

例如我的业务 a， 想用 /foo 为前缀， 业务 b， 想用 /bar，而这俩来源于不同的业务，此时就可以利用这个功能，将不同前缀的请求分发到不同的

知识点:
alias
匹配优先级


可以用于大型中后台项目。


跳转
301
302
rewrite

路径和本地实体文件目录不一致



https://juejin.im/post/6864085814571335694#heading-5
https://www.xiaoz.me/archives/10301
https://github.com/helloxz/nginx-cdn
https://blog.csdn.net/hellokandy/article/details/96164346
https://raw.githubusercontent.com/helloxz/nginx-cdn/master/nginx.sh