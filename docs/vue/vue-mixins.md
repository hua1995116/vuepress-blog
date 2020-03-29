# vue-mixins一些常用方法


# 前言
今天接手公司的一个vue的项目，发现项目中有个mixins属性，我发现之前的项目中都没有发现过这个属性。查阅了官方文档并进行了总结。
官方文档: [mixins](https://cn.vuejs.org/v2/guide/mixins.html)
vue-mixins与父子组件还是有很大的区别的。
# 组件与mixins区别
**组件：**
父组件 + 子组件 >>> 父组件 + 子组件
**mixins：**
 父组件 + 子组件 >>> new父组件
# 使用场景
当两个组件存在相同的方法，例如需要进行初始化，例如分页操作，进入页面时，需要对页面初始化页面。这个时候你可以选择传统的写组件来进行分离，但是使用mixins可以不通过状态传递，直接进行强大的混合，方便了许多。
mixins允许你封装一块在应用的其他组件中都可以使用的函数。如果使用姿势得当，他们不会改变函数作用域外部的任何东西，因此哪怕执行多次，只要是同样的输入你总是能得到一样的值，
# 使用方法
## 1.基础用法
```vue
// 定义一个混合对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}
// 定义一个使用混合对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})
var component = new Component() // -> "hello from mixin!"
```
以上可以看到混合后的组件能够非常自然的执行，mixins组件里的函数。
## 2.选项合并

```vue
var mixin = {
  created: function () {
    console.log('混合对象的钩子被调用')
  }
}
new Vue({
  mixins: [mixin],
  created: function () {
    console.log('组件钩子被调用')
  }
})
// -> "混合对象的钩子被调用"
// -> "组件钩子被调用"
```

对于有冲突的代码，这里可以分为两个情况，如果是vue生命周期里的钩子函数，那将会进行合并，以此执行mixins以及组件的函数；如果是methods等方法，（不是钩子函数）那组件中的方法将会覆盖mixins中的方法。

## 3.合并策略中的问题

```vue
var mixin = {
  created: function () {
	 this.init ()；
  },
  methods: {
	init (){
		// 一些初始化操作
	}
  }
}
new Vue({
  mixins: [mixin],
  created: function () {
    console.log('组件钩子被调用')
  },
  beforeRouteEnter(to, from, next) {
	next(vm => {
	   vm.init();
    })
  }
})
```
像这样我们希望路由进入的时候在进行初始化，盲目的进行混合就会使得初始化两次。
## 4.解决办法
```vue
var mixin = {
  created: function() {
	let option = this.$options.doNotInit
    if (!option) {
      this.init();
    }
  },
  methods: {
	init (){
		// 一些初始化操作
	}
  }
}
new Vue({
  mixins: [mixin],
  doNotInit: true,
  created: function () {
    console.log('组件钩子被调用')
  },
  beforeRouteEnter(to, from, next) {
	next(vm => {
	   vm.init();
    })
  }
})
```
这样就避免了两次的初始化操作。

参考：
http://www.sohu.com/a/153785407_464084
http://www.deboy.cn/Vue-mixins-advance-tips.html