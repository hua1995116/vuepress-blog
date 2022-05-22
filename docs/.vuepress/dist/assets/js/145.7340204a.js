(window.webpackJsonp=window.webpackJsonp||[]).push([[145],{530:function(n,t,e){"use strict";e.r(t);var a=e(44),s=Object(a.a)({},(function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[e("h1",{attrs:{id:"vue-mixins一些常用方法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#vue-mixins一些常用方法"}},[n._v("#")]),n._v(" vue-mixins一些常用方法")]),n._v(" "),e("h1",{attrs:{id:"前言"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#前言"}},[n._v("#")]),n._v(" 前言")]),n._v(" "),e("p",[n._v("今天接手公司的一个vue的项目，发现项目中有个mixins属性，我发现之前的项目中都没有发现过这个属性。查阅了官方文档并进行了总结。\n官方文档: "),e("a",{attrs:{href:"https://cn.vuejs.org/v2/guide/mixins.html",target:"_blank",rel:"noopener noreferrer"}},[n._v("mixins"),e("OutboundLink")],1),n._v("\nvue-mixins与父子组件还是有很大的区别的。")]),n._v(" "),e("h1",{attrs:{id:"组件与mixins区别"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#组件与mixins区别"}},[n._v("#")]),n._v(" 组件与mixins区别")]),n._v(" "),e("p",[e("strong",[n._v("组件：")]),n._v("\n父组件 + 子组件 >>> 父组件 + 子组件\n"),e("strong",[n._v("mixins：")]),n._v("\n父组件 + 子组件 >>> new父组件")]),n._v(" "),e("h1",{attrs:{id:"使用场景"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#使用场景"}},[n._v("#")]),n._v(" 使用场景")]),n._v(" "),e("p",[n._v("当两个组件存在相同的方法，例如需要进行初始化，例如分页操作，进入页面时，需要对页面初始化页面。这个时候你可以选择传统的写组件来进行分离，但是使用mixins可以不通过状态传递，直接进行强大的混合，方便了许多。\nmixins允许你封装一块在应用的其他组件中都可以使用的函数。如果使用姿势得当，他们不会改变函数作用域外部的任何东西，因此哪怕执行多次，只要是同样的输入你总是能得到一样的值，")]),n._v(" "),e("h1",{attrs:{id:"使用方法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#使用方法"}},[n._v("#")]),n._v(" 使用方法")]),n._v(" "),e("h2",{attrs:{id:"_1-基础用法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-基础用法"}},[n._v("#")]),n._v(" 1.基础用法")]),n._v(" "),e("div",{staticClass:"language-vue extra-class"},[e("pre",{pre:!0,attrs:{class:"language-vue"}},[e("code",[n._v("// 定义一个混合对象\nvar myMixin = {\n  created: function () {\n    this.hello()\n  },\n  methods: {\n    hello: function () {\n      console.log('hello from mixin!')\n    }\n  }\n}\n// 定义一个使用混合对象的组件\nvar Component = Vue.extend({\n  mixins: [myMixin]\n})\nvar component = new Component() // -> \"hello from mixin!\"\n")])])]),e("p",[n._v("以上可以看到混合后的组件能够非常自然的执行，mixins组件里的函数。")]),n._v(" "),e("h2",{attrs:{id:"_2-选项合并"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-选项合并"}},[n._v("#")]),n._v(" 2.选项合并")]),n._v(" "),e("div",{staticClass:"language-vue extra-class"},[e("pre",{pre:!0,attrs:{class:"language-vue"}},[e("code",[n._v("var mixin = {\n  created: function () {\n    console.log('混合对象的钩子被调用')\n  }\n}\nnew Vue({\n  mixins: [mixin],\n  created: function () {\n    console.log('组件钩子被调用')\n  }\n})\n// -> \"混合对象的钩子被调用\"\n// -> \"组件钩子被调用\"\n")])])]),e("p",[n._v("对于有冲突的代码，这里可以分为两个情况，如果是vue生命周期里的钩子函数，那将会进行合并，以此执行mixins以及组件的函数；如果是methods等方法，（不是钩子函数）那组件中的方法将会覆盖mixins中的方法。")]),n._v(" "),e("h2",{attrs:{id:"_3-合并策略中的问题"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-合并策略中的问题"}},[n._v("#")]),n._v(" 3.合并策略中的问题")]),n._v(" "),e("div",{staticClass:"language-vue extra-class"},[e("pre",{pre:!0,attrs:{class:"language-vue"}},[e("code",[n._v("var mixin = {\n  created: function () {\n\t this.init ()；\n  },\n  methods: {\n\tinit (){\n\t\t// 一些初始化操作\n\t}\n  }\n}\nnew Vue({\n  mixins: [mixin],\n  created: function () {\n    console.log('组件钩子被调用')\n  },\n  beforeRouteEnter(to, from, next) {\n\tnext(vm => {\n\t   vm.init();\n    })\n  }\n})\n")])])]),e("p",[n._v("像这样我们希望路由进入的时候在进行初始化，盲目的进行混合就会使得初始化两次。")]),n._v(" "),e("h2",{attrs:{id:"_4-解决办法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-解决办法"}},[n._v("#")]),n._v(" 4.解决办法")]),n._v(" "),e("div",{staticClass:"language-vue extra-class"},[e("pre",{pre:!0,attrs:{class:"language-vue"}},[e("code",[n._v("var mixin = {\n  created: function() {\n\tlet option = this.$options.doNotInit\n    if (!option) {\n      this.init();\n    }\n  },\n  methods: {\n\tinit (){\n\t\t// 一些初始化操作\n\t}\n  }\n}\nnew Vue({\n  mixins: [mixin],\n  doNotInit: true,\n  created: function () {\n    console.log('组件钩子被调用')\n  },\n  beforeRouteEnter(to, from, next) {\n\tnext(vm => {\n\t   vm.init();\n    })\n  }\n})\n")])])]),e("p",[n._v("这样就避免了两次的初始化操作。")]),n._v(" "),e("p",[n._v("参考：\nhttp://www.sohu.com/a/153785407_464084\nhttp://www.deboy.cn/Vue-mixins-advance-tips.html")])])}),[],!1,null,null,null);t.default=s.exports}}]);