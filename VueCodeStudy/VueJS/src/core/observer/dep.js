/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * 
 * dep是可观察到的，可以有多个指令订阅它。
 */
export default class Dep {
  // 属性
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  // 构造函数
  constructor () {
    this.id = uid++
    this.subs = []
  }

  // 添加sub
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  // 移除sub
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  // 依赖watcher
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  // 通知
  notify () {
    // 首先稳定用户列表
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
//
// 当前目标watcher被评估，这是全局特性因为就一个watcher会被随时评估。
Dep.target = null
const targetStack = []

export function pushTarget (_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}
