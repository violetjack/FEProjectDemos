> 春节继续写博客~加油！

这次来学习一下Vue的生命周期，看看生命周期是怎么回事。

# callHook
生命周期主要就是在源码某个时间点执行这个 `callHook` 方法来调用 `vm.$options` 的生命周期钩子方法（如果定义了生命周期钩子方法的话）。
我们来看看 callHook 代码：
```
export function callHook (vm: Component, hook: string) {
  const handlers = vm.$options[hook] // 获取Vue选项中的生命周期钩子函数
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm) // 执行生命周期函数
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
比如触发 `mounted` 钩子的方法：
```
callHook(vm, 'mounted')
```

# 生命周期钩子
先上一张图看下Vue的生命周期，我们可以在相应的生命周期中定义一些事件。
![Vue生命周期](http://upload-images.jianshu.io/upload_images/1987062-4e8074eee45c60a3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## beforeCreate & created
先看看这两个方法调用的时间。
> **beforeCreate**
在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。
**created**
在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。

具体代码如下
```
  // src/core/instance/init.js
  Vue.prototype._init = function (options?: Object) {
    ……
    initLifecycle(vm) // 初始化生命周期
    initEvents(vm) // 初始化事件
    initRender(vm) // 初始化渲染
    callHook(vm, 'beforeCreate')
    initInjections(vm) // 初始化Inject
    initState(vm) // 初始化数据
    initProvide(vm) // 初始化Provide
    callHook(vm, 'created')
    ……
    if (vm.$options.el) {
      vm.$mount(vm.$options.el) // 如果有el属性，将内容挂载到el中去。
    }
  }
```
## beforeMount & mounted
> **beforeMount**
在挂载开始之前被调用：相关的 render 函数首次被调用。该钩子在服务器端渲染期间不被调用。
**mounted**
el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内。

贴出代码逻辑
```
// src/core/instance/lifecycle.js
// 挂载组件的方法
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }
  
  vm._watcher = new Watcher(vm, updateComponent, noop)
  hydrating = false

  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```
那么这个 `mountComponent ` 在哪里用了呢？就是在Vue的 $mount 方法中使用。
```
// src/platforms/web/runtime/index.js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```
最后会在Vue初始化的时候，判断是否有 el，如果有则执行 $mount 方法。
```
// src/core/instance/init.js
if (vm.$options.el) {
  vm.$mount(vm.$options.el) // 如果有el属性，将内容挂载到el中去。
}
```
至此生命周期逻辑应该是 beforeCreate - created - beforeMount -mounted
## beforeUpdate & updated
> **beforeUpdate**
数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。
**updated**
由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

找代码逻辑~ beforeUpdate 和 updated 在两个地方调用。
```
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    // 如果是已经挂载的，就触发beforeUpdate方法。
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
    ……
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
```
在执行 `_update` 方法的时候，如果 DOM 已经挂载了，则调用 `beforeUpdate` 方法。
在 _update 方法的最后作者也注视了调用 updated hook 的位置：*`updated` 钩子由 `scheduler` 调用来确保子组件在一个父组件的 `update` 钩子中*。
我们找到 `scheduler`，发现有个 `callUpdateHooks` 方法，该方法遍历了 `watcher` 数组。
```
// src/core/observer/scheduler.js
function callUpdatedHooks (queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated')
    }
  }
}
```
这个 `callUpdatedHooks` 在 `flushSchedulerQueue` 方法中调用。
```
/**
 * 刷新队列并运行watcher
 */
function flushSchedulerQueue () {
  flushing = true
  let watcher, id
  queue.sort((a, b) => a.id - b.id)

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has[id] = null
    watcher.run()
  }

  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // 调用组件的updated和activated生命周期
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)
}
```
继续找下去
```
export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true // 此参数用于判断watcher的ID是否存在
    ……
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```
最终在 `watcher.js` 找到 `update` 方法：
```
  // src/core/observer/watcher.js
  update () {
    // lazy 懒加载
    // sync 组件数据双向改变
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this) // 排队watcher
    }
  }
```
等于是队列执行完 Watcher 数组的 `update` 方法后调用了 `updated` 钩子函数。
## beforeDestroy & destroyed
> **beforeDestroy**
实例销毁之前调用。在这一步，实例仍然完全可用。该钩子在服务器端渲染期间不被调用。
**destroyed**
Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用。

看代码~
```
  // src/core/instance/lifecycle.js
  // 销毁方法
  Vue.prototype.$destroy = function () {
    const vm: Component = this
    if (vm._isBeingDestroyed) {
      // 已经被销毁
      return
    }
    callHook(vm, 'beforeDestroy')
    vm._isBeingDestroyed = true
    // 销毁过程
    // remove self from parent
    const parent = vm.$parent
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm)
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown()
    }
    let i = vm._watchers.length
    while (i--) {
      vm._watchers[i].teardown()
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--
    }
    // call the last hook...
    vm._isDestroyed = true
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null)
    // 触发 destroyed 钩子
    callHook(vm, 'destroyed')
    // turn off all instance listeners.
    vm.$off()
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null
    }
  }
```
这是一个销毁 Vue 实例的过程，将各种配置清空和移除。
## activated & deactivated
> **activated**
keep-alive 组件激活时调用。
**deactivated**
keep-alive 组件停用时调用。

找到实现代码的地方
```
// src/core/instance/lifecycle.js
export function activateChildComponent (vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = false
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false
    for (let i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i])
    }
    callHook(vm, 'activated')
  }
}

export function deactivateChildComponent (vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = true
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true
    for (let i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i])
    }
    callHook(vm, 'deactivated')
  }
}
```
以上两个方法关键就是修改了 `vm._inactive` 的值，并且乡下遍历子组件，最后触发钩子方法。

## errorCaptured
> 当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。

这是 2.5 以上版本有的一个钩子，用于处理错误。
```
// src/core/util/error.js
export function handleError (err: Error, vm: any, info: string) {
  if (vm) {
    let cur = vm
    // 向上冒泡遍历
    while ((cur = cur.$parent)) {
      // 获取钩子函数
      const hooks = cur.$options.errorCaptured
      if (hooks) {
        for (let i = 0; i < hooks.length; i++) {
          try {
            // 执行 errorCaptured 钩子函数
            const capture = hooks[i].call(cur, err, vm, info) === false
            if (capture) return
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook')
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info)
}
```
代码很简单，看代码即可~

# 生命周期
除了生命周期钩子外，vue还提供了生命周期方法来直接调用。
## vm.$mount
> 如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以使用 vm.$mount() 手动地挂载一个未挂载的实例。
如果没有提供 elementOrSelector 参数，模板将被渲染为文档之外的的元素，并且你必须使用原生 DOM API 把它插入文档中。
这个方法返回实例自身，因而可以链式调用其它实例方法。

```
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  if (el === document.body || el === document.documentElement) {
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    // 获取template
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    // 编译template
    if (template) {
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }
  // 执行 $mount 方法
  return mount.call(this, el, hydrating)
}
```
其实很简单，先获取html代码，然后执行 `compileToFunctions` 方法执行编译过程（具体编译过程在学习Render的时候再说）。

## vm.$forceUpdate
> 迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

```
   Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };
```
这是强制更新方法，执行了 `vm._watcher.update()` 方法。

## vm.$nextTick
> 将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 Vue.nextTick 一样，不同的是回调的 this 自动绑定到调用它的实例上。

## vm.$destroy
> 完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。
触发 beforeDestroy 和 destroyed 的钩子。

关于$destroy 我们之前再说 destroyed 钩子的时候提到过了，这里就不再赘述。
```
  Vue.prototype.$destroy = function () {
    ……
  }
```

# 最后
首先说下过年博客计划，过年学习Vue各个模块的源码，并发布相应博客。另外还会发布一些前端知识的整理，便于下个月找工作~
然后，小结下自己看源码的一些小技巧：
* 重点关注方法的执行、对象的实例化、对象属性的修改。
* 忽略开发版本提示逻辑、内部变量赋值。
* 有目标的看代码，根据主线目标进行源码学习。 

OK，今天就这么多~ 明天去学习下Vue的事件源码！加油！明天见！

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


