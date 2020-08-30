【原来前端也能多线程下载大文件】



最新在本地调试 使用了 vscode 插件 live server 的时候，发现使用大文件的流媒体进行播放的时候，会发现资源返回的状态码为 206，而不是 200，并且会有许多 206 的请求。莫不是现在浏览器改策略了，对大文件进行了友好的策略，那还**优化什么性能呢？这个时候心里是这样的。

![img](https://s3.qiufengh.com/blog/1598540616-12658.gif)

然后我又试了我们内网的 nginx 服务，发现，居然还是可以有这个特性。但是突然我换了一个 node 服务就发现没有 206 这个状态码了。这就让我对 nginx 和 live server 发生了兴趣。相对比熟悉程度而言，我肯定更加熟悉 node ，因为我先去看了 live server 的源码，阅读源码其实也不难



发现用了 send 这个库，因此我们又来看到 send ，我们发现 206 这个字段。原来是 range 这个字段。


### 前端多线程下载

平常我们听说比较多的是一些下载工具的多线程下载，那么我们前端对于加载一些大文件的时候能否采用多线程的方式呢？答案是可以的。先上图。



但是在我第一次实现的时候并没有这么的顺利



https://zhuanlan.zhihu.com/p/58888918



https://www.zhihu.com/question/376805151

https://www.zhihu.com/question/19914902



nginx 单个 tcp 限速

https://segmentfault.com/a/1190000011166016

https://blog.csdn.net/kikajack/article/details/79339521

https://www.cnblogs.com/wjoyxt/p/6128183.html

https://blog.csdn.net/weixin_41004350/article/details/97892629