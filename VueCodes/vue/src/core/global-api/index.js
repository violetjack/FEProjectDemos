/* @flow */
// 配置文件
import config from '../config'
// 4个功能
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
// 观察者？
import { set, del } from '../observer/index'
// 资源类型
import { ASSET_TYPES } from 'shared/constants'
// keep-alive 的index文件
import builtInComponents from '../components/index'

//导入工具文件
import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

// 传入GlobalAPI类型的对象
// 文档在此：https://cn.vuejs.org/v2/api/#全局-API
export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  // 将config的数据传给Vue对象的config属性
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  // 公开实效的方法。
  // 注意:这些都不是公共API的一部分，除非您意识到风险，否则不要依赖它们。
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  // 这用于标识“基础”构造函数，用于在Weex的多实例场景中扩展所有的纯对象组件。
  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)

  // 使用插件
  initUse(Vue)
  // 全局混合方法
  initMixin(Vue)
  // 集成组件属性
  initExtend(Vue)
  // 资源注册？
  initAssetRegisters(Vue)
}
