# vue父子组件&继承组件的生命周期以及应用 


## 父子组件的生命周期顺序

今天在做项目时候，发现了一个问题，那就是父子组件的执行顺序问题，在我印象里，肯定是先执行父组件的生命周期，再执行子组件的生命周期，但其实并不是这样的。我们来看代码：

我们先用vue-cli搭建一个项目。（用什么搭建并不重要，我这里为了快速模拟就偷懒不自己配置webpack了）
父组件: app.vue

```vue
<template>
  <div id="app">
    <hello></hello>
  </div>
</template>

<script>
import Hello from './components/Hello'

export default {
  name: 'app',
  components: {
    Hello
  },
  beforeMount() {
    console.log('I am parents beforeMount');
  },
  mounted() {
    console.log('I am parents mounted');
  },
  beforeCreate() {
    console.log('I am parents beforeCreated');
  },
  created() {
    console.log('I am parents created');
  }
}
</script>
```
子组件hello.vue
```vue
<template>
  <div class="hello">
    hello
  </div>
</template>

<script>
export default {
  name: 'hello',
  beforeMount() {
    console.log('I am child beforeMount');
  },
  mounted() {
    console.log('I am child mounted');
  },
  beforeCreate() {
    console.log('I am child beforeCreated');
  },
  created() {
    console.log('I am child created');
  }
}
</script>
```

![这里写图片描述](https://s3.qiufengh.com/blog/1579506284835.jpg)

我们从而可以得出结论。
父子组件的执行顺序为，
父组件beforeCreated ->父组件created ->父组件beforeMounted ->子组件beforeCreated ->子组件created ->子组件beforeMounted ->子组件mounted -> 父组件mounted。

知道了这个以后，在一些父子组件的接口中，那些强依赖于顺序的接口调用顺序就引刃而解了。

**一定要记住父组件的mounted最后。**
**一定要记住父组件的mounted最后。**
**一定要记住父组件的mounted最后。**

## 继承组件的生命周期
base.vue

```vue
<template>
  <div>
    base
  </div>
</template>

<script>
  export default {
    beforeMount() {
      console.log('I am base beforeMount');
    },
    mounted() {
      console.log('I am base mounted');
    },
    beforeCreate() {
      console.log('I am base beforeCreated');
    },
    created() {
      console.log('I am base created');
    }
  }
</script>
```
hello.vue

```vue
<template>
  <div class="hello">
    hello
  </div>
</template>

<script>
import Base from './base.vue';

export default {
  extends: Base,
  beforeMount() {
    console.log('I am beforeMount');
  },
  mounted() {
    console.log('I am mounted');
  },
  beforeCreate() {
    console.log('I am beforeCreated');
  },
  created() {
    console.log('I am created');
  }
}
</script>
```

![这里写图片描述](https://s3.qiufengh.com/blog/1579506284597.jpg)

可以看到生命周期是交替执行的。
## 应用

理解了以上的过程，我们可以来进行一个应用，我们在开发项目的时候都知道，一旦项目大了，代码就特别多，而且对于生命周期也难以维护，我们就这样采取以下的方式，会让你的代码整洁许多。
base.vue

```vue
<template>
  <div class="hello">
    base
  </div>
</template>

<script>
  export default {
    mounted() {
      this.handleMounted();
    }
  }
</script>
```
hello.vue
```vue
<template>
  <div class="hello">
    hello
  </div>
</template>

<script>
import Base from './base.vue';

export default {
  extends: Base,
  methods: {
    handleMounted() {
      console.log('mounted');
    }
  }
}
</script>
```
结果
![这里写图片描述](https://s3.qiufengh.com/blog/1579506285241.jpg)


这样有什么好处呢，我们可以更加关注组件编写的方法的过程，不必重复去定义一些生命周期，在一个父组件中统一分发了，这样在一个庞大的项目中，我们就可以更加愉快的编写代码了。整个逻辑也更加清晰。