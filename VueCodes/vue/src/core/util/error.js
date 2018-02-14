/* @flow */

import config from '../config'
import { warn } from './debug'
import { inBrowser } from './env'

// 处理错误~
export function handleError (err: Error, vm: any, info: string) {
  if (config.errorHandler) {
    // 如果有特殊配置，直接交给config的errorHandler处理了。
    config.errorHandler.call(null, err, vm, info)
  } else {
    // 不是生产版本，发出警报。
    if (process.env.NODE_ENV !== 'production') {
      warn(`Error in ${info}: "${err.toString()}"`, vm)
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      // 在浏览器中直接使用 console.error
      console.error(err)
    } else {
      throw err
    }
  }
}
