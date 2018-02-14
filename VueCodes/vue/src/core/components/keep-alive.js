/* @flow */

// 正则表单是判断
import { isRegExp } from 'shared/util'
// 传入VNode数组，返回一个VNode。返回VNode数组中的第一个VNode。
import { getFirstComponentChild } from 'core/vdom/helpers/index'

// VNode 缓存
type VNodeCache = { [key: string]: ?VNode };

// 模式类型
const patternTypes: Array<Function> = [String, RegExp, Array]

// 获取容器名称
function getComponentName (opts: ?VNodeComponentOptions): ?string {
  return opts && (opts.Ctor.options.name || opts.tag)
}

// 匹配，传入模式和名称，从pattren中匹配name
function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

// 清除vnode队列缓存，如果有一些在vnode的名称在过滤器中，则不清缓存。
function pruneCache (cache: VNodeCache, current: VNode, filter: Function) {
  for (const key in cache) {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) {
        if (cachedNode !== current) {
          pruneCacheEntry(cachedNode)
        }
        cache[key] = null
      }
    }
  }
}

// 清除vnode缓存
function pruneCacheEntry (vnode: ?VNode) {
  if (vnode) {
    vnode.componentInstance.$destroy()
  }
}

export default {
  name: 'keep-alive', // 名称
  abstract: true,     // 抽象
  // 传入的参数
  props: {
    include: patternTypes, // 包括的vnode
    exclude: patternTypes  // 不包括的vnode
  },

  created () {
    // 创建一个空对象
    this.cache = Object.create(null)
  },

  destroyed () {
    // 清除所有vnode缓存
    for (const key in this.cache) {
      pruneCacheEntry(this.cache[key])
    }
  },
  // 观察模式，两者不同之处在于matches匹配方法
  watch: {
    include (val: string | RegExp | Array<string>) {
      // 清理缓存
      pruneCache(this.cache, this._vnode, name => matches(val, name))
    },
    exclude (val: string | RegExp | Array<string>) {
      // 清理缓存
      pruneCache(this.cache, this._vnode, name => !matches(val, name))
    }
  },

  // 渲染方法
  render () {
    // this.$slots.default 属性包括了所有没有被包含在具名 slot （没有name属性的slot）中的节点。获取队列中最上面那个vnode
    const vnode: VNode = getFirstComponentChild(this.$slots.default)
    // 获取 componentOptions 属性
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      // 获取容器名称与include、exclude匹配，如果在include里面有或者在exclude里面没有，直接返回vnode。
      const name: ?string = getComponentName(componentOptions)
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }
      // 获取vnode的key
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      //如果有缓存，将缓存内容传给vnode。如果没有将当前vnode传入到缓存中
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance
      } else {
        this.cache[key] = vnode
      }
      // 最后设定 keepAlive 属性为true
      vnode.data.keepAlive = true
    }
    // 返回vnode，进行渲染。
    return vnode
  }
}
