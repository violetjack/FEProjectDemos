/* @flow */

import { mergeOptions } from '../util/index'

// https://cn.vuejs.org/v2/api/#Vue-mixin-mixin
// 全局注册一个混合，影响注册之后所有创建的每个 Vue 实例。
// 插件作者可以使用混合，向组件注入自定义的行为。不推荐在应用代码中使用。
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    // 合并两个options对象
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
