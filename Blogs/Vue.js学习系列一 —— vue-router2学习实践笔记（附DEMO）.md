> 想学习Vue的SPA应用，路由这一块是必不可少的。相信很多和我一样刚接触前端的朋友对于路由这玩意是很困惑的。所以在我学习并成功使用了 `vue-router` 后，将我的个人经验分享出来，希望可以让同样对路由不知所措的同学有所帮助。

# 注意：
* **本文demo的项目结构用的是最新的[命令行工具](https://github.com/vuejs/vue-cli)创建的webpack项目模板**；
* 本文知识点是基于Vue2.0和vue-route 2的，更多内容请参考[Vue.js官网](http://cn.vuejs.org/)和[vue-router 2官方文档](http://router.vuejs.org/zh-cn/)：

# 一、路由的安装：
## npm安装
可以使用npm直接安装插件
```
npm install vue-router --save
```
执行命令完成vue-router的安装，并在package.json中添加了vue-router的依赖。当我们在其他电脑上安装项目时只需要执行 `npm install` 即可完成安装。

**package.json**
```
  "dependencies": {
    ...
    "vue-router": "^2.1.1"
    ...
  },
```
如果是要安装在开发环境下，则使用以下命令行：
```
npm install vue-router --save-dev
```
**package.json**
```
  "devDependencies": {
    ...
    "vue-router": "^2.1.1",
    ...
  },
```
# 二、SPA中路由的简单实现（附demo）
下面让我们来配置路由并实现我们的第一次页面跳转。
[官方提供的demo](http://router.vuejs.org/zh-cn/essentials/getting-started.html)很简单，复制到HTML中也的确能跑，但是问题是不知道如何在SPA应用中使用，这坑了我不少时间。在看了不少他人的项目后，完成了SPA路由的简单实现demo（基于vue-cli的webpack模板）。
**main.js**
```
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Page01 from './components/page01'
import Page02 from './components/page02'

Vue.use(VueRouter)//全局安装路由功能
//定义路径
const routes = [
  { path: '/', component: Page01 },
  { path: '/02', component: Page02 },
]
//创建路由对象
const router = new VueRouter({
  routes
})

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
})
```
**App.vue**
```
<template>
  <div id="app">
    <router-link to="/">01</router-link>
    <router-link to="/02">02</router-link>
    <br/>
    <router-view></router-view>
  </div>
</template>
```
**page01.vue**
```
<template>
  <div>
    <h1>page02</h1>
  </div>
</template>

```
**page02.vue**
```
<template>
  <div>
    <h1>page02</h1>
  </div>
</template>

```
实现步骤：
1. `npm`安装`vue-router`
2. `Vue.use(VueRouter)`全局安装路由功能
3. 定义路径数组`routes`并创建路由对象`router`
4. 将`router`对象传到Vue对象中
5. 在根组件中使用`<router-link>`定义跳转路径
6. 在根组件中使用`<router-view>`来渲染组件
7. 创建子组件

# 三、路由的跳转
## router-link
`router-link`标签用于页面的跳转，简单用法我们刚才提到过了。
```
<router-link to="/page01">page01</router-link>
```
点击这个`router-link`标签`router-view`就会渲染路径为`/page01`的页面。
**注意：**`router-link`默认是一个`<a>`标签的形式，如果需要显示不同的样子，可以在`router-link`标签中写入不同标签元素，如下显示为`button`按钮。
```
<router-link to="/04">
    <button>to04</button>
</router-link>
```
## router.push
下面我们通过JS代码控制路由的界面渲染，官方文档写法如下：
```
// 字符串
router.push('home')
// 对象
router.push({ path: 'home' })
// 命名的路由
router.push({ name: 'user', params: { userId: 123 }})
// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```
那么问题来了，如果是全局注册的路由`Vue.use(VueRouter)`，应该怎么写呢？
```
// 字符串
this.$router.push('home')
// 对象
this.$router.push({ path: 'home' })
// 命名的路由
this.$router.push({ name: 'user', params: { userId: 123 }})
// 带查询参数，变成 /register?plan=private
this.$router.push({ path: 'register', query: { plan: 'private' }})
```

> 为什么能这么写呢，猜测是将router对象传递给Vue对象后，复制router对象为Vue.$router上了。还未在源码中求证，如有错误请指出，谢谢~

push方法其实和`<router-link :to="...">`的写法是等同的。
**注意：**push方法的跳转会向 history 栈添加一个新的记录，当我们点击浏览器的返回按钮时可以看到之前的页面。
## router.replace
push方法会向 history 栈添加一个新的记录，而replace方法是替换当前的页面，不会向 history 栈添加一个新的记录。用法如下
**template**
```
<router-link to="/05" replace>05</router-link>
```
**script**
```
this.$router.replace({ path: '/05' })
```
## router.go
go方法用于控制history记录的前进和后退
```
// 在浏览器记录中前进一步，等同于 history.forward()
this.$router.go(1)
// 后退一步记录，等同于 history.back()
this.$router.go(-1)
// 前进 3 步记录router.go(3)
// 如果 history 记录不够用，那就默默地失败呗
this.$router.go(-100)
this.$router.go(100)
```
其实很好理解：**go方法就是浏览器上的前进后退按钮，方法中传递的数字参数就是前进和后退的次数**
# 四、路由的传参方式
在路由跳转的过程中会传递一个object，我们可以通过`watch`方法查看路由信息对象。
```
watch: {
  '$route' (to, from) {
      console.log(to);
      console.log(from);
  },
},
```
**console中看到的路由信息对象**
```
{
    ...
    params: { id: '123' },
    query: { name: 'jack' },
    ...
}
```
这两个参数会在页面跳转后写在路径中，路径相当于`/page/123?name=jack`
## 1. params
params传递的数据可用于匹配动态路由字段。如params的数据为 `params: { abc: 'hello', txt: 'world' }` 而动态路由路径为 `path: '/05/:txt` 那么最终的路径就会是 `/05/world`。**所以，动态路由其实就是一种params的传递方式。**

**注意：由于动态路由也是传递params的，所以在 `this.$router.push()` 方法中 path不能和params一起使用，否则params将无效！需要用name来指定页面。之后动态路由会从params中找到动态路由同名的数据。**

### 传递数据
在路由配置文件中定义参数
```
 export default [
    ...
    { name: 'Page05', path: '/05/:txt', component: Page05 },
]
```
下面有两种传递params的方式
#### 1. 通过path传递
路径后面的`/:txt`就是我们要传递的参数。
```
this.$router.push({ path: '/05/441'})
```
此时路由跳转的路径
```
http://localhost:8080/#/05/441
```
此时我们看到查看路由信息对象：
```
{
    ...
    params: {
        txt: '441'
    }
    ...
}
```
#### 2. 通过params传递
```
this.$router.replace({ 
    name: 'Page05', 
    params: { abc: 'hello', txt: 'world' }, 
    query: { name: 'query', type: 'object' }
})
```
通过name获取页面，传递params和query。
得到的URL为
```
http://localhost:8080/#/05/world?name=query&type=object
```
而获取到的参数为
```
{
    ...
    params: {
        abc: "hello",
        txt: "world"
    }
    ...
}
```
### 获取数据
**template**
```
<h2> {{ $route.params.txt }} </h2>
```
**script**
```
console.log(this.$route.params.txt)
```
## 2. query
query传递数据的方式就是URL常见的查询参数，如`/foo?user=1&name=2&age=3`。很好理解，下面就简单写一下用法以及结果
### 传递数据
**template**
```
<router-link :to="{ path: '/05', query: { name: 'query', type: 'object' }}" replace>05</router-link>
```
**script**
```
this.$router.replace({ path: '/05', query: { name: 'query', type: 'object' }})
```
**路径结果**
```
http://localhost:8080/#/05?name=query&type=object
```
**路由信息对象**
```
{
    ...
    query: {
        name: "query",
        type: "object"
    }
    ...
}
```
### 获取数据
获取数据和params是一样的。
**template**
```
<h2> {{ $route.query.name }} </h2>
```
**script**
```
console.log(this.$route.query.type)
```

# Vue.js学习系列
鉴于前端知识碎片化严重，我希望能够系统化的整理出一套关于Vue的学习系列博客。

[Vue.js学习系列一 —— vue-router2学习实践笔记（附DEMO）](http://www.jianshu.com/p/8013d8d37bd0)
[Vue.js学习系列二 —— vuex学习实践笔记（附DEMO）](http://www.jianshu.com/p/d6f7e11f18af)
[Vue.js学习系列三 —— axios和网络传输相关知识的学习实践](http://www.jianshu.com/p/8e5fb763c3d7)
[Vue.js学习系列四 —— Webpack打包工具的使用](http://www.jianshu.com/p/aef34acd111f)
[Vue.js学习系列五 —— 从VUE-CLI来聊聊ESLint](http://www.jianshu.com/p/efb6fbed6fac)
[Vue.js学习系列六 —— Vue单元测试Karma+Mocha学习笔记](http://www.jianshu.com/p/073d25a3bba0)
[Vue.js学习系列七 —— Vue服务器渲染Nuxt学习](https://www.jianshu.com/p/ba7466d7101a)
[Vue.js学习系列八 —— Vue源码学习之State学习](https://www.jianshu.com/p/15028f91226e)

# Vue.js学习系列项目地址
本文源码已收入到GitHub中，以供参考，当然能留下一个star更好啦^-^。
[https://github.com/violetjack/VueStudyDemos](https://github.com/violetjack/VueStudyDemos)

# 关于作者
VioletJack，高效学习前端工程师，喜欢研究提高效率的方法，也专注于Vue前端相关知识的学习、整理。
欢迎关注、点赞、评论留言~我将持续产出Vue相关优质内容。

新浪微博： http://weibo.com/u/2640909603
掘金：https://gold.xitu.io/user/571d953d39b0570068145cd1
CSDN: http://blog.csdn.net/violetjack0808
简书： http://www.jianshu.com/users/54ae4af3a98d/latest_articles
Github： https://github.com/violetjack