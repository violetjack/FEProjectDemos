> 今天我们来学习下Vue的渲染 Render 源码~

还是从初始化方法开始找代码，在 `src/core/instance/index.js` 中，先执行了 `renderMixin` 方法，然后在Vue实例化的时候执行了 `vm._init` 方法，在这个 `vm._init` 方法中执行了 `initRender` 方法。`renderMixin` 和 `initRender` 都在 `src/core/instance/render.js` 中，我们来看看代码：

# renderMixin
首先来跟一下 `renderMixin` 的代码：
```
export function renderMixin (Vue: Class<Component>) {
  installRenderHelpers(Vue.prototype)

  Vue.prototype.$nextTick = function (fn: Function) {
    return nextTick(fn, this)
  }

  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    // vm.$options.render & vm.$options._parentVnode
    const { render, _parentVnode } = vm.$options

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject
    }

    vm.$vnode = _parentVnode
    let vnode
    try {
      // 执行 vue 实例的 render 方法
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      if (process.env.NODE_ENV !== 'production') {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          } catch (e) {
            handleError(e, vm, `renderError`)
            vnode = vm._vnode
          }
        } else {
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    }
    // 返回空vnode避免render方法报错退出
    if (!(vnode instanceof VNode)) {
      vnode = createEmptyVNode()
    }
    // 父级Vnode
    vnode.parent = _parentVnode
    return vnode
  }
}
```
源码执行了 `installRenderHelpers ` 方法，然后定义了 Vue 的 `$nextTick` 和 `_render` 方法。
先来看看 `installRenderHelpers ` 方法：
```
export function installRenderHelpers (target: any) {
  target._o = markOnce
  target._n = toNumber // 数字
  target._s = toString // 字符串
  target._l = renderList // 列表
  target._t = renderSlot
  target._q = looseEqual
  target._i = looseIndexOf
  target._m = renderStatic
  target._f = resolveFilter
  target._k = checkKeyCodes
  target._b = bindObjectProps
  target._v = createTextVNode
  target._e = createEmptyVNode
  target._u = resolveScopedSlots
  target._g = bindObjectListeners
}
```
这就是 Vue 的各类渲染方法了，从字面意思中可以知道一些方法的用途，这些方法用在Vue生成的渲染函数中。具体各个渲染函数的实现先不提~之后会专门写博客学习。
在 `$nextTick` 函数中执行了 `nextTick` 函数，找到该函数源码：
```
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
现在来说关键的 `_render` 方法，关键在这个 try...catch 方法中，执行了Vue实例中的 render 方法生成一个vnode。如果生成失败，会试着生成 renderError 方法。如果vnode为空，则为vnode传一个空的VNode，最后返回vnode对象。

# initRender
接下来看下 render 的初始化过程：
```js
export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  // 将 createElement 方法绑定到这个实例，这样我们就可以在其中得到适当的 render context。
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // 规范化一直应用于公共版本，用于用户编写的 render 函数。
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
  // 父级组件数据
  const parentData = parentVnode && parentVnode.data
  // 监听事件
  defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
  defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
}
```
在 initRender 方法中，为Vue的实例方法添加了几个属性值，最后定义了 `$attrs` 和 `$listeners` 的监听方法。
看下 `createElement` 方法：
```
// src/core/vdom/create-element.js
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```
这里执行了 `_createElement` 方法，由于该方法太长，就不贴出来费篇幅了，代码看[这里](https://github.com/vuejs/vue/blob/dev/src/core/vdom/create-element.js#L47)。最终返回一个 VNode 对象，VNode 对象由 `createEmptyVNode` 或 `createComponent` 方法得到的。
`createEmptyVNode` 创建了一个空的 VNode
```
// src/core/vdom/vnode.js
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}
```
`createComponent` 创建了一个组件，最终也将返回一个 VNode 对象。
```
// src/core/vdom/create-component.js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }
  const baseCtor = context.$options._base
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }
  if (typeof Ctor !== 'function') {
    return
  }

  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context)
    if (Ctor === undefined) {
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {}
  resolveConstructorOptions(Ctor)
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  const listeners = data.on
  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) {
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  mergeHooks(data)
  // 创建组件的 VNode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  return vnode
}
```

# 初次渲染过程
既然是初次渲染，肯定会触发 `mounted` 生命周期钩子。所以我们从 `mount` 找起。在源码中定义了两次 `$mount` 方法，第一次返回了 `mountComponent` 方法；第二次定义了 Vue 实例的 `$options` 选项中的一些数据，然后再执行第一次的 `$mount` 方法，即执行 `mountComponent` 方法。
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
```
// src/platforms/web/entry-runtime-with-compiler.js
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
  return mount.call(this, el, hydrating)
}
```
这里需要注意的是 `compileToFunctions` 方法，该方法的作用是将 template 编译为 render 函数。
`compileToFunctions` 方法是一个编译的过程，暂且不论。抓住主线，看渲染。所以去看看 `mountComponent` 方法：
```
// src/core/instance/lifecycle.js
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

  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */)
  hydrating = false

  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```
可以看到，在 beforeMount 和 mounted 生命周期之间的代码：创建一个更新方法，然后创建一个Watcher监听该方法。
```
  let updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }

  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */)
```
在 `new Watcher` 监听了 updateComponent 方法后，会立即执行 `updateComponent` 方法。在 `updateComponent` 方法中，我们之前提到 _render 方法最终返回一个编译过的 VNode 对象，即虚拟 DOM，这里我们就看看 _update 方法。
```
  // src/core/instance/lifecycle.js
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const prevActiveInstance = activeInstance
    activeInstance = vm
    vm._vnode = vnode

    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      )
      vm.$options._parentElm = vm.$options._refElm = null
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    activeInstance = prevActiveInstance
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
  }
```
从注释可以看出，初次渲染会走到 `vm.__patch__` 方法中，这个方法就是比对虚拟 DOM ，局部更新 DOM 的方法，关于虚拟 DOM 和 VNode 节点，之后再聊。

# 小结一下
* 通过 `renderMixin` 方法来定义一些渲染属性。
* `initRender` 定义了各类渲染选项，并且对一些属性进行监听。
* `$mount` 方法执行了 `mountComponent` 方法，监听 
 `updateComponent` 方法并执行 `_update` 方法。
* `_update` 方法中执行 `__patch__` 方法渲染 VNode。

# 最后
这里简单理了理 `render` 渲染的代码流程，更深入的关于虚拟 DOM 的内容在下一篇中继续研究~
这里再提出几个问题，之后学习和解决：

* template 的具体编译细节
* 已知 data 数据监测，如何在改变数据后对改变界面的显示。
* 深入理解虚拟 DOM 的原理
* 学习全局 API 的源码
* 了解各类工具类
* 了解 AST 语法树是什么~

计划3月底完成Vue源码的系统学习，之后转战vue-router、vuex、vuxt、 devtools、webpack、vue-loader，今年目标把Vue全家老小、亲戚朋友都学习一遍！加油！

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
