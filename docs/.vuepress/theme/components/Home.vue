<template>
  <div class="container">
    <main class="main-page">
      <!-- <h3>系列文章</h3>
      <hr>
      <ul>

      </ul> -->
      <h3>最新文章</h3>
      <hr />
      <div
        v-for="post in recentPosts"
        class="archive-post"
        :key="post.path + ':recent'"
      >
        <span
          v-text="dayjs(post.date).format('YYYY/MM/DD')"
          class="archive-post-date"
        ></span>
        <router-link class="nav-link" :to="post.path">{{
          post.title
        }}</router-link>
      </div>
      <div class="archive-post">
        <router-link class="nav-link" to="/frontend">更多文章...</router-link>
      </div>
      <!-- <h3>热门文章</h3>
      <hr>
      <div v-for="post in hotPosts" class="archive-post" :key="post.path + ':hot'">
        <span v-text="dayjs(post.frontmatter.date).format('YYYY/MM/DD')" class="archive-post-date"></span>
        <router-link
          class="nav-link"
          :to="post.path"
        >{{ post.title }}</router-link>
      </div>
      <div class="archive-post">
        <router-link
          class="nav-link"
          to="/post"
        >更多文章...</router-link>
      </div> -->
    </main>
    <aside class="aside-page">
      <Bar />
      <h3>友情链接</h3>
      <hr />
      <ul class="friend-link">
        <li>
          <a href="https://resume.mdedit.online/"
            >木及简历(Markdown就能写出好简历)</a
          >
        </li>
        <!-- 
        <li>
          <a href="http://www.inode.club">程序员成长指北</a>
        </li>
        <li>
          <a href="https://biaochenxuying.cn/">夜尽天明的个人博客网站</a>
        </li>
        <li>
          <a href="https://liuxiangyang.space">刘向洋，记录工作记录生活</a>
        </li>
        <li>
          <a href="https://ouyang.wang">Ouyang's Blog</a>
        </li>
        <li>
          <a href="http://www.javadaily.cn">Java 日知录</a>
        </li>
        <li>
          <a href="https://blog.yinuxy.com/">YINUXY | 理想的生活就是生活的理想</a>
        </li> -->
      </ul>
      <hr />
      <h3>找到我</h3>
      <ul>
        <li>微信(hyf1995116)</li>
        <li><a href="https://www.zhihu.com/people/lan-se-89-98-69">知乎</a></li>
        <li>
          <a href="https://juejin.im/user/5964cb3a6fb9a06bb0194421">掘金</a>
        </li>
        <li><a href="https://github.com/hua1995116">github</a></li>
      </ul>
      <h3>备案号</h3>
      <a href="https://beian.miit.gov.cn/">浙ICP备16040413号-7</a>
    </aside>
  </div>
</template>

<script>
import QR from "@theme/components/QR.vue";
import Bar from "@theme/components/Bar.vue";
import dayjs from "dayjs";

export default {
  components: { QR, Bar },
  data() {
    return {
      dayjs,
    };
  },
  computed: {
    hotPosts() {
      return this.$site.pages
        .filter(
          (page) => page.title && page.frontmatter.date && page.frontmatter.hot
        )
        .sort((x, y) => dayjs(y.frontmatter.hot) - dayjs(x.frontmatter.hot))
        .slice(0, 10);
    },
    recentPosts() {
      console.log(this.$site.pages);
      return [
        {
          title: "尤大亲自评测 Vue3 和 Svelte(19个组件后Vue更好!)",
          date: "2021-07-11 22:33:54",
          path: "vue/svelte-vs-vue3.html",
        },
        {
          title: "只用 Markdown 就写出好看的简历，在线简历应用闪亮登场！",
          date: "2021-03-15 22:33:54",
          path: "frontend/markdown-resume.html",
        },
        {
          title: "2021前端学习路径书单—自我成长之路",
          date: "2021-02-18 22:33:54",
          path: "frontend/frontend-books.html",
        },
        {
          title: "教你实现微信8.0『炸裂』的🎉表情特效",
          date: "2021-02-17 12:04:17",
          path: "canvas/weixin-8.0-emoji.html",
        },
        {
          title: "在vue用throttle的最佳实践原理分析",
          date: "2021-01-25 01:04:17",
          path: "vue/vue-event-throttle.html",
        },
        {
          title: "请查收 2020 全球 JS 调查结果",
          date: "2021-01-15 22:33:54",
          path: "frontend/2020-state-of-js.html",
        },
        {
          title: "2020年度CSS报告新鲜出炉，从业者平均年薪35w",
          date: "2021-01-02 22:33:54",
          path: "frontend/2020-css.html",
        },
        {
          title: "2021年，推荐一个百度新出开发专用搜索引擎，没有广告！",
          date: "2020-10-11 22:33:54",
          path: "frontend/baidu-kaifa.html",
        },
        {
          title: "2021 chrome 插件推荐",
          date: "2020-10-10 22:33:54",
          path: "frontend/chrome-frontend.html",
        },
        {
          title: "从破解某定设计网站谈前端水印(详细教程)",
          date: "2020-10-09 22:33:54",
          path: "frontend/watermark.html",
        },
        {
          title: "Node Sass 弃用，以 Dart Sass 代替",
          date: "2020-10-08 22:33:54",
          path: "frontend/node-sass-eprecated.html",
        },
        {
          title: "这个插件居然让vscode变成了交友工具(以码会友)",
          date: "2020-10-07 22:33:54",
          path: "frontend/friend-vscode.html",
        },
        {
          title: "🔱 几个你不知道的Git小命令,收获快乐。",
          date: "2020-10-06 22:33:54",
          path: "frontend/git-10-up.html",
        },
        {
          title: "前端多线程大文件下载实践，提速10倍+",
          date: "2020-09-20 22:33:54",
          path: "node/mutiple-download.html",
        },
        {
          title: "一文带你层层解锁「文件下载」的奥秘",
          date: "2020-08-31 22:33:54",
          path: "node/file-download.html",
        },
        {
          title: "ES2017 异步函数最佳实践（`async` /`await`）",
          date: "2020-08-06 22:33:54",
          path: "frontend/best-practices-aysnc.html",
        },
        {
          title: "ES6 Promise 的最佳实践",
          date: "2020-07-31 22:33:54",
          path: "frontend/best-practices-es6-promise.html",
        },
        {
          title: "[重拾CSS]一道面试题来看伪元素、包含块和高度坍塌",
          date: "2020-05-19 22:33:54",
          path: "frontend/collapsing-margins.html",
        },
        {
          title: "10种跨域解决方案（附终极方案）",
          date: "2020-04-13 20:12:54",
          path: "frontend/cors.html",
        },
        {
          title: "一文了解文件上传全过程（1.8w字深度解析，进阶必备）",
          date: "2020-03-29 22:48:09",
          path: "node/upload.html",
        },
        {
          title:
            "shark-cleaner: 一个Node Cli 实现的垃圾清理工具(深层清理开发垃圾)",
          date: "2020-03-24 22:48:08",
          path: "node/shark-cleaner.html",
        },
        {
          title: "提高前端开发者效率的11个必备的网站",
          date: "2020-02-29 22:48:08",
          path: "frontend/11-must-website.html",
        },
        {
          title: "《模块化系列》彻底理清 AMD,CommonJS,CMD,UMD,ES6",
          date: "2020-02-27 22:48:08",
          path: "frontend/module.html",
        },
        {
          title: "《模块化系列》snowpack，提高10倍打包速度。",
          date: "2020-02-24 22:48:08",
          path: "frontend/snowpack.html",
        },
        {
          title: " Node + NAPI 实现 C++ 扩展 - LRU 淘汰算法",
          date: "2019-12-29 22:48:09",
          path: "node/node-addon.html",
        },
      ];
      // return this.$site.pages
      //   .filter(page => page.title && page.frontmatter.date)
      //   .sort((x, y) => dayjs(y.frontmatter.date) - dayjs(x.frontmatter.date))
      //   .slice(0, 10)
    },
  },
};
</script>
