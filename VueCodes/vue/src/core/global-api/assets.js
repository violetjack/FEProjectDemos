/* @flow */

import config from '../config'
import { ASSET_TYPES } from 'shared/constants'
import { warn, isPlainObject } from '../util/index'

// 初始化资源注册
export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   * 'component' 注册或获取全局组件。注册还会自动使用给定的id设置组件的名称
   * 'directive' 注册或获取全局指令，如v-model。https://cn.vuejs.org/v2/guide/custom-directive.html
   * 'filter'    注册或获取全局过滤器。
   */
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      if (!definition) {
        // 如果有definition，则为注册
        return this.options[type + 's'][id]
      } else {
        // 如果没有第二个参数，则为getter获取
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            )
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        // 定义的值都将传到 this.options 相应的数组中去
        return definition
      }
    }
  })
}
