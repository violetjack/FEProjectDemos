/* @flow */

import { toArray } from '../util/index'

// https://cn.vuejs.org/v2/api/#Vue-use-plugin
// 安装 Vue.js 插件。
// 如果插件是一个对象，必须提供 install 方法。
// 如果插件是一个函数，它会被作为 install 方法。
// install 方法将被作为 Vue 的参数调用。
//
// 当 install 方法被同一个插件多次调用，插件将只会被安装一次。
export function initUse (Vue: GlobalAPI) {
  // 传入的插件是方法或者对象
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
