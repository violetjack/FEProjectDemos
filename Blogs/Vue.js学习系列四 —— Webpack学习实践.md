> 这两周一直想写webpack的知识点，却发现webpack其实要将webpack说的具体内容还是挺多的。而且稀土掘金上一搜webpack有好多人都有去写webpack的知识点，所以本文中不再去重复别人的东西了，就简单记录一下我对webpack的理解。并按照老规矩附上demo以及我收藏的几篇不错的webpack入门文章以供学习参考~

# 一、什么是webpack
## 1. webpack是什么？
webpack是一个模块打包工具。
**用vue项目来举例：**浏览器它是只认识js，不认识vue的。而我们写的代码后缀大多是.vue的，在每个.vue文件中都可能html、js、css甚至是图片资源；并且由于组件化，这些.vue文件之间还有错综复杂的关系。所以项目要被浏览器识别，我们就要使用webpack将它们打包成js文件以及相应的资源文件。
或者这么理解，我们以vue项目的形式编写项目逻辑，浏览器以他理解的方式来运行项目。webpack把我们的vue项目想表达的所有意图传递给浏览器让浏览器去运行。
*PS：webpack功能不止于此，但这个功能是让我们项目能跑起来的必要条件！（个人理解，如有错误，还请批评指正）*
## 2. 来个demo理解下
这里我们来理解下webpack是如何打包的~（转译会在loaders中提到）。首先我们写两个最简单的js
**hello.js**
```
console.log("hello~~")
```
**app.js**
```
console.log("hello app");
require("./hello.js")
```
`app.js`中导入了`hello.js`，它们之间有导入关系。我们假如直接将`app.js`放到html中是会报错的。
```
hello app
Uncaught ReferenceError: require is not defined at app.js:2
```
如果我们要维持这种关系我们就必须使用打包工具进行打包。在命令行中输入：
```
// 安装webpack
$ npm install webpack -g
// 打包app.js
$ webpack app.js bundle.js
```
然后我们会发现项目中多了一个bundle.js文件，我们在html中导入这个js文件。
**index.html**
```
<!DOCTYPE html>
<html>
  <head>
    <title>demo01</title>
  </head>
  <body>
    <h1>demo01</h1>
    <script src="bundle.js"></script>
  </body>
</html>
```
最后输出正确结果
```
hello app
hello~~
```
# 二、webpack.config.js
## 1. 定义
webpack.config.js文件是webpack的默认配置文件。之前我们使用命令行`$ webpack entry.js output.js`来实现打包，其实webpack可以有更多的打包配置，这些配置都是在webpack.config.js中完成的。下面是一个简单的webpack.config.js。
```
const webpack = require("webpack")

module.exports = {
  entry: {
    entry: "./app/entry.js",
  },
  output:
  {
    path: __dirname + "/dist",
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
    ]
  }
}
```
个人觉得这三个东西是最最重要的了，所以必须单独说说这三个配置。其他配置都可以去查阅资料慢慢来。
## 2. entry&output
entry是配置webpack的入口文件，上面的代码中我们将app目录下的entry.js作为入口文件。webpack会将与entry.js有关的资源都进行打包。
output是出口文件，即打包好的文件的存放地址和文件名。

这里有几种文件的输入输出情况。引用自[Webpack 2 入门教程](https://llp0574.github.io/2016/11/29/getting-started-with-webpack2/)。
### 2.1 单文件，单输出
```
const webpack = require("webpack");
module.exports = {
  context: __dirname + "/src",
  entry: {
    app: "./app.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
  },
};
```
### 2.2 多文件，单输出
```
const webpack = require("webpack");
module.exports = {
  context: __dirname + "/src",
  entry: {
    app: ["./home.js", "./events.js", "./vendor.js"],
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
  },
};
```
### 2.3 多文件，多输出
```
const webpack = require("webpack");
module.exports = {
  context: __dirname + "/src",
  entry: {
    home: "./home.js",
    events: "./events.js",
    contact: "./contact.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
  },
};
```
大家可以动手实践一下，很好理解。打包出来的单个或者多个文件直接可以在html中使用。
```
<script src="./dist/entry.js"></script>
```
## 3. loaders
loader是webpack的加载器，可以帮我们处理各种非js文件。如css样式，vue、jsx、weex等后缀的代码，JPG、PNG图片等。所以我们一般会在package.json中看到各种***-loader。这些就是各类资源的loader加载器。
在module的loaders数组中可以有多个对象，每个对象就是一个加载器。下面是babel-loader的最简单配置方式
```
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
      },
    ]
  }
```
对象中的test是正则表达式，用于搜索后缀为.js的文件。loader是所用加载器名称。
## 4. 使用babel来转译ES6代码
下面我们来一步步使用babel-loader将ES6语法用于项目中。
webpack打包的文件默认是不支持ES6的，我们需要用babel转译。
### 4.1 安装babel
这个配置其实我是抄的vue-cli，个人对babel用法还不是很熟。
在package.json中添加依赖。
```
  "devDependencies": {
    ...
    "babel-core": "^6.22.1",
    "babel-loader": "^6.2.10",
    "babel-plugin-transform-runtime": "^6.22.0",
    "babel-preset-es2015": "^6.0.0",
    "babel-preset-stage-2": "^6.0.0",
    "babel-register": "^6.0.0",
    "webpack": "^1.14.0"
    ...
  }
```
npm安装
```
$ npm install
```
### 4.2 在webpack.config.js中添加babel-loader的配置
```
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
      },
    ]
  }
```
### 4.3 添加.babelrc
在项目根目录下添加.babelrc文件，文件内容为
```
{
  "presets": ["es2015", "stage-2"],
  "plugins": ["transform-runtime"],
  "comments": false
}
```
### 4.4 使用ES6
```
import good from './good.js'
```
# 三、分析vue-cli
说了这么多，我的最终目的还是为了学习Vue.js。所以在对webpack有了一定的理解之后，就发现其实vue-cli并不是那么深不可测。
## 1. 结构分析

* build —— 项目构建文件夹
 * build.js —— 打包构建脚本（npm run build）
 * check-versions.js —— npm和node版本的查询
 * dev-client.js —— 
 * dev-server.js —— 开发调试脚本（npm run dev）
 * utils.js —— 工具类
 * webpack.base.config.js —— Webpack配置文件
 * webpack.dev.config.js —— 开发版本Webpack配置文件，与webpack.base.config.js合并成完整的配置文件。
 * webpack.prod.config.js —— 生产版本Webpack配置文件，与webpack.base.config.js合并成完整的配置文件。
* config —— 配置文件夹，保存有各种配置参数（文件路径、服务器端口、功能开关）
* src —— 代码文件夹
* static
 * .gitkeep —— 作用是将文件所在文件夹保留在git版本控制中。文件类型和.gitignore差不多。
* .babelrc —— babel配置文件
* .editorconfig —— 编辑配置，确保使用各种编辑器时能有相同的编辑格式。
* .gitignore —— git忽略文件
* index.html —— 页面，最终显示在这个html中
* package.json —— npm配置文件，包含了项目的信息、脚本、依赖库等重要信息。

## 2. 创建简易cli
理解完vue-cli的某些功能后，不难发现我们自己也可以搭建简易的vue-cli了。
官方的脚手架中除了有webpack打包，还包含了node脚本、开发和生产模式的切换、ESLint配置等功能。我们暂时不需要，将项目简化来更好的理解webpack。
### 2.1 package.json
让我们来自己建立一个cli，首先创建一个空文件夹。
```
$ mkdir demo05
$ cd demo05
```
初始化npm
```
$ npm init
```
然后复制vue-cli中的依赖库到package.json中（直接复制啦，具体依赖库的作用就不提啦~之后会写博客补上的）。
```
  "dependencies": {
    "vue": "^2.1.0"
  },
  "devDependencies": {
    "autoprefixer": "^6.4.0",
    "babel-core": "^6.0.0",
    "babel-loader": "^6.0.0",
    "babel-plugin-transform-runtime": "^6.0.0",
    "babel-preset-es2015": "^6.0.0",
    "babel-preset-stage-2": "^6.0.0",
    "babel-register": "^6.0.0",
    "chalk": "^1.1.3",
    "connect-history-api-fallback": "^1.1.0",
    "css-loader": "^0.25.0",
    "eventsource-polyfill": "^0.9.6",
    "express": "^4.13.3",
    "extract-text-webpack-plugin": "^1.0.1",
    "file-loader": "^0.9.0",
    "friendly-errors-webpack-plugin": "^1.1.2",
    "function-bind": "^1.0.2",
    "html-webpack-plugin": "^2.8.1",
    "http-proxy-middleware": "^0.17.2",
    "json-loader": "^0.5.4",
    "semver": "^5.3.0",
    "opn": "^4.0.2",
    "ora": "^0.3.0",
    "shelljs": "^0.7.4",
    "url-loader": "^0.5.7",
    "vue-loader": "^10.0.0",
    "vue-style-loader": "^1.0.0",
    "vue-template-compiler": "^2.1.0",
    "webpack": "^1.13.2",
    "webpack-dev-middleware": "^1.8.3",
    "webpack-hot-middleware": "^2.12.2",
    "webpack-merge": "^0.14.1"
  },
```
### 2.2 webpack.config.js
这里的webpack配置文件中的部分内容是从官方的 `webpack.base.config.js` 中复制出来的。正如我项目结构中所说的，vue-cli中的 `webpack.base.config.js` 是基础的配置文件。vue-cli中的 `webpack.dev.config.js` 和 `webpack.prod.config.js` 分别代表了开发和生产版本的webpack配置文件，他们与 `webpack.base.config.js` 合并成最后的webpack配置文件。这里我们只要找到 `webpack.base.config.js` 即可。
下面是完整配置代码。
```
var path = require("path")
var projectRoot = path.resolve(__dirname, '../')

module.exports = {
  // 入口文件
  entry: "./src/main.js",
  // 输出文件
  output: {
    filename: "./dist/bundle.js"
  },
  // 别名
  resolve: {
    extensions: ['', '.js', '.vue', '.json'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  module: {
    // 加载器
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
      }
    ]
  },
}
```
### 2.3 添加必要文件
由于使用git、babel，所以我将vue-cli中的 `.gitignore` 和 `.babelrc` 直接复制过来。
还有，由于懒得写逻辑代码，这里我将 `src` 文件夹中所有内容也直接复制过来。
复制按成后进行webpack打包。
```
$ webpack
```
打包完成就会出现一个在 `dist` 目录下有一个 `bundle.js` 文件。有了打包文件，我们还需要创建一个 `index.html` 来显示效果，这个之后再说。
所以，最后的项目结构如下图

![项目结构](http://upload-images.jianshu.io/upload_images/1987062-b65832334ec76374.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 2.4 index.html
现在，到了呈现效果的时候了。
```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Demo3</title>
  </head>
  <body>
    <div id="app">
    </div>
    <script src="./dist/bundle.js"></script>
  </body>
</html>
```
很简单，创建一个id为app的div元素用于显示Vue组件内容，然后将打包好的bundle.js引用进去。
现在，到项目目录中找到 `index.html` 页面，浏览器打开就可以看到效果啦~

![效果图](http://upload-images.jianshu.io/upload_images/1987062-9e3fd5985b12e67a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**注：**简易cli项目的源码在 VueStudyDemos\WebpackDemos\demo5中

# 四、相关资料推荐
这里推荐一下我学习webpack中发现的一些好的网站，分享一下。
https://github.com/webpack-china/awesome-webpack-cn
http://blog.guowenfh.com/2016/03/24/vue-webpack-01-base/

# 写在最后
拖了一个春节，终于把webpack的博客给写出来了。感觉在写完博客之后对webpack的理解深刻了许多，再次证明了“教是最好的学”这个理论。
新的一年，我要坚持好好写博客，享受分享带来的快乐。
之后计划学习一下eslint以及一些测试工具。然后试着用element和mint做两个小demo分享出来。然后了解一下node的相关知识。

# Vue.js学习系列
鉴于前端知识碎片化严重，我希望能够系统化的整理出一套关于Vue的学习系列博客。

[Vue.js学习系列一 —— vue-router2学习实践笔记（附DEMO）](http://www.jianshu.com/p/8013d8d37bd0)
[Vue.js学习系列二 —— vuex学习实践笔记（附DEMO）](http://www.jianshu.com/p/d6f7e11f18af)
[Vue.js学习系列三——axios和网络传输相关知识的学习实践](http://www.jianshu.com/p/8e5fb763c3d7)
[Vue.js学习系列四——Webpack打包工具的使用](http://www.jianshu.com/p/aef34acd111f)
[Vue.js学习系列五 —— 从VUE-CLI来聊聊ESLint](http://www.jianshu.com/p/efb6fbed6fac)
[Vue.js学习系列六——Vue单元测试Karma+Mocha学习笔记](http://www.jianshu.com/p/073d25a3bba0)
[Vue.js学习系列七——Vue服务器渲染Nuxt学习](https://www.jianshu.com/p/ba7466d7101a)

#Vue.js学习系列项目地址
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