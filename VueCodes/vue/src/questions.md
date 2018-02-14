# 问题汇总

* `VNode` 对象是什么对象，感觉像是组件。可参考 [Vue原理解析之Virtual Dom](https://segmentfault.com/a/1190000008291645),可以理解为 `vue` 框架的 `虚拟dom` 的基类，通过 `new` 实例化的 `VNode` 大致可以分为几类。目录在 `src/core/vdom/vnode.js`中。我暂时默认它为一个Vue对象吧。

* 在源码中经常看见 `type` 这个属性，在 `js` 里有 `type` 对象吗？？是不是 `vue` 自定义的呢？好像是typescript的定义一个类型，用来判断类型。

* `this.options` 这个东西在哪儿，全局 `API` 就靠它了。

* 学习以下JS中的apply和call方法

* 

