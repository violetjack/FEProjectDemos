> 早上好！继续学习Vue源码~这次我们来学习 event 事件。

# 源码简析
其实看了前两篇的同学已经知道源码怎么找了，这里再提一下。
先找到Vue核心源码index方法 `src/core/instance/index.js`
```
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
```
index方法中定义了一个Vue的构造函数执行 `_init` 方法初始化，然后执行了多个 `xxxMixin` 方法，这些方法是为Vue 的构造函数定义各类属性的。比如我们今天关注的事件，Vue的几个事件方法都是在 `eventsMixin` 中定义的。
```
export function eventsMixin (Vue: Class<Component>) {
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    ……
  }

  Vue.prototype.$once = function (event: string, fn: Function): Component {
    ……
  }

  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    ……
  }

  Vue.prototype.$emit = function (event: string): Component {
    ……
  }
}
```
另外要注意的是，`initMixin` 方法中定义了Vue的初始化方法 `_init`，该方法中对Vue各类属性进行了初始化。
```
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    if (options && options._isComponent) {
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }

    initProxy(vm)
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```
所以，在本篇博客中只需要关注 `initEvents` 和 `eventsMixin` 方法即可

# initEvents
初始化过程很简单，清空数据，并初始化连接父级的事件。
```
// src/core/instance/events.js
export function initEvents (vm: Component) {
  vm._events = Object.create(null)
  vm._hasHookEvent = false
  // init parent attached events
  const listeners = vm.$options._parentListeners
  if (listeners) {
    updateComponentListeners(vm, listeners)
  }
}
```
我深入看了下 `updateComponentListeners` 方法，最终走到了 `src/core/vdom/helpers/update-listeners.js` 的 `updateListeners` 方法中，因为并没有传 `oldOn` 参数，所以我简化了下代码，简化代码如下：
```
// src/core/vdom/helpers/update-listeners.js
export function updateListeners (
  on: Object,
  oldOn: Object,
  add: Function,
  remove: Function,
  vm: Component
) {
  let name, def, cur, old, event
  for (name in on) {
    def = cur = on[name]
    old = oldOn[name]
    event = normalizeEvent(name)

    if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur)
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params)
    }
  }
}
```
其中这个add方法如下：
```
// src/core/instance/events.js
// target 临时引用vm，用完后即变为undefined
var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}
```
整理下来就是将父级的事件定义到当前vm中。

# $on
> 监听当前实例上的自定义事件。事件可以由vm.$emit触发。回调函数会接收所有传入事件触发函数的额外参数。

代码如下
```
  // src/core/instance/events.js
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {
    const vm: Component = this
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$on(event[i], fn)
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn)
      // 通过使用标记为注册而不是散列查找的布尔标记来优化钩子 hook: 事件成本。
      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }
    return vm
  }
```
如果 event 是数组则遍历执行 $on 方法（2.2.0+ 中支持）；
否则 向 vm._events[event] 中传递回调函数 fn，这里既然 vm._events[event] 是一个数组，那么我猜想一个 event 可以执行多个回调函数咯？
如果是 event 字符串中有 `hook:`，修改 `vm._hasHookEvent` 的状态。如果 `_hasHookEvent` 为 true，那么在触发各类生命周期钩子的时候会触发如 `hook:created` 事件，这只是一种优化方式，与我们主题关系不大，具体请看代码~
```
// src/core/instance/lifecycle.js
export function callHook (vm: Component, hook: string) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm)
      } catch (e) {
        handleError(e, vm, `${hook} hook`)
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook)
  }
}
```

# $once
> 监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器。

代码
```
  // src/core/instance/events.js
  Vue.prototype.$once = function (event: string, fn: Function): Component {
    const vm: Component = this
    function on () {
      vm.$off(event, on)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)
    return vm
  }
```
这个就简单了，定义一个 $on 事件监听，回调函数中使用 $off 方法取消事件监听，并执行回调函数。

# $off
> 移除自定义事件监听器。
> * 如果没有提供参数，则移除所有的事件监听器；
> * 如果只提供了事件，则移除该事件所有的监听器；
> * 如果同时提供了事件与回调，则只移除这个回调的监听器。

代码如下，分析见注释。
```
  // src/core/instance/events.js
  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {
    const vm: Component = this
    // 如果没有参数，关闭全部事件监听器
    if (!arguments.length) {
      vm._events = Object.create(null)
      return vm
    }
    // 关闭数组中的事件监听器
    if (Array.isArray(event)) {
      for (let i = 0, l = event.length; i < l; i++) {
        this.$off(event[i], fn)
      }
      return vm
    }
    // 具体某个事件监听
    const cbs = vm._events[event]
    // 没有这个监听事件，直接返回vm
    if (!cbs) {
      return vm
    }
    // 没有 fn，将事件监听器变为null，返回vm
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    // 有回调函数
    if (fn) {
      // specific handler
      let cb
      let i = cbs.length
      while (i--) {
        // cbs = vm._events[event] 是一个数组
        cb = cbs[i]
        if (cb === fn || cb.fn === fn) {
          // 移除 fn 这个事件监听器
          cbs.splice(i, 1)
          break
        }
      }
    }
    return vm
  }
```

# $emit
> 触发当前实例上的事件。附加参数都会传给监听器回调。

代码
```
  // src/core/instance/events.js
  Vue.prototype.$emit = function (event: string): Component {
    const vm: Component = this
    let cbs = vm._events[event]
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs
      const args = toArray(arguments, 1)
      for (let i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args)
        } catch (e) {
          handleError(e, vm, `event handler for "${event}"`)
        }
      }
    }
    return vm
  }
```
代码分析：首先获取 vm._events[event] ，之前我们说过这玩意是个数组；如果有这个事件监听器，从第二个参数开始获取作为触发方法的传参 args，遍历事件监听器数组传参执行回调函数。

# 最后
就这么多啦~其实事件还是很简单的。明后天研究研究渲染这个难点！我们后天见！

# Vue.js学习系列
鉴于前端知识碎片化严重，我希望能够系统化的整理出一套关于Vue的学习系列博客。

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


