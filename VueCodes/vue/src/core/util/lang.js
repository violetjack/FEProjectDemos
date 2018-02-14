/* @flow */
// Object.freeze方法： 阻止修改现有属性的特性和值，并阻止添加新属性。 冻结一个空的对象
export const emptyObject = Object.freeze({})

/**
 * Check if a string starts with $ or _
 * 
 * 判断是否是以'$'或者'_'字符开头的字符串
 */
export function isReserved (str: string): boolean {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 * 
 * 为obj定义一个属性
 */
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

/**
 * Parse simple path.
 * 
 * 解析简单路径
 */
const bailRE = /[^\w.$]/
export function parsePath (path: string): any {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
