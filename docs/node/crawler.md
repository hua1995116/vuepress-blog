# 手把手教你多页面递归爬虫--基于Node.Js


## 前言
前端时间再回顾了一下node.js，于是顺势做了一个爬虫来加深自己对node的理解。
主要用的到是request，cheerio，async三个模块
**request**
用于请求地址和快速下载图片流。
https://github.com/request/request
**cheerio**
为服务器特别定制的，快速、灵活、实施的jQuery核心实现.
便于解析html代码。
https://www.npmjs.com/package/cheerio
**async**
异步调用，防止堵塞。
http://caolan.github.io/async/

##核心思路

 - 用request 发送一个请求。获取html代码，取得其中的img标签和a标签。
 - 通过获取的a表情进行递归调用。不断获取img地址和a地址，继续递归
 - 获取img地址通过request(photo).pipe(fs.createWriteStream(dir + "/" + filename));进行快速下载。



```javascript
function requestall(url) {
  request({
    uri: url,
    headers: setting.header
  }, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(response.statusCode);
      if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        var photos = [];
        $('img').each(function () {
          // 判断地址是否存在
          if ($(this).attr('src')) {
            var src = $(this).attr('src');
            var end = src.substr(-4, 4).toLowerCase();
            if (end == '.jpg' || end == '.png' || end == '.jpeg') {
              if (IsURL(src)) {
                photos.push(src);
              }
            }
          }
        });
        downloadImg(photos, dir, setting.download_v);
        // 递归爬虫
        $('a').each(function () {
          var murl = $(this).attr('href');
          if (IsURL(murl)) {
            setTimeout(function () {
              fetchre(murl);
            }, timeout);
            timeout += setting.ajax_timeout;
          } else {
            setTimeout(function () {
              fetchre("http://www.ivsky.com/" + murl);
            }, timeout);
            timeout += setting.ajax_timeout;
          }
        })
      }
    }
  });
}
```
##防坑
1.在request通过图片地址下载时，绑定error事件防止爬虫异常的中断。
2.通过async的mapLimit限制并发。
3.加入请求报头，防止ip被屏蔽。
4.获取一些图片和超链接地址，可能是相对路径（待考虑解决是否有通过方法）。
```javascript
function downloadImg(photos, dir, asyncNum) {
  console.log("即将异步并发下载图片，当前并发数为:" + asyncNum);
  async.mapLimit(photos, asyncNum, function (photo, callback) {
    var filename = (new Date().getTime()) + photo.substr(-4, 4);
    if (filename) {
      console.log('正在下载' + photo);
      // 默认
      // fs.createWriteStream(dir + "/" + filename)
      // 防止pipe错误
      request(photo)
        .on('error', function (err) {
          console.log(err);
        })
        .pipe(fs.createWriteStream(dir + "/" + filename));
      console.log('下载完成');
      callback(null, filename);
    }
  }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(" all right ! ");
      console.log(result);
    }
  })
}
```
测试：
![这里写图片描述](https://s3.qiufengh.com/blog/1579506284375.png)

可以感觉到速度还是比较快的。
![这里写图片描述](https://s3.qiufengh.com/blog/1579506284534.png)

完整地址。https://github.com/hua1995116/node-crawler/

