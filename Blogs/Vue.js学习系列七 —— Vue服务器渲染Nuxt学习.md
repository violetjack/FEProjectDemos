> 我又回来啦~这次我们来学习Vue的服务器渲染SSR。

关于SSR的文章网上很多，一开始看得我云里雾里。然后去[Vue.js 服务器渲染指南](https://ssr.vuejs.org/zh/)和[nuxt官网](https://zh.nuxtjs.org/guide)看了看，发现文章大多都是搬运官网的内容，真正讲的清晰明了的很少。所以想写篇文章学习下SSR，希望能够帮助大家快速理解Vue SSR。

# 什么是SSR？
SSR，即服务器渲染，就是在服务器端将对Vue页面进行渲染生成html文件，将html页面传给浏览器。
优点：
* SEO 不同于SPA的HTML只有一个无实际内容的HTML和一个app.js，SSR生成的HTML是有内容的，这让搜索引擎能够索引到页面内容。
* 更快内容到达时间 传统的SPA应用是将bundle.js从服务器获取，然后在客户端解析并挂载到dom。而SSR直接将HTML字符串传递给浏览器。大大加快了首屏加载时间。

可以从下面两张图来看，第一张图是SSR生成的HTML页面，第二种是传统SPA生成的HTML页面。
![SSR](http://upload-images.jianshu.io/upload_images/1987062-744de5a6489440da.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![SPA](http://upload-images.jianshu.io/upload_images/1987062-1b940fb15ba7fbd7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# Nuxt.js
我看了官方 SSR 的介绍，也看了 Nuxt.js 的文档。本质上来说 SSR 是node后端的操作行为，作为只想好好写前端代码的我，不想太折腾。而 Nuxt.js 非常完美地整合了 SSR 的功能。让我们可以开箱即用~官方也推荐使用 Nuxt.js 来搭建 SSR 项目。

## 好处
我觉得  Nuxt.js  相比自己写 SSR 有几点好处。
* 无需配置Webpack：我一开始还在找Webpack配置呢，看了文档知道nuxt都帮我们封装好了。如需修改Webpack配置只需修改nuxt.config.js 文件。
* 无需node知识：只要你会写vue前端，你就可以写出SSR。无需知道SSR和node、express的配置方法（不过现在的前端多少都会点node知识~）。
* 整合了vue全家桶，直接可用。方便程度不亚于 `vue-cli`：安装Nuxt——写组件——编译并启动服务———看效果。就这么简单。
* 配置简单，文档友好：认真看下 Nuxt.js 文档就会发现涵盖的内容并不多，而功能很全，非常适合入手。

## 安装
安装方法[在此](https://zh.nuxtjs.org/guide/installation)。很简单，生成模板，然后npm安装依赖，最后再运行。
简单搬运下步骤吧。
```
// vue-cli 创建nuxt模板项目
$ vue init nuxt-community/starter-template <project-name>
// 安装依赖项
$ cd <project-name>
$ npm install
// 编译并启动服务
$ npm run dev
// 打开 http://localhost:3000
```
**安装遇到的问题：**
由于 Nuxt.js 中使用了 `async...await` 语法，而低版本的 node 不支持这个语法，所以必须升级 node 到 **7.0** 版本之上~
然后建议不要使用cnpm，我用cnpm安装运行老报错，感觉有坑。

## 目录结构
Nuxt.js 花了很大的篇幅讲它的目录结构，其实了解了目录结构就了解了 Nuxt.js 的大概。Nuxt.js 帮我们配置好了所有东西，我们只需要按照它的要求在相应目录下创建文件写代码即可。

* assets 需要编译的资源文件，如 JavaScript、SASS、LESS 等。
* static 不需要编译的静态资源文件，如图片资源。
* components 顾名思义，存放 `*.vue` 组件的地方。常规 vue 组件写法。
* layouts 布局目录，设置布局的地方，其中 `<nuxt/>` 标签是我们写的页面内容。可用作添加导航栏、底部栏等截面。
* middleware 中间件目录，所谓中间件，就是在页面与页面跳转中执行的函数方法。如页面跳转时验证用户信息操作。
* pages 页面目录。重点来了~这就是我们存放展示页面的地方。该目录下的文件会转换成相应的路由路径供浏览器访问。另外呢，该目录下的 `*.vue` 页面文件中  Nuxt.js 提供了一些特殊的方法用于处理服务器渲染中的事件。具体关于路由和特殊方法列举在下面了。
  * [pages 路由](https://zh.nuxtjs.org/guide/routing)
  * [页面组件](https://zh.nuxtjs.org/guide/views#页面)的简单介绍，具体特殊配置项的用法请查阅[API](https://zh.nuxtjs.org/api)。
* plugins 插件目录，像 mint-ui 这种第三方插件就放在这里啦~具体用法[看这里](https://zh.nuxtjs.org/guide/plugins)。
* store vuex 状态管理器目录，如果该目录是空的， Nuxt.js 将不启用 vuex。当我们在该文件夹下创建 index.js 文件后即可使用 vuex 状态管理器。用法[在此](https://zh.nuxtjs.org/guide/vuex-store)！
* nuxt.config.js 该文件是 Nuxt.js 的唯一配置项，之前提过 Nuxt.js 将 Webpack 等一众配置都封装好了，所以如果需要特殊配置，只需要修改该文件来覆盖默认配置即可。具体配置参数请查阅[API](https://zh.nuxtjs.org/api)。
* package.json 不解释……

# Demo演示
好消息，[VueStudyDemos](https://github.com/violetjack/VueStudyDemos)又更新啦！欢迎Star~[本文Demo](https://github.com/violetjack/VueStudyDemos/tree/master/NuxtDemo)已收入到VueStudyDemos中。
下面我们来简单实现下各文件夹所提到的功能。

## 资源加载
我在 assets 文件夹下添加了 font-awesome 字体库，在 static 文件夹中放了张 Vue 的 logo 图片。然后对资源进行调用。
```
<i class="fa fa-address-book" aria-hidden="true"></i>
<img src="~/static/logo.png" />
```
这里需要将 font-awesome 的 css 变为全局 css，避免每个用到的页面中都 import 字体库的css。所以我们在 nuxt.config.js 中添加如下配置。
```
module.exports = {
  ...
  css: [
    '~/assets/font-awesome/css/font-awesome.min.css'
  ],
  ...
}

```
## 组件定义
组件存放在 components 文件夹下，这个我们讲目录的时候提到过。组件的用法和常用 vue 组件用法一致。
定义组件 Avatar，然后在 Page 页面中使用。
```
<template>
  <avatar/>
</template>
<script>
import avatar from '~/components/Avatar'
export default {
    ...
    components: {
        avatar
    }
};
</script>
```
## 布局
在 layouts 目录中，default 是默认布局。我们可以修改默认布局也可以新建布局来使用。
在布局文件中 `</nuxt>` 标签是我们要服务器渲染的区域。
下面我们来创建个布局玩玩。
```
// layouts/page.vue
<template>
<div>
    <mt-header fixed title="标题2"></mt-header>
    <nuxt/>
</div>
</template>
```
然后我们来使用布局，在 pages 页面中配置 layout 选项（如果不配置默认就是 `default`）。
```
export default {
    ...
    layout: 'page'  // 默认是 'default'
};
```
## 中间件
所谓中间件，就是在两个页面跳转之间执行的行为。比如我定义一个中间件 add.js
```
export default function ({ store }) {
    store.commit('increment')
}
```
然后在 nuxt.config.js 中进行配置：
```
module.exports = {
  ...
  router: {
    middleware: 'add'
  },
  ...
}

```
这样，在每次页面跳转的时候都会执行一次中间件方法了。当然，也可以单独定义某个页面的中间件，具体看官网啦~

## 页面
页面，就是在pages目录下的 `*.vue` 文件，Nuxt.js 将目录结构配置为 vue-router 路由系统，所以我们可以直接通过文件名来访问到相应页面（先不提特殊路由）。
比如 `pages/app.vue` 文件就可以通过 `http://localhost:3000/app` 来进行访问。
注意：页面组件写法与常用 Vue 组件写法相同，但 Nuxt.js 还提供了一些特殊配置项来配置服务器渲染过程中的行为。具体有啥配置请看[页面文档](https://zh.nuxtjs.org/guide/views#页面)。

## 路由
路由就是使 pages 目录能够直接访问的原因。Nuxt.js 非常巧妙地使用目录结构和文件名称将 vue-router 的各种用法都涵盖进去了。如动态路由、嵌套路由等。具体可参考[文档](https://zh.nuxtjs.org/guide/routing)。也可以看看demo的 [pages](https://github.com/violetjack/VueStudyDemos/tree/master/NuxtDemo/pages) 目录。

## 插件
对于前端项目，插件的使用当然是必不可少的。官网上对这方面讲的很清楚。我贴一下 demo 中的用法。这里用的是 mint-ui 库。
```
// plugins/mint-ui.js
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)
```
```
// nuxt.config.js
module.exports = {
  build: {
    vendor: ['mint-ui']
  },
  plugins: [
    '~plugins/mint-ui'
  ]
}
```
这样就可以使用第三方库 mint-ui 啦！
```
<template>
  <div>
    <mt-navbar v-model="selected">
        <mt-tab-item id="1">选项一</mt-tab-item>
        <mt-tab-item id="2">选项二</mt-tab-item>
        <mt-tab-item id="3">选项三</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1">
            <mt-cell v-for="n in 10" :key="n" :title="'内容 ' + n" />
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
            <mt-cell v-for="n in 4" :key="n" :title="'测试 ' + n" />
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
            <mt-cell v-for="n in 6" :key="n" :title="'选项 ' + n" />
        </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
```
## vuex
对于 vuex，用法有两种：[普通方式](https://zh.nuxtjs.org/guide/vuex-store#普通方式)和[模块方式](https://zh.nuxtjs.org/guide/vuex-store#模块方式)，用法和我们常用的 vuex 一样。我的demo中是直接复制官网的代码。
需要注意的是，vuex 的数据会存在[context对象](https://zh.nuxtjs.org/api/#上下文对象)中，我们可以通过context对象获取状态数据。
# 发布
发布有两种方式服务器应用渲染部署和静态部署，发布方式[看这里](https://zh.nuxtjs.org/guide/commands#发布部署)

# 最后
去看 Nuxt.js 的 [API](https://zh.nuxtjs.org/api)，会发现 Nuxt.js 真的是高度封装。对于 Nuxt.js 生成的模板项目，只有一些必要配置是需要我们去完成的。Nuxt.js 可以说是一个非常友好而强大的 SSR 框架了。

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