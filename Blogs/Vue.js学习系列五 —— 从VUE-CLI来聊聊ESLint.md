> 最近在用vue-cli写项目的时候，经常和ESLint打交道，也算是不打不相识啦。下面总结一下在学习Vue的时候遇到的一些问题。

# ESLint简介
关于ESLint的介绍网上很多，这里就简单说些有用的。
ESLint的作用是检查代码错误和统一代码风格的。由于每个人写代码的习惯都会有所不同，所以统一代码风格在团队协作中尤为重要。

# vue-cli的eslint相关
vue-cli在init初始化时会询问是否需要添加ESLint，确认之后在创建的项目中就会出现`.eslintignore`和`.eslintrc.js`两个文件。
`.eslintignore`类似Git的`.gitignore`用来忽略一些文件不使用ESLint检查。
`.eslintrc.js`是ESLint配置文件，用来设置插件、自定义规则、解析器等配置。

**.eslintrc.js**
```
// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
```
**解析器(parser)：**使用了babel-eslint，这个可以在package.json中找到，说明我们已经安装过该解析器了。
**环境配置(env)：**在浏览器中使用eslint。
**继承(extends)：**该配置文件继承了[standard](https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style)规则，具体规则自己看文档，看不懂有[中文版](https://github.com/feross/standard/blob/master/docs/RULES-zhcn.md)的。
**规则(rules)：**对于三个自定义规则，我特地查了官方文档。
> 
* arrow-parems 允许箭头函数参数使用括号,具体操作请看[文档](http://eslint.org/docs/rules/arrow-parens)
* generator-star-spacing 允许方法之间加星号，如`function * generator() {}`。[文档](http://eslint.org/docs/rules/generator-star-spacing)在此。特地查了下，发现这是ES6提供的[生成器函数](https://imququ.com/post/generator-function-in-es6.html)，回头学习下。
* no-debugger' 允许在开发环境下使用debugger。这个比较简单，不过还是贴下[文档](http://eslint.org/docs/rules/no-debugger)便于查看。

**注意：**在`rules`中每个配置项后面第一个值是eslint规则的**错误等级**。
* "off" 或 0 - 关闭这条规则
* "warn" 或 1 - 违反规则会警告（不会影响项目运行）
* "error" 或 2 - 违反规则会报错（屏幕上一堆错误代码~）

# 遇到过的问题
由于一开始我不了解ESLint就写项目，不知道要看Standard的[文档](https://github.com/feross/standard/blob/master/docs/RULES-zhcn.md)，所以遇到了很多ESLint的错误和警告，分享下希望能对朋友们有帮助。

### 1. Do not use 'new' for side effects
该错误是由于我删除了`/* eslint-disable no-new*/`这段注释引发的，`/* eslint-disable */`这段注释的作用就是不让eslint检查注释下面的代码。
```
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

```
**错误原因：**不可以直接new一个新对象，需要将新对象赋值给一个变量。
```
var vm = new Vue()
```
### 2. Strings must use singlequote
**错误原因：**字符串必须用单引号
```
return {
      msg: "Welcome to Your Vue.js App", //双引号，报错！
    }
```
### 3. Expected space(s) after "return"
**错误原因：**括号两侧必须要有空格隔开
```
return{// 没有空格报错
  msg: 'Welcome to Your Vue.js App', 
}

startClock (){} //){中间没有空格，报错！
```
### 4. Expected indentation of 8 spaces but found 6 
**错误原因：**使用两个空格进行缩进。
```
      if (this.IntervalID === '') {
      this.IntervalID = setInterval(this.countDown, 1000)
      }
```
其实ESLint的报错并不难懂，只要理解错误原因还是很好解决的。如果提前看看文档，更不会出现太多报错问题了。这个故事告诉我们**看文档是很重要滴~%>_<%**
# Tips
**发现ESLint的报错都会在报错语句前面显示一个URL**，点击进去可以看到详细的错误信息哦。这是我刚在写博客的时候发现的。
```
  http://eslint.org/docs/rules/no-new  Do not use 'new' for side effects  
  E:\Github\EfficiencyTools\EfficiencyTool-VueMobile\src\main.js:15:1
  new Vue({
```
这里的 http://eslint.org/docs/rules/no-new 就是ESLint规则报错的原因，还是很人性化的。

# 编辑器
推荐使用VSCode来编辑代码。按照着[VSCode拓展插件推荐——提高Node和Vue开发效率](https://github.com/varHarrie/Dawn-Blossoms/issues/10)来安装和配置插件后，写vue项目方便了很多。

# 总结
其实vue-cli的ESLint不需要我们配置太多，基本的都配置好了，如果你愿意完全可以照着vue-cli提供的规则去写代码。当我们需要修改一些规则的时候添加到rules中替换原有规则就可以了。一开始用ESLint写代码很烦，经常由于一些格式问题调试报错，让回去改格式。不过慢慢的就会发现使用ESLint之后代码的确可读性、美观性上都好了很多。
推荐使用ESLint来规范代码编辑~

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