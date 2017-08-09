// 传入Vue源代码
import Vue from './instance/index' 
// 初始化全局API的方法
import { initGlobalAPI } from './global-api/index'  
// 判断是否为服务器渲染
import { isServerRendering } from 'core/util/env'

initGlobalAPI(Vue)
// The Object.defineProperty() method defines a new property directly on an object, 
// or modifies an existing property on an object, and returns the object.
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})
// Vue的版本号
Vue.version = '__VERSION__'

export default Vue
