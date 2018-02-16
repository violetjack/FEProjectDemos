# 生命周期

其实生命周期很简单，主要是 `callHook` 方法，执行 `$options` 中的钩子方法。
初始化过程就是：初始化数据；获取 `parent` 对象。

xxxxMinix是给 vm 对象混合一些功能的方法。`lifecycleMixin` 中初始化了 `$forceUpdate` 和  `$destroy`。

关于生命周期有如下关键词:

* vm.$mount
* vm.$forceUpdate
* vm.$nextTick
* vm.$destroy
* beforeCreate
* created
* beforeMount
* mounted
* beforeUpdate
* updated
* activated
* deactivated
* beforeDestroy
* destroyed
* errorCaptured

简介个生命周期用法，然后讲讲初始化过程。然后解析各生命周期用的地方。