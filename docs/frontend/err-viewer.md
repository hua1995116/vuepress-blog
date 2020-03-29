# 教你如何打造出一个前端可视化监控系统

还记得在我上一家公司中，某一大佬做了一个监控系统，牛逼哄哄，挺想研究他到底是怎么搞出来的。当然我们也不是拍拍脑袋干活的人，总不能人家咋干我们就咋干。下面先就介绍下，这样的平台到底有啥好处。

# 背景

首先我们为什么要做前端系统呢，先看下面这张表，可以很显然的看出，前端的性能对于产品的价值提升还是蛮有帮助的，但是这些信息如果我们能实时的采集到，并且实施以监控，让整个产品在产品线上一直保持高效的运作，这才是我们的目的。

| 性能                      | 收益                      |
| ----------------------- | ----------------------- |
| Google 延迟 **400ms**     | 搜索量下降 **0.59%**         |
| Bing 延迟 **2s**          | 收入下降 **4.3%**           |
| Yahoo 延迟 **400ms**      | 流量下降 **5-9%**           |
| Mozilla 页面打开减少 **2.2s** | 下载量提升 **15.4%**         |
| Netflix 开启 Gzip         | 性能提升 13.25% 带宽减少**50%** |



其次，也有利于我们发布的产品，能够及时发现我们的错误。如果一个产品在新的迭代中，发生不可描述的错误。

![https://s3.qiufengh.com/blog/1568533450466.gif](https://s3.qiufengh.com/blog/1568533450466.gif)

对！就是不可描述。我们总不可能等待用户的反馈投诉，到那个时候黄花菜都凉了。

# 开始

基于以上我们就开始搭建一个前端监**简易**控平台。(虽然现在市面上有很多这样的系统比如ELK,但是还是忍不住自己撸一个)

只能是简易了。



![https://s3.qiufengh.com/blog/1568533450488.gif](https://s3.qiufengh.com/blog/1568533450488.gif)

兄弟们原谅我，只能帮你们到这里了。

接下来请看。

![https://s3.qiufengh.com/blog/1568533450383.png](https://s3.qiufengh.com/blog/1568533450383.png)

以上是我们需要做的一些事情。

# 收集信息

要做监控系统，首先我们得有一个对象。我们监控的对象！对象！对象！对象。

我在我的系统写了一个这样的页面，

```html
<body>
    <div>2</div>
    <div>2</div>
    <div>2</div>
    <div>2</div>
    <div>2</div>
    <div>2</div> 
</body>
```

没错这就是我们要监控的页面。这个.....真不是我懒。

![https://s3.qiufengh.com/blog/1568533450398.gif](https://s3.qiufengh.com/blog/1568533450398.gif)

然后接下来我一共设计了3块数据

- 页面加载时间
- 统计用户使用设备
- 错误量的统计



页面加载时间

```javascript
window.logInfo = {};  //统计页面加载时间
window.logInfo.openTime = performance.timing.navigationStart;
window.logInfo.whiteScreenTime = +new Date() - window.logInfo.openTime;
document.addEventListener('DOMContentLoaded',function (event) {
  window.logInfo.readyTime = +new Date() - window.logInfo.openTime;
});
window.onload = function () {
  window.logInfo.allloadTime = +new Date() - window.logInfo.openTime;
  window.logInfo.nowTime = new Date().getTime();
  var timname = {
    whiteScreenTime: '白屏时间',
    readyTime: '用户可操作时间',
    allloadTime: '总下载时间',
    mobile: '使用设备',
    nowTime: '时间',
  };
  var logStr = '';
  for (var i in timname) {
    console.warn(timname[i] + ':' + window.logInfo[i] + 'ms');
    if (i === 'mobile') {
      logStr += '&' + i + '=' + window.logInfo[i];
    } else {
      logStr += '&' + i + '=' + window.logInfo[i];
    }

  }
  (new Image()).src = '/action?' + logStr;
};
```

统计用户使用设备

```javascript
window.logInfo.mobile = mobileType();
function mobileType() {
  var u = navigator.userAgent, app = navigator.appVersion;
  var type =  {// 移动终端浏览器版本信息
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    iPad: u.indexOf('iPad') > -1, //是否iPad
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
    trident: u.indexOf('Trident') > -1, //IE内核
    presto: u.indexOf('Presto') > -1, //opera内核
    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile/i) || !!u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/), //是否为移动终端
    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
  };
  var lists = Object.keys(type);
  for(var i = 0; i < lists.length; i++) {
    if(type[lists[i]]) {
      return lists[i];
    }
  }  
}
```

错误量的统计

```javascript
window.onload = function () {
        window.logInfo.allloadTime = +new Date() - window.logInfo.openTime;
        window.logInfo.nowTime = new Date().getTime();
        var timname = {
            whiteScreenTime: '白屏时间',
            readyTime: '用户可操作时间',
            allloadTime: '总下载时间',
            mobile: '使用设备',
            nowTime: '时间',
        };
        var logStr = '';
        for (var i in timname) {
            console.warn(timname[i] + ':' + window.logInfo[i] + 'ms');
            if (i === 'mobile') {
                logStr += '&' + i + '=' + window.logInfo[i];
            } else {
                logStr += '&' + i + '=' + window.logInfo[i];
            }
            
        }
        (new Image()).src = '/action?' + logStr;
    };
      
    var defaults = {
        msg:'',  // 错误的具体信息
        url:'',  // 错误所在的url
        line:'', // 错误所在的行
        col:'',  // 错误所在的列
        nowTime: '',// 时间
    };
    window.onerror = function(msg,url,line,col,error) {
        col = col || (window.event && window.event.errorCharacter) || 0;

        defaults.url = url;
        defaults.line = line;
        defaults.col =  col;
        defaults.nowTime = new Date().getTime();

        if (error && error.stack){
            // 如果浏览器有堆栈信息，直接使用
            defaults.msg = error.stack.toString();

        }else if (arguments.callee){
            // 尝试通过callee拿堆栈信息
            var ext = [];
            var fn = arguments.callee.caller;
            var floor = 3;  
            while (fn && (--floor>0)) {
                ext.push(fn.toString());
                if (fn  === fn.caller) {
                    break;
                }
                fn = fn.caller;
            }
            ext = ext.join(",");
            defaults.msg = error.stack.toString();
        }
        var str = ''
        for(var i in defaults) {
            // console.log(i,defaults[i]);
            if(defaults[i] === null || defaults[i] === undefined) {
                defaults[i] = 'null'; 
            }
            str += '&'+ i + '=' + defaults[i].toString();
        }
        srt = str.replace('&', '').replace('\n','').replace(/\s/g, '');
        (new Image()).src = '/error?' + srt;
    }
```

以上就是收集数据的全部，通过发送/action请求或者是/error请求，这些都是可以自定义的，我讲的只是整个过程是如何实现的。

然后通过我的的一个后台express.js把所有的请求处理并都记录下来，记录好后的数据是这样子的。

```bash
user_ip=127.0.0.1&whiteScreenTime=185&readyTime=192&allloadTime=208&mobile=webKit&nowTime=1513071388941
```

# 数据处理

这里我是通过自己写的一段脚本进行解析，parse.js，这里不具体讲解，看源码即可。我展现下解析好的数据。

我以cvs的数据格式储存，因为后面图表的需要，我也支持json格式方式导出，只不过后面就需要你自己来配置可视化的界面了。

数据是这样的。

charts/csvData/2017-12-16time.csv

```txt
时间,白屏时间,用户可操作时间,总下载时间
1513427051482,137,137,153
1513427065080,470,471,507
1513427080040,127,127,143
1513428714345,274,275,323
1513428733583,267,268,317
1513428743167,268,268,317
1513428754796,276,276,328
```



# 数据展示

这里我用的是[highcharts.js](https://www.hcharts.cn/)

具体的配置我不进行讲解，可以自己到官网进行查看。

下面是可视化的图表，显示的是每天各个时间段的信息。

![https://s3.qiufengh.com/blog/1568533450392.png](https://s3.qiufengh.com/blog/1568533450392.png)



界面可能不是特别美观，还请见谅。

![https://s3.qiufengh.com/blog/1568533450476.gif](https://s3.qiufengh.com/blog/1568533450476.gif)

## 环境

node >= 6.0.0

redis >= 2.6.0

在这里我说明下，因为如果这个部署在线上环境的时候，如果每次记录都进行记录的话，会消耗大量的内存，所以我架设了一层redis，为了防止大流量的冲击，然后可以每隔一段时间进行存储。

```javascript
const express = require('express');
const performance = require('./lib/performance.js');
const app = express();
const router = express.Router();
router.get('/', function (req, res, next) {
  req.url = './index.html';
  next();
});
app.use(router);
app.use(performance({
    time: 10, // 秒为单位
    originalDir: './originalData', // 数据的目录
    errorDir: './errorData' // 报错的目录
}))
app.use(express.static('./'));
const server = app.listen(3000)
```

这里可以设置默认的时间，我这里以10秒为单位,为了demo的效果起见。一般我采用的是一分钟进行一次存储。

代码地址：[https://github.com/hua1995116/mcharts](https://github.com/hua1995116/mcharts)

如有好的建议以及优化的方案，还请各位在Issues上提给我。

# 进阶（一个利用监控平台的实战栗子）

我利用这个平台对我的一个项目进行了监控。如果你只是纯粹玩的话，还请只阅读上面的原系统地址，可以忽视我这一段，毕竟我这个系统还不够完善。

线上demo：[http://www.qiufengh.com/#/](http://www.qiufengh.com/#/)

监控demo：[http://qiufengh.com:8080/](http://qiufengh.com:8080/)

项目: [https://github.com/hua1995116/webchat/tree/monitoring](https://github.com/hua1995116/webchat/tree/monitoring)

在这里我设置了每过1分钟记录一次日志。

```javascript
// 监控引入
app.use(performance({
    time: 60, // 秒为单位
    originalDir: './originalData', // 数据的目录
    errorDir: './errorData' // 报错的目录
}))
```

以及每隔10分钟进行一次解析。

```javascript
function setPrase() {
    setInterval(function(){
        parseData();
      }, 1000 * 60 * 10);
}
```


![https://s3.qiufengh.com/blog/1568533450395.gif](https://s3.qiufengh.com/blog/1568533450395.gif)

---------------------------------------------------------------------------
2017-12-20

本文只是提供一个思路，如果想要专业的，可以使用[ELK](https://www.elastic.co/cn/products)之类专业的统计分析工具。