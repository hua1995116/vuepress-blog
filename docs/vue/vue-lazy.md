# vue-lazyload基础实例（基于vue2.0和vue-router2.0）


首先引入依赖

```javascript
import Vue from 'vue';
import Router from 'vue-router';
import VueLazyload from 'vue-lazyload';
```
配置vue-lazyload

```javascript
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: './img/error.jpg',
  loading: 'http://cdn.uehtml.com/201402/1392662591495_1140x0.gif',
  attempt: 1,
  listenEvents: [ 'scroll', 'mousewheel' ]
});
```
模版部分

```html
<div class="hello">
  <ul>
    <li v-for="item in imgUrl">
      <img v-lazy="item.src" alt="" width="300" height="150"/>
    </li>
  </ul>
</div>
export default {
  name: 'hello',
  data() {
    return {
      imgUrl: [
        {src: 'http://pic.58pic.com/58pic/11/25/25/46j58PICKMh.jpg'},
        {src: 'http://pic.58pic.com/58pic/11/25/25/46j58PICKMh.jpg'},
        {src: 'http://pic.58pic.com/58pic/11/25/25/46j58PICKMh.jpg'},
        {src: 'http://pic.58pic.com/58pic/11/25/25/46j58PICKMh.jpg'}
      ]
    };
  }
};
```
css

```css
img[lazy=loading]{
	//your code
}
img[lazy=loaded]{
	//your code
  animation:fade 0.5s;
}
@keyframes fade {
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
```
项目完整实例地址：https://github.com/hua1995116/vue/tree/master/vue-lazyload
lazy-load api 地址https://www.npmjs.com/package/vue-lazyload
