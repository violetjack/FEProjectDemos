/* @flow */

// 是否为定义
import { isDef } from 'shared/util'

// 传入VNode数组，返回一个VNode。返回VNode数组中的第一个VNode。
export function getFirstComponentChild (children: ?Array<VNode>): ?VNode {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i]
      if (isDef(c) && isDef(c.componentOptions)) {
        return c
      }
    }
  }
}
