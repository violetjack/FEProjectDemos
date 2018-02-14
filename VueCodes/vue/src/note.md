# 学习笔记

## 关于$的意义

Vue中有很多用 `$` 符号来显示的属性，需要进行了解~这些属性都是通过设置 `Object.prototype` 来实现的。所以这个 `$` 符号没什么大不了的，就是一个字符串，只不过是在Vue中有比较特殊的意义而已。具体可以看[API](https://cn.vuejs.org/v2/api/#实例属性)来进行了解

## 源码中TypeScript的大量使用

在源代码中使用了大量的 `TypeScript` 类型检查，可能是为了严格数据类型减少不必要的错误吧。需要把 `TypeScript` 的[文档](https://www.tslang.cn/docs/handbook/basic-types.html)看一遍，否则看起来有些吃力。

## Vue 组件交互方式

![Vue 组件交互关键图](https://cn.vuejs.org/images/props-events.png)

### instanceof && typeof

`instanceof`判断类型，返回值为`true or false`，而`typeof`是获取类型，返回的是`string number`等类型字符串。

## 观察者笔记

`__ob__`是观察者，用来设置setter或getter，而`__proto__`为原型，具体作用有待讨论。这两个都可以在`console.log`中看到~

**由于 Vue 不允许动态添加根级响应式属性**，所以你必须在初始化实例前声明根级响应式属性，哪怕只是一个空值。

