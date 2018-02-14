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

initMixin(Vue)      // 初始化
stateMixin(Vue)     // 状态
eventsMixin(Vue)    // 事件
lifecycleMixin(Vue) // 生命周期
renderMixin(Vue)    // 渲染方法

export default Vue
