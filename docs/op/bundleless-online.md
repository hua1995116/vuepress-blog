在线编译 jsx
https://babeljs.io/docs/en/babel-standalone

https://unpkg.com/babel-standalone@6.26.0/babel.js
https://github.com/babel/babel-standalone
https://github.com/babel/babel/tree/master/packages/babel-standalone

在线编译 vue

https://github.com/postcss/postcss/issues/830
https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler

https://github.com/vuejs/vue-next/tree/master/packages/compiler-sfc
https://medium.com/js-dojo/vue-js-single-file-javascript-components-in-the-browser-c03a0a1f13b8
https://spectrum.chat/react/general/does-react-need-a-way-to-compile-jsx-on-the-browser~e06098d3-4cc8-4d8e-8528-0b988a975351

难点，如何代理 请求？

vite 的 核心，代理请求，去修改里面的内容

而 import 的核心是直接 引入一个 url ，那么我们必须要再浏览器就代理这个事件，一开始我想到 service work，但是发现 service work 只能代理 fetch，
