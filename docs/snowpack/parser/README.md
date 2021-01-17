# 解析

本章是对snowpack解析部分的讲解。



所有文件发起请求都会经过 snowpack 的劫持。

解析前

```vue
<template>
  <div class="App">
    <header class="App-header">
      <img src="/logo.svg" class="App-logo" alt="logo" />
      <p>
        Edit1
        <code>src/App.vue</code> and save to reload.
      </p>
      <a
        class="App-link"
        href="https://vuejs.org"
        target="_blank"
        rel="noopener noreferrer"
      >{{ message }}</a>
      <CompomentB></CompomentB>
    </header>
  </div>
</template>

<script>
import CompomentB from './b.vue'
import {a} from './2'
export default {
  data() {
    return {
      message: "Learn Vue12"
    };
  },
  components: {
    CompomentB,
  }
};
</script>

<style>
@import url('aaa/1.css');
.App {
  text-align: center;
  height: 1000;
}
.App-header {
  background-color: #f9f6f6;
  color: #32485f;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}
.App-link {
  color: #00c185;
}
.App-logo {
  height: 40vmin;
  pointer-events: none;
  margin-bottom: 1rem;
  animation: App-logo-spin infinite 1.6s ease-in-out alternate;
}
@keyframes App-logo-spin {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.06);
  }
}
</style>

```

解析后

```js
import './App.css.proxy.js';

import CompomentB from './b.js'
import {a} from './2.js'
...
```

那么这个过程是怎么做到的呢？

首先呢，我们先来看 `html` 根文件。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Web site created using create-snowpack-app" />
    <title>Snowpack App</title>
  </head>
  <body>
    <div id="app"></div>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <script type="module" src="/_dist_/index.js"></script>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  <script type="module" src="/__snowpack__/hmr.js"></script></body>
</html>

```

