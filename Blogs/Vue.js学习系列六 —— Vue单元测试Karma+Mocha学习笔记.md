> 在使用vue-cli创建项目的时候，会提示要不要安装单元测试和e2e测试。既然官方推荐我们使用这两个测试框架，那么我们就动手去学习实践一下他们吧。

# 简介
### Karma
**Karma**是一个基于Node.js的JavaScript测试执行过程管理工具（Test Runner）。该工具在Vue中的主要作用是将项目运行在各种主流Web浏览器进行测试。
换句话说，它是一个测试工具，能让你的代码在浏览器环境下测试。需要它的原因在于，你的代码可能是设计在浏览器端执行的，在node环境下测试可能有些bug暴露不出来；另外，浏览器有兼容问题，karma提供了手段让你的代码自动在多个浏览器（chrome，firefox，ie等）环境下运行。如果你的代码只会运行在node端，那么你不需要用karma。

### Mocha
**Mocha**是一个测试框架，在vue-cli中配合**chai断言库**实现单元测试。
Mocha的常用命令和用法不算太多，看阮一峰老师的[测试框架 Mocha 实例教程](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)就可以大致了解了。
而Chai断言库可以看[Chai.js断言库API中文文档](http://www.jianshu.com/p/f200a75a15d2)，很简单，多查多用就能很快掌握。

# 我对测试框架的理解
### npm run unit 执行过程 

1. 执行 `npm run unit` 命令
2. 开启Karma运行环境
3. 使用Mocha去逐个测试用Chai断言写的测试用例
4. 在终端显示测试结果
5. 如果测试成功，karma-coverage 会在 `./test/unit/coverage` 文件夹中生成测试覆盖率结果的网页。

### Karma
对于Karma，我只是了解了一下它的[配置选项](http://karma-runner.github.io/1.0/config/configuration-file.html)。
下面是Vue的karma配置，简单注释了下：
```
var webpackConfig = require('../../build/webpack.test.conf')

module.exports = function (config) {
  config.set({
    // 浏览器
    browsers: ['PhantomJS'],
    // 测试框架
    frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
    // 测试报告
    reporters: ['spec', 'coverage'],
    // 测试入口文件
    files: ['./index.js'],
    // 预处理器 karma-webpack
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    // Webpack配置
    webpack: webpackConfig,
    // Webpack中间件
    webpackMiddleware: {
      noInfo: true
    },
    // 测试覆盖率报告
    // https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    }
  })
}

```
### Mocha和chai
我们看下官方的例子（都用注释来解释代码意思了）：
```
import Vue from 'vue' // 导入Vue用于生成Vue实例
import Hello from '@/components/Hello' // 导入组件
// 测试脚本里面应该包括一个或多个describe块，称为测试套件（test suite）
describe('Hello.vue', () => {
  // 每个describe块应该包括一个或多个it块，称为测试用例（test case）
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Hello) // 获得Hello组件实例
    const vm = new Constructor().$mount() // 将组件挂在到DOM上
    //断言：DOM中class为hello的元素中的h1元素的文本内容为Welcome to Your Vue.js App
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js App')  
  })
})

```
**需要知道的知识点：**
* 测试脚本都要放在 `test/unit/specs/` 目录下。
* 脚本命名方式为  `[组件名].spec.js`。
* 所谓断言，就是对组件做一些操作，并预言产生的结果。如果测试结果与断言相同则测试通过。
* 单元测试默认测试 `src` 目录下除了 `main.js` 之外的所有文件，可在 `test/unit/index.js` 文件中修改。
* Chai断言库中，`to be been is that which and has have with at of same` 这些语言链是没有意义的，只是便于理解而已。
* 测试脚本由多个  `descibe` 组成，每个 `describe` 由多个 `it` 组成。
* 了解异步测试
```
it('异步请求应该返回一个对象', done => {
    request
    .get('https://api.github.com')
    .end(function(err, res){
      expect(res).to.be.an('object');
      done();
    });
});
```
* 了解一下 `describe` 的钩子（生命周期）
```
describe('hooks', function() {

  before(function() {
    // 在本区块的所有测试用例之前执行
  });

  after(function() {
    // 在本区块的所有测试用例之后执行
  });

  beforeEach(function() {
    // 在本区块的每个测试用例之前执行
  });

  afterEach(function() {
    // 在本区块的每个测试用例之后执行
  });

  // test cases
});
```

# 实践
上面简单介绍了单元测试的用法，下面来动手在Vue中进行单元测试！
### util.js
从Vue官方的demo可以看出，对于Vue的单元测试我们需要将组件实例化为一个Vue实例，有时还需要挂载到DOM上。
```
 const Constructor = Vue.extend(Hello) // 获得Hello组件实例
 const vm = new Constructor().$mount() // 将组件挂载到DOM上
```
以上写法只是简单的获取组件，有时候我们需要传递props属性、自定义方法等，还有可能我们需要用到第三方UI框架。所以以上写法非常麻烦。
这里推荐Element的[单元测试工具脚本Util.js](https://github.com/ElemeFE/element/blob/dev/test/unit/util.js)，它封装了Vue单元测试中常用的方法。下面demo也是根据该 `Util.js`来写的。
这里简单注释了下各方法的用途。
```
/**
 * 回收 vm，一般在每个测试脚本测试完成后执行回收vm。
 * @param  {Object} vm
 */
exports.destroyVM = function (vm) {}

/**
 * 创建一个 Vue 的实例对象
 * @param  {Object|String}  Compo     - 组件配置，可直接传 template
 * @param  {Boolean=false}  mounted   - 是否添加到 DOM 上
 * @return {Object} vm
 */
exports.createVue = function (Compo, mounted = false) {}

/**
 * 创建一个测试组件实例
 * @param  {Object}  Compo          - 组件对象
 * @param  {Object}  propsData      - props 数据
 * @param  {Boolean=false} mounted  - 是否添加到 DOM 上
 * @return {Object} vm
 */
exports.createTest = function (Compo, propsData = {}, mounted = false) {}

/**
 * 触发一个事件
 * 注： 一般在触发事件后使用 vm.$nextTick 方法确定事件触发完成。
 * mouseenter, mouseleave, mouseover, keyup, change, click 等
 * @param  {Element} elm      - 元素
 * @param  {String} name      - 事件名称
 * @param  {*} opts           - 配置项
 */
exports.triggerEvent = function (elm, name, ...opts) {}

/**
 * 触发 “mouseup” 和 “mousedown” 事件，既触发点击事件。
 * @param {Element} elm     - 元素
 * @param {*} opts          - 配置选项
 */
exports.triggerClick = function (elm, ...opts) {}
```
### 示例一
示例一中我们测试了 `Hello` 组件的各种元素的数据，学习  `util.js` 的 `destroyVM` 和 `createTest` 方法的用法以及如何获取目标元素进行测试。获取DOM元素的方式可查看[DOM 对象](http://www.runoob.com/jsref/dom-obj-document.html)教程。
**Hello.vue**
```
<template>
  <div class="hello">
    <h1 class="hello-title">{{ msg }}</h1>
    <h2 class="hello-content">{{ content }}</h2>
  </div>
</template>

<script>
export default {
  name: 'hello',
  props: {
    content: String
  },
  data () {
    return {
      msg: 'Welcome!'
    }
  }
}
</script>
```
**Hello.spec.js**
```
import { destroyVM, createTest } from '../util'
import Hello from '@/components/Hello'

describe('Hello.vue', () => {
  let vm

  afterEach(() => {
    destroyVM(vm)
  })

  it('测试获取元素内容', () => {
    vm = createTest(Hello, { content: 'Hello World' }, true)
    expect(vm.$el.querySelector('.hello h1').textContent).to.equal('Welcome!')
    expect(vm.$el.querySelector('.hello h2').textContent).to.have.be.equal('Hello World')
  })

  it('测试获取Vue对象中数据', () => {
    vm = createTest(Hello, { content: 'Hello World' }, true)
    expect(vm.msg).to.equal('Welcome!')
    // Chai的语言链是无意义的，可以随便写。如下：
    expect(vm.content).which.have.to.be.that.equal('Hello World') 
  })

  it('测试获取DOM中是否存在某个class', () => {
    vm = createTest(Hello, { content: 'Hello World' }, true)
    expect(vm.$el.classList.contains('hello')).to.be.true
    const title = vm.$el.querySelector('.hello h1')
    expect(title.classList.contains('hello-title')).to.be.true
    const content = vm.$el.querySelector('.hello-content')
    expect(content.classList.contains('hello-content')).to.be.true
  })
})
```
**输出结果**
```
Hello.vue
  √ 测试获取元素内容
  √ 测试获取Vue对象中数据
  √ 测试获取DOM中是否存在某个class
```
### 示例二
示例二中我们使用 `createTest` 创建测试组件测试点击事件，用 `createVue` 创建Vue示例对象测试组件 `Click` 的使用。这里主要可以看下到 `createVue` 方法的使用。
**Click.vue**
```
<template>
  <div>
    <span class="init-num">初始值为{{ InitNum }}</span><br>
    <span class="click-num">点击了{{ ClickNum }}次</span><br>
    <span class="result-num">最终结果为{{ ResultNum }}</span><br>
    <button @click="add">累加{{ AddNum }}</button>
  </div>
</template>

<script>
export default {
  name: 'Click',
  props: {
    AddNum: {
      type: Number,
      default: 1
    },
    InitNum: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      ClickNum: 0,
      ResultNum: 0
    }
  },
  mounted () {
    this.ResultNum = this.InitNum
  },
  methods: {
    add () {
      this.ResultNum += this.AddNum
      this.ClickNum++
      this.$emit('result', {
        ClickNum: this.ClickNum,
        ResultNum: this.ResultNum
      })
    }
  }
}
</script>

```
**Click.spec.js**
```
import { destroyVM, createTest, createVue } from '../util'
import Click from '@/components/Click'

describe('click.vue', () => {
  let vm

  afterEach(() => {
    destroyVM(vm)
  })

  it('测试按钮点击事件', () => {
    vm = createTest(Click, {
      AddNum: 10,
      InitNum: 11
    }, true)
    let buttonElm = vm.$el.querySelector('button')
    buttonElm.click()
    buttonElm.click()
    buttonElm.click()
    // setTimeout 的原因
    // 在数据改变之后，界面的变化会有一定延时。不用timeout有时候会发现界面没有变化
    setTimeout(done => {
      expect(vm.ResultNum).to.equal(41)
      expect(vm.$el.querySelector('.init-num').textContent).to.equal('初始值为11')
      expect(vm.$el.querySelector('.click-num').textContent).to.equal('点击了3次')
      expect(vm.$el.querySelector('.result-num').textContent).to.equal('最终结果为41')
      done()
    }, 100)
  })

  it('测试创建Vue对象', () => {
    let result
    vm = createVue({
      template: `
        <click @click="handleClick"></click>
      `,
      props: {
        AddNum: 10,
        InitNum: 11
      },
      methods: {
        handleClick (obj) {
          result = obj
        }
      },
      components: {
        Click
      }
    }, true)
    vm.$el.click()
    vm.$nextTick(done => {
      expect(result).to.be.exist
      expect(result.ClickNum).to.equal(1)
      expect(result.ResultNum).to.be.equal(21)
      done()
    })
})
```
**输出结果**
```
click.vue
  √ 测试按钮点击事件
  √ 测试创建Vue对象
```
### 其他
所有示例代码都放[Github仓库](https://github.com/violetjack/VueStudyDemos/tree/master/VueTestDemo)中便于查看。如果想查看更多好的测试用例，建议配合 `Util.js` 看一下 [Element 的单元测试脚本的写法](https://github.com/ElemeFE/element/tree/dev/test/unit)，里面有很多测试脚本可以供我们学习。作为被广大Vue用户使用的UI组件库，测试脚本肯定也写很很不错的~甚至可以将这些脚本照抄一遍，相信这会对学习Vue组件的单元测试有很大帮助。

下面是本人看Element单元测试的笔记，供参考。

* Util.js 方法包含了大多数Vue组件化的测试需求。
* `vm.$el` `vm.$nextTick` 和 `vm.$ref` 都是在测试过程中比较常用的一些Vue语法糖。
* 需要注意： vm.$nextTick 方法是异步的，所以需要在里面使用done方法。
* 异步断言，方法参数需要是 `_` 或者 `done`
* 大多数时候查询元素通过 `querySelector` 方法查询class获得
  * vm.$el.querySelector('.el-breadcrumb').innerText
* 大多数情况下查询是否存在某个Class通过 `classList.contains` 方法获得，查找的结果为 true 或 false
  * vm.$el .classList.contains('el-button--primary')
* 异步测试必须以 `done()` 方法结尾。`setTimeout` 和 `vm.$nextTick` 是常用的异步测试。
* 实现按钮点击：通过获取按钮元素 `btn`，执行 `btn.click()` 方法实现。
*  由于 Vue 进行 [异步更新DOM](http://cn.vuejs.org/v2/guide/reactivity.html#Async-Update-Queue) 的情况，一些依赖DOM更新结果的断言必须在 `Vue.nextTick` 回调中进行。
```
triggerEvent(vm.$refs.cascader.$el, 'mouseenter');
vm.$nextTick(_ => {
     vm.$refs.cascader.$el.querySelector('.el-cascader__clearIcon').click();
     vm.$nextTick(_ => {
        expect(vm.selectedOptions.length).to.be.equal(0);
        done();
     });
});
```

# 参考资料
* [单元测试](http://cn.vuejs.org/v2/guide/unit-testing.html)
* [Chai.js断言库API中文文档](http://www.jianshu.com/p/f200a75a15d2)
* [Element](https://github.com/ElemeFE/element/tree/dev/test/unit)
* [前端单元测试之Karma环境搭建](https://segmentfault.com/a/1190000006895064)
* [前端自动化测试是干嘛的？](https://segmentfault.com/q/1010000009527765)
* [测试框架 Mocha 实例教程](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)
* [Karma官网](http://karma-runner.github.io/1.0/index.html)


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