> 上次学习了vue-router的使用，让我能够在各个页面间切换，将页面搭建了起来。这次则要学习vue的状态管理模式——vuex。

**注**：本文只是个人对vuex学习的一些理解，要深刻掌握还需要认真查阅[官方文档](http://vuex.vuejs.org/zh-cn/)。

# 一、基本介绍
Vuex 是一个专为 Vue.js 的SPA单页组件化应用程序开发的**状态管理模式**插件。
由于Vue SPA应用的模块化，每个组件都有它各自的数据(state)、界面(view)、和方法(actions)。这些数据、界面和方法分布在各个组件中，当项目内容变得越来越多时，每个组件中的状态会变得很难管理。这是vuex就派上用场啦~下面我们看一个简单的vuex例子。
## 1. 单个组件中的状态
假如只是在单个组件中要改变界面view很简单，只需要改变state数据源即可。如下代码：
```
<template>
    <div>
      view: {{ count }}
      <button @click="increment">increment</button>
    </div>
</template>

<script>
export default {
  // state
  data () {
    return {
      count: 0
    }
  },
  // actions
  methods: {
    increment () {
      this.count++
    }
  }
}
</script>
```
所以，单个组件中的原理图是这样的：

![单个组件中的原理图](http://upload-images.jianshu.io/upload_images/1987062-29836e1cb7325526.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 2. 多个组件中的状态
然而，我们作为组件化的SPA应用，必定会牵扯到多个组件间的通信。
比如有两个相同的组件A和B，它们共享一个数据count，并且都有一个方法可以操作这个count，我们使用vuex来写。
**A组件和B组件的代码（代码相同）**
```
<template>
  <div>
    {{ $store.state.count }}
    <button @click="increment">increment</button>
  </div>
</template>

<script>
  export default {
    methods: {
      increment () {
        this.$store.commit('increment')
      }
    }
  }
</script>
```

![结果1](http://upload-images.jianshu.io/upload_images/1987062-5971ec429e2ac23b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![结果2](http://upload-images.jianshu.io/upload_images/1987062-22872b0aa75b7f42.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到，这里的两个increment按钮点击都会同时改变两个count的数据，**因为数据源count和方法increment都是全局的。**
正如下面官方原理图所画的，我们把**全局数据源state、改变数据源的方法mutations、异步操作方法actions**都放提取出来放到store中，实现全局数据状态单独管理的功能。
![vuex官方原理图](http://upload-images.jianshu.io/upload_images/1987062-9867083201b0c86e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 二、安装&配置
## 1. 安装vuex
使用npm安装并保存到package.json中：
```
npm install vuex --save
```
**package.json**
```
  "devDependencies": {
    ...
    "vuex": "^2.1.1",
    ...
  },
```
## 2. 配置
配置方式和路由的配置方式差不多
```
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
//创建Store实例
const store = new Vuex.Store({
  // 存储状态值
  state: {
    ...
  },
  // 状态值的改变方法,操作状态值
  // 提交mutations是更改Vuex状态的唯一方法
  mutations: {
    ...
  },
  // 在store中定义getters（可以认为是store的计算属性）。Getters接收state作为其第一个函数
  getters: {
    ...
  },
  actions: { 
    ...
  }
})
// 要改变状态值只能通过提交mutations来完成

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  // 将store实例注入到根组件下的所有子组件中
  store
  // 子组件通过this.$store来方位store
})

```
# 三、核心概念
## 1. state
state就是全局的状态（数据源），我们可以用以下方式在Vue 组件中获得Vuex的state状态
**template**
```
  <div>
    {{ $store.state.count }}
  </div>
```
**script**
```
console.log(this.$store.state.count)
```
## 2. getters
getters其实可以认为是 store 的计算属性，用法和计算属性差不多。
定义getter：
```
  getters: {
    done(state) {
      return state.count + 5;
    },
  }
```
使用getter
```
console.log(this.$store.getters.done)
```
## 3. mutations
mutations是操作state的唯一方法，即只有mutations方法能够改变state状态值。
### 3.1 基本操作
**mutations对state的操作**
```
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})
```
**组件通过commit提交mutations的方式来请求改变state**
```
this.$store.commit('increment')
```
这样的好处是我们可以跟踪到每一次state的变化，以便及时分析和解决问题。
### 3.2 提交载荷（Payload）
mutations方法中是可以传参的，具体用法如下：
```
  mutations: {
    // 提交载荷 Payload
    add(state, n) {
      state.count += n
    }
  },
```
```
this.$store.commit('add', 10)
```
这里只是传了一个数字，在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读。
### 3.3 注意
**mutations方法必须是同步方法！**
## 4. actions
### 4.1 基本操作
之前说mutations方法必须只能是同步方法，为了处理异步方法，actions出现了。关于action和mutations的区别有以下几点：
* Action 提交的是 mutation，而不是直接变更状态。
* Action 可以包含任意异步操作。
* Action 还是得通过 mutation 方法来修改state
同样是之前的increment方法,我们分别用同步和异步的action来验证上面所说的与mutations的不同之处：
```
  actions: {
    increment (context) {
      context.commit('increment')
    },
    incrementAsync (context) {
      // 延时1秒  
      setTimeout(() => {
        context.commit('increment')
      }, 1000)
    }
  },
```
不同于mutations使用commit方法，actions使用dispatch方法。
```
this.$store.dispatch('incrementAsync')
```

### 4.2 context
**context是与 store 实例具有相同方法和属性的对象。**可以通过`context.state`和`context.getters`来获取 state 和 getters。
### 4.3 以载荷形式分发
```
    incrementAsyncWithValue (context, value) {
      setTimeout(() => {
        context.commit('add', value)
      }, 1000)
    }
```
```
this.$store.dispatch('incrementAsyncWithValue', 5)
```
## 5. module
使用单一状态树，导致应用的所有状态集中到一个很大的对象。但是，当应用变得很大时，store 对象会变得臃肿不堪。
为了解决以上问题，Vuex 允许我们将 store 分割到**模块（module）**。每个模块拥有自己的 state、mutation、action、getters、甚至是嵌套子模块——从上至下进行类似的分割：
```
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```
module其实还是对于大型的SPA应用来说的，暂时对module的应用和理解并没有太多，之后会补上这一块儿的内容。
想要了解更多module知识，请查阅[官方module文档](http://vuex.vuejs.org/zh-cn/modules.html)

# Vue.js学习系列
鉴于前端知识碎片化严重，我希望能够系统化的整理出一套关于Vue的学习系列博客。

[Vue.js学习系列一 —— vue-router2学习实践笔记（附DEMO）](http://www.jianshu.com/p/8013d8d37bd0)

[Vue.js学习系列二 —— vuex学习实践笔记（附DEMO）](http://www.jianshu.com/p/d6f7e11f18af)

[Vue.js学习系列三 —— axios和网络传输相关知识的学习实践](http://www.jianshu.com/p/8e5fb763c3d7)

[Vue.js学习系列四 —— Webpack打包工具的使用](http://www.jianshu.com/p/aef34acd111f)

[Vue.js学习系列五 —— 从VUE-CLI来聊聊ESLint](http://www.jianshu.com/p/efb6fbed6fac)

[Vue.js学习系列六 —— Vue单元测试Karma+Mocha学习笔记](http://www.jianshu.com/p/073d25a3bba0)

[Vue.js学习系列七 —— Vue服务器渲染Nuxt学习](https://www.jianshu.com/p/ba7466d7101a)

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