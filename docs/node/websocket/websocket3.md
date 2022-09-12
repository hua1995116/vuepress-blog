# vue-chat 项目之重构与体验优化

# 前言

vue-chat 也就是我的几个月之前写的一个基于 vue 的实时聊天项目，到目前为止已经快满 400star 了，注册量也已经超过了 1700+，消息量达 2000+，由于一直在实习，没有时间对它频繁地更新，趁着这个国庆，对他进行了一次重构，希望我的经验对大家有帮助。有宝贵的意见请在 issue 提给我。
旧版本：
[https://github.com/hua1995116/webchat/tree/v1.2.0](https://github.com/hua1995116/webchat/tree/v1.2.0)
新版本：
https://github.com/hua1995116/webchat/tree/dev
可以说这也是一个稳定版本，但是代码细节方面存在许多的不堪。
所以我从以下几个大方面进行了优化
线上地址：http://www.qiufengh.com:9090/#/

前面两个版本的介绍：
[vue+websocket+express+mongodb 实战项目（实时聊天）（一）](http://blog.csdn.net/blueblueskyhua/article/details/70807847)
[vue+websocket+express+mongodb 实战项目（实时聊天）（二）](http://blog.csdn.net/blueblueskyhua/article/details/73250992)

# 代码结构

**1.梳理项目目录结构**

原目录：
![这里写图片描述](https://s3.mdedit.online/blog/1579506284481.jpg)
新目录
![这里写图片描述](https://s3.mdedit.online/blog/1579506287135.jpg)
主要是多了一个 api 目录，view 目录和一个 Basetransition.vue 文件。
api 的作用为对 axios 的统一处理
view 使得页面和组件分离，因为一般写都是混在一起，会导致不太清楚
Basetransition.vue 为一个切换特效的基本文件

**2.对每个页面的结构进行整改**

这里不细说，具体看每个页面，主要是对一些可以在单页内使用的 data，去除了 vuex。使得每个页面具有其通用性，去除了耦合性。

**3.将公共工具 utils 抽取出来**

里面有三个工具，
![这里写图片描述](https://s3.mdedit.online/blog/1579506286295.jpg)

分别为处理时间，localStoragec 存储，处理 url 的 query 参数
**4.页面与组件分离**

刚才讲了，将 components 分离出来，分离成真正的组件以及页面。

**5.axios 进行了统一的处理**

api 下的 axios.js 对 axios 进行了统一的处理
包括，响应出错，响应超时

```javascript
import axios from "axios";

const baseURL = "";

const instance = axios.create();

instance.defaults.timeout = 30000; // 所有接口30s超时

// 请求统一处理
instance.interceptors.request.use(
  async (config) => {
    if (config.url && config.url.charAt(0) === "/") {
      config.url = `${baseURL}${config.url}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 对返回的内容做统一处理
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response;
    }
    return Promise.reject(response);
  },
  (error) => {
    if (error) {
      console.log(JSON.stringify(error));
    } else {
      console.log("出了点问题，暂时加载不出来，请稍后再来吧");
    }
    return Promise.reject(error);
  }
);

export default instance;
```

**6.运用了 async await，ES7 的特性**

大量运用了 async/await 新特性，使得更好的处理异步，使得代码更加简化，例如，处理首页是否登录
src/view/loan.vue

```javascript
async mounted() {
  const uerId = getItem('userid')
  if (!uerId) {
    await Confirm({
      title: '提示',
      content: '请先登录'
    })
    this.$router.push({ path: 'login' })
  } else {
    this.$store.commit('setTab', true)
  }
},
```

# 代码性能

**1.压缩所有图片**

利用 [https://tinypng.com/](https://tinypng.com/)
进行了对所有图片的压缩，以及手动对一些尺寸大的图片进行压缩，
例如，项目中只需要用到 80*80 像素的图片，实际上服务器传了一张 200*200 的，所以手动进行了对图片调整。

**2.所有请求，统一采用先加载页面，再进行请求，体验优化**

在之前的版本，是让请求和切换页面同时进行，所以在切换的过程过，会出现卡顿的现象。。现在，我将移到了页面的 mounted 中，并且加入了 loading 动画，为了展示 loading 动画，特别搞了点小动作，因为我们的项目“太快了“！！“太快了“！！“太快了“！！，我怕你们看不到这个动画。以下 src/view/chat.vue 为例子，删除了一些不利于阅读的代码。

```javascript
mounted() {
  loading.show()
  setTimeout(async () => {
    await this.$store.dispatch('getMessHistory', {roomid: this.roomid})
    loading.hide()
    this.isLoadingAchieve = true
//        window.scroll(0, 10000)
  }, 1000)
},
```

# 体验优化

1.切换路由动画

切换的顺序，主要参考了这位大哥的思路，
[https://github.com/zhengguorong/pageAinimate](https://github.com/zhengguorong/pageAinimate)并且在他的基础上，我再进行了优化，让我们的项目页面切换变成了牛逼哄哄的样子。
**“顺畅的不像话“，看起来分不清楚是 app 还是 h5**

![这里写图片描述](https://s3.mdedit.online/blog/1579506286226.gif)

可以看我的 Basetransition.vue 页面。

script

```javascript
export default {
  data() {
    return {
      transitionName: "slide-left",
    };
  },
  beforeRouteUpdate(to, from, next) {
    let isBack = this.$router.isBack;
    if (isBack) {
      this.transitionName = "slide-right";
    } else {
      this.transitionName = "slide-left";
    }
    this.$router.isBack = false;
    next();
  },
};
```

css

```css
.slide-left-enter {
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}
.slide-left-leave-active {
  -webkit-transform: translate(-100px, 0);
  transform: translate(-100px, 0);
}
.slide-right-enter {
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}
.slide-right-leave-active {
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}
```

核心主要是这两段代码。

**当旧的路由（旧的页面）被新的路由（页面）替换，其实在一般的 app 中你可以看到新的页面滑进来，旧的页面一般都是会往左偏移一段距离，我们正是实现了这样的一个过程。并且通过一个属性 isBack 来判断进入和退出所需要的动画方向。**

还有一个就是退出的时候，我们需要将 child-view 设置 overflow:hidden,因为我们这个聊天组件的时候，需要渲染许多 dom，所以如果让文档溢出的话，会出现卡顿的效果。

2.首页加载速度性能提升（移除首页所有不必要的请求）

在我们本来的项目中，首页有载入许多图片，现在移除了所有不必要的图片。

3.加入 loading, 优化处理

![这里写图片描述](https://s3.mdedit.online/blog/1579506287156.gif)

4.加入静态组件，仿苹果弹窗(Alert, confirm)

![这里写图片描述](https://s3.mdedit.online/blog/1579506286222.gif)

5.加入用户缓存机制，不必每次刷新重新登录了

我们可以使用 utils 下的 localStorage.js，setItem 这个函数，
setItem(key, value, duration)，参数分别为，属性名，属性值，缓存时长。

6.增加历史记录功能

下面的历史记录也可以查看啦。

# 对比

因为服务器比较渣，所以还是能体谅这个速度，我们主要看前后对比时间。
重构前：
![这里写图片描述](https://s3.mdedit.online/blog/1579506286303.jpg)

![这里写图片描述](https://s3.mdedit.online/blog/1579506284422.jpg)

重构后：
![这里写图片描述](http://img.blog.csdn.net/20171005164633707?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYmx1ZWJsdWVza3lodWE=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

![这里写图片描述](https://s3.mdedit.online/blog/1579506286899.jpg)

比较之下还是有很大的改善的。剩下的自己慢慢体会吧。
