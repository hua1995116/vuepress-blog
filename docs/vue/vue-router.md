# Vue-router2.0基础，秒会。



如果不是模块式开发，请先引入

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
```

####1.0基础

```html
<div id="app">
    <h1>Hello App!</h1>
    <p>
        <router-link to="/foo">Go to Foo</router-link>
        <router-link to="/bar">Go to Bar</router-link>
    </p>
    <router-view></router-view>
</div>
```

```javascript
// 0. 如果使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const routes = [
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
]

const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
})
const app = new Vue({
    router
}).$mount('#app')
```
####2.0动态路由匹配

```html
<div id="app">
    <h1>Hello App!</h1>
    <p>
        <router-link to="/user/abc">Go to abc</router-link>
        <router-link to="/user/cba">Go to cba</router-link>
    </p>
    <router-view></router-view>
</div>
```

```javascript
const User = {
    template: '<div>User {{ $route.params.id }}</div>',
    '$route'(to,from){
        console.log('从'+from.params.id+'到'+to.params.id)
    }
}

const router = new VueRouter({
    routes: [
        // 动态路径参数 以冒号开头
        { path: '/user/:id', component: User }
    ]
})

const app = new Vue({
    router
}).$mount('#app')
```
####3.0嵌套路由

```html
<div id="app">
    <h1>Hello App!</h1>
    <p>
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <router-link to="/user/foo/profile">Go to profile</router-link>
        <router-link to="/user/foo/posts">Go to posts</router-link>
        <router-link to="/user/foo">Go to home</router-link>
    </p>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
</div>
```

```javascript
const User = {
    template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}
const UserProfile = {
    template: '<div>UserProfile</div>'
}
const UserPosts = {
    template: '<div>UserPosts</div>'
}
const UserHome = {
    template: '<div>UserHome</div>'
}

const router = new VueRouter({
    routes: [
        { path: '/user/:id', component: User,
            children: [
                {
                    // 当 /user/:id/profile 匹配成功，
                    // UserProfile 会被渲染在 User 的 <router-view> 中
                    path: 'profile',
                    component: UserProfile
                },
                {
                    // 当 /user/:id/posts 匹配成功
                    // UserPosts 会被渲染在 User 的 <router-view> 中
                    path: 'posts',
                    component: UserPosts
                },
                {   path: '',
                    component: UserHome
                }
            ]
        }
    ]
})

const app = new Vue({
    router
}).$mount('#app')
```
#####4.0编程式导航

```html
<div id="app">
    <h1>Hello App!</h1>
    <p>
        <!-- 使用 router-link 组件来导航. -->
        <!-- 通过传入 `to` 属性指定链接. -->
        <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
        <router-link to="/user/foo">Go to foo</router-link>
    </p>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>

```

```javascript
const User = {
    template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
    </div>
  `
}

const Login = {
    templete:`
    <div>login</div>
  `
}

const router = new VueRouter({
    routes: [
        {
            path: '/user/:id', component: User,
        },
        {
            path: '/login',component:Login
        }
    ]
})


const app = new Vue({
    router
}).$mount('#app')

router.push({ path: 'login', query: { plan: 'private' }});
```
####5.0命名路由

```html
<div id="app">
    <h1>Hello App!</h1>
    <p>
        <router-link :to="{name:'user',params:{userId:123}}">Go to 123</router-link>
        <router-link to="/user/123">Go to 123</router-link>
    </p>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
</div>
```

```javascript
const User = {
    template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
    </div>
  `
}

const router = new VueRouter({
    routes: [
        {
            path: '/user/:userId',
            name:'user',
            component: User
        }
    ]
})


const app = new Vue({
    router
}).$mount('#app')
```
####6.0命名视图

```html
<div id="app">
    <h1>Hello App!</h1>

    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view class="view"></router-view>
    <router-view class="view" name="a"></router-view>
    <router-view class="view" name="b"></router-view>
</div>
```

```javascript
const Foo = {
    template:'<div>I am Foo</div>'
}
const Bar = {
    template:'<div>I am Bar</div>'
}
const Baz = {
    template:'<div>I am Baz</div>'
}

const router = new VueRouter({
    routes: [
        {
            path: '/',
            components: {
                default:Foo,
                a:Bar,
                b:Baz
            }
        }
    ]
})


const app = new Vue({
    router
}).$mount('#app')
```

github完整代码地址https://github.com/hua1995116/vue/tree/master/vue-router