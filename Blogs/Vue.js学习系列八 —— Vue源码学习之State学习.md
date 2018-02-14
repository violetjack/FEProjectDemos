> 关于Vue源码学习的博客， [HcySunYang](http://hcysun.me/)的[Vue2.1.7源码学习](http://hcysun.me/2017/03/03/Vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/)是我所见过讲的最清晰明了的博客了，非常适合想了解Vue源码的同学入手。本文是在看了这篇博客之后进一步的学习心得。
注意：本文所用Vue版本为 `2.5.13`

# 关于源码学习
关于学习源码，我有话要说~
一开始我学习Vue的源码，是将 [Vue.js](https://github.com/vuejs/vue/blob/dev/dist/vue.js) 这个文件下载下来逐行去看……因为我听信了我同事说的“不过一万多行代码，实现也很简单，可以直接看。”结果可想而知，花了十几个小时看完代码，还通过打断点看流程，除了学习到一些新的js语法、一些优雅的代码写法、和对整个代码熟悉了之外，没啥其他收获。
其实，这是一个丢西瓜捡芝麻的行为，没有明确的目的笼统的看源码，最终迷失在各种细枝末节上了。
所以呢，我看源码的经验教训有如下几点：
* 看代码，必须带着问题去找实现代码。
* 保持主线，不要纠结于细枝末节。永远记住你要解决什么问题。
* 找到一篇优质的博客、向前辈学习，让前辈带着你去学习事半功倍。
* 想看某编程语言的代码，必须要有扎实的语言基础。走路不稳就想跑，会摔得很惨~
* 学习之道，不能盲目。应该找到一种快速有效的方法，来有目的的实现学习目标。不要用战术上的勤奋来掩盖战略上的失误。看代码如此、看书学习亦如此~

# 如何开始
这里我们来解决从哪里开始看代码的流程，重点是**找到Vue构造函数的实现**。
首先，找到 `package.json` 文件，从中找到编译命令 `"dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev"`，这里 `rollup` 是类似于 Webpack 的打包工具，打包文件在 `script/config.js` 中，找到该文件。找 `entry` 入口关键字（不会rollup，但配置方式和 Webpack 差不太多）。入口文件有好多配置，我们就找到会生成 `dist/vue.js` 的配置项：
```
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
```
好，这里就找到了 `web/entry-runtime-with-compiler.js` 这个路径，完整路径应该是 `src/platform/web/entry-runtime-with-compiler.js`。在这个文件中我们找到一个Vue对象import进来了。
```
import Vue from './runtime/index'
```
我们顺着找到到 `src/platform/web/runtime/index.js` 这个文件，在文件中发现导入文件 
```
import Vue from 'core/index'
```
就顺着这个思路找，最终找到 `src/core/instance/index.js` 这个文件。
完整找到Vue实例入口文件的流程如下：
```
package.json
script/config.js
src/platform/web/entry-runtime-with-compiler.js
src/platform/web/runtime/index.js
src/core/index.js
src/core/instance/index.js
```
简单看看Vue构造函数的样子~
```
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue) // 初始化
stateMixin(Vue) // 状态混合
eventsMixin(Vue) // 事件混合
lifecycleMixin(Vue) // 生命周期混合
renderMixin(Vue) // 渲染混合

export default Vue
```
可以看到Vue的构造函数，里面只做了 `this._init(options)` 行为。这个 `_init` 方法在执行 `initMixin` 方法的时候定义了。找到同目录下的 `init.js` 文件。
```
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      // 合并配置项
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm) // 初始化代理
    } else {
      vm._renderProxy = vm
    }
    
    vm._self = vm // 暴露对象自身
    initLifecycle(vm) // 初始化生命周期
    initEvents(vm) // 初始化事件：on,once,off,emit
    initRender(vm) // 初始化渲染：涉及到Virtual DOM
    callHook(vm, 'beforeCreate') //  触发 beforeCreate 生命周期钩子
    initInjections(vm) // 在初始化 data/props 前初始化Injections
    initState(vm) // 初始化状态选项
    initProvide(vm) // 在初始化 data/props 后初始化Provide
    // 有关inject和provide请查阅 https://cn.vuejs.org/v2/api/#provide-inject
    callHook(vm, 'created') // 触发 created 生命周期钩子

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }
    // 如果Vue配置项中有el，直接挂在到DOM中
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```
抓住重点，**我们是要来学习State的。**从上面代码中可以找到initState方法的执行，这就是我们此行的目的——State数据选项。除此之外还有其他重要方法的初始化方式，这将会在之后的博客中继续讨论和学习。

# 学习State
之前是简单提一下学习源码的方法论和如何开始学习Vue源码学习。并且找到了我们要学习的State所在，现在进入正题：
> 了解Vue的数据选项的运行机制。

在[Vue2.1.7源码学习](http://hcysun.me/2017/03/03/Vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/)中，作者已经非常非常非常清晰明了的帮我们分析了data的实现。在此基础上开始好好学习其他数据选项的实现逻辑。

## 通过data理解mvvm
这里我通过自己的思路再来整理下项目中data的实现。
**注：**由于这一部分已经被各类源码解析博客讲烂了，而要把这部分讲清楚要大量篇幅。所以我就不贴代码了。还是那句话，抓重点！我们主要研究的是data之外的实现方式。关于data的实现和mvvm的逐步实现，[Vue2.1.7源码学习](http://hcysun.me/2017/03/03/Vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/)中讲的非常清晰明了。

**以下是我整理的思路，有兴趣的同学可以顺着我的思路去看看。**

在 state.js 中找到 initState，并顺利找到 initData 函数。initData中主要做了以下几步操作：
1. 获取data数据，data数据通常是一个方法，执行方法返回data数据。所以说我们要将data写成函数方法的形式。
2. 遍历data数据，判断是否有data与props的key同名，如果没有执行proxy方法，该方法用于将data中的数据同步到vm对象上，所以我们可以通过 `vm.name` 来修改和获取 data 中的 name 的值。
3. 执行observe方法，监听data的变化。

重点在 `observe` 方法，于是我们根据 import 关系找到 `src/core/observer/index.js` 文件。`observe` 方法通过传入的值最终返回一个Observer类的实例对象。
找到Observer类，在构造函数中为当前类创建Dep实例，然后判断数据，如果是数组，触发 observeArray 方法，遍历执行 observe 方法；如果是对象，触发walk方法。
找到walk方法，方法中遍历了数据对象，为对象每个属性执行 defineReactive 方法。
**找到 defineReactive 方法，该方法为 mvvm 数据变化检测的核心。**为对象属性添加 set 和 get 方法。重点来了， vue 在 get 方法中执行 `dep.depend()` 方法，在 set 方法中执行 `dep.notify()` 方法。这个先不多讲，最后进行联结说明。
找到同目录下的 `dep.js` 文件，文件不长。定义了 Dep 类和`pushTarget`、`popTarget` 方法。在 Dep 类中有我们之前提到的 `depend` 和 `notify` 方法。看下两个方法的实现：
```
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
```
在 `depend` 方法中，Dep.target 就是一个 Watcher 实例，它的 `addDep` 方法最终会调用到 Dep 的 `addSubs` 方法。subs 是 Watcher 数组。即将当前 watcher 存到 Dep 的 subs 数组中。
在 `notify` 方法中，将 Watcher 数组 subs 遍历，执行他们的 `update` 方法。`update` 最终会去执行 `watcher` 的回调函数。
即在 get 方法中将 watcher 添加到 dep，在 set 方法中通过 dep 对 watcher 进行回调函数触发。
这里其实已经实现了数据监听，接着我们来看看 Watcher，其实 Watcher 就是Vue中 watch 选项的实现了。说到 watch 选项我们都知道它用来监听数据变化。Watcher 就是实现这个过程的玩意啦~
Watcher的构造函数最终调用了 `get` 方法，代码如下：
```
 get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
```
`get` 方法做了如下几步：
1. 将当前 Watcher 实例传递给 Dep 的 Dep.target。
2. 执行 Watcher 所监测的数据的 `getter` 方法。
3. 最终，将 `Dep.target` 恢复到上一个值，并且将当前 Watcher 从 Dep 的 subs 中去除。

其中要注意的是，在第二步中数据的 `getter` 方法会执行到 `dep.depend()` 方法，`depend` 方法将当前 watcher 加入到 subs 中。至于步骤一和三还不太理解。挖个坑先~
这样 watcher 就监测上数据了。那怎么使用呢？当然是数据变化时使用咯。当监测的数据变化时，执行数据 setter 方法，然后执行 dep 的 `notify` 方法。由于我们之前已经将 watcher 都收集到 dep 的 subs 中，`notify` 方法遍历执行 watcher 的 `update` 方法，`update` 方法最终遍历执行回调函数。

1. 执行 `observe` 方法，创建 Observer 执行 `walk` 为对象数据添加setter 和 getter
2. 在添加 setter 和 getter 时，创建 Dep，在 getter 方法中执行 `dep.depend()` 收集 watcher，在 setter 方法中执行 `dep.notify()` 方法，最终遍历执行 watcher 数组的回调函数。
3. Dep 类似于 Watcher 和 Observer 的中间件。
4. Watcher 用于监听变化，并执行回调函数。
5. 当 Watcher 实例创建时，Watcher 实例会将自身传递给 Dep.target
6. Watcher 调用监测数据的 `getter`方法触发 `dep.depend()`
7. `dep.depend()`方法将当前 Watcher（Dep.target）传递给Dep的subs（watcher数组）中。
8. 当被监测的数据内容发生改变时，执行 `setter` 方法，触发 `dep.notify()` 方法，遍历 Dep 中的 subs（watcher数组），执行 Watcher 的回调函数。

嗯……就是这样~之后把挖的坑填上！

## watch实现

说完了 Data 的监听流程，说说 watch 应该就不难啦~
找到 `src/core/instance/state.js` 的 `initWatch` 函数，该方法用来遍历 Vue 实例中的 watch 项，最终所有 watch 都会执行 `createWatcher` 方法。
继续看 `createWatcher` 方法，这个方法也很简单，最终返回 `vm.$watch(keyOrFn, handler, options)`。我们继续往下找~
在 `stateMixin` 方法中找到了定义 Vue 的 $watch 方法属性。来看看怎么实现的：
```
  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      cb.call(vm, watcher.value)
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
```
如果回调函数 cb 是一个对象，那么返回并执行 `createWatcher` 函数，最终还是会走到 $watch 方法中。
否则，创建一个 Watcher 实例，当这个实例创建后，目标数据有任何变化 watch 选项中都能监听到了。如果是有 immediate 参数，那么立即执行一次Watcher的回调函数。最后返回一个解除监听的方法，执行了 Watcher 的 teardown 方法。
那么问题来了，为什么watch选项监听数据的方法中参数是如下写法呢？
```
watch: {
  a: function(val, oldVal){
    console.log(val)
  }
}
```
可以找到 `src/core/instance/observer/watcher.js` 中找到 `run` 方法。可以看到 `this.cb.call(this.vm, value, oldValue)` 这里的 cb 回调函数传递的参数就是 value 和 oldValue。
这里说个基础知识，函数使用[ call 方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)执行，第一个参数是方法的this值，之后才是真正的参数。
```
run () {
    if (this.active) {
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
```
**小结：watch 选项其实就是为指定数据创建 Watcher 实例，接收回调函数的过程。**

## props实现

接下来我们看看props，官网对props的定义如下：

> props 可以是数组或对象，用于接收来自父组件的数据。

找到 `initProps` 方法。
```
function initProps (vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  observerState.shouldConvert = isRoot
  for (const key in propsOptions) {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      defineReactive(props, key, value)
    }

    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  observerState.shouldConvert = true
}
```
可以看到，props 和 data 类似。在 `initProps` 中无非做了两步：`defineReactive` 和 `proxy`，这两个方法我们在提到 data 的时候讲过了。`defineReactive` 为数据设置 setter、getter，`proxy` 方法将 `props` 中的属性映射到 Vue 实例 vm 上，便于我们可以用 `vm.myProps` 来获取数据。
至此，我有个疑问：data与props有何不同呢？
data使用的是observe方法，创建一个Observer对象，Observer对象最终是执行了defineReactive方法。而props是遍历选项属性，执行defineReactive方法。中间可能就多了个Observer对象，那么这个Observer对象的作用到底在哪呢？经过实践props属性改变后界面也会改变。说明mvvm对props也是成立的。
另外，data和props有个不同的地方就是props是不建议改变的。详见[单向数据流](https://cn.vuejs.org/v2/guide/components.html#单向数据流)
小结：逻辑和data类似，都是监听数据。不同之处呢……再研究研究~

## computed实现

再来说说computed，找到初始化computed方法 `src/core/instance/state.js` 中的 `initComputed` 方法，去除非关键代码后看到其实主要有俩个行为，为 computed 属性创建 Watcher，然后执行 `defineComputed `方法。
```
function initComputed (vm: Component, computed: Object) {
  ...
  for (const key in computed) {
    ...
    if (!isSSR) {
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } 
    ...
  }
}
```
defineComputed 做了两步行为：一是定义 sharedPropertyDefinition 的 getter 和 setter，二是将 sharedPropertyDefinition 的属性传给vm，即 `Object.defineProperty(target, key, sharedPropertyDefinition)`。自此，我们可以通过 `vm.computedValue` 来获取计算属性结果了。
**小结：computed其实也就是一个数据监听行为，与data和props不同之处就是在get函数中需要进行逻辑计算处理。**

## methods实现

继续在 `state.js` 中看到 `initMethods` 方法。顾名思义，这是初始化methods的方法。实现很简单，代码如下：
```
function initMethods (vm: Component, methods: Object) {
  const props = vm.$options.props
  for (const key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (methods[key] == null) {
        warn(
          `Method "${key}" has an undefined value in the component definition. ` +
          `Did you reference the function correctly?`,
          vm
        )
      }
      if (props && hasOwn(props, key)) {
        warn(
          `Method "${key}" has already been defined as a prop.`,
          vm
        )
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          `Method "${key}" conflicts with an existing Vue instance method. ` +
          `Avoid defining component methods that start with _ or $.`
        )
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
  }
}
```
重点在最后一句。前面都排除重名和空值错误的，最后将 methods 中的方法传给 vm，方法内容如果为空则方法什么都不做。否则调用 `bind` 方法执行该函数。
找到这个 `bind` 方法，位置在 `src/shared/util.js` 中。
```
export function bind (fn: Function, ctx: Object): Function {
  function boundFn (a) {
    const l: number = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length
  return boundFn
}
```
该方法返回一个执行 `methods` 中函数的方法（这种方法的执行方式比较快）。
**小结：将methods的方法用bind函数优化执行过程。然后将methods中的各个方法传给Vue实例对象。**

# 最后

本文纯属个人理解，如有任何问题，请及时指出，不胜感激~
最后提出一个看源码的小心得：
> 我发现……看源码、跟流程，尽量将注意力集中在**方法的执行**和**类的实例化**行为上。对于变量的获取和赋值、测试环境警报提示，简略看下就行，避免逐行阅读代码拉低效率。

至此，Vue中的几个数据选项都学习了一遍了。关键在于理解mvvm的过程。data 理解之后，props、watch、computed 都好理解了。methods 和 mvvm 无关……
通过四个早上的时间把文章写出来了~对 Vue 的理解深刻了一些，但是还是能感觉到有很多未知的知识点等着我去发掘。加油吧！今年专注于 Vue 前端学习，把 Vue 给弄懂！


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


