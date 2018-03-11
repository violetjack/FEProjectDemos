<template>
  <button
    class="el-button"
    @click="handleClick"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': disabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
  export default {
    name: 'ElButton',
    // 获取父级组件 provide 传递下来的数据。
    inject: {
      elFormItem: {
        default: ''
      }
    },

    // 属性 http://element-cn.eleme.io/#/zh-CN/component/button
    props: {
      // 类型 primary / success / warning / danger / info / text
      type: {
        type: String,
        default: 'default'
      },
      // 尺寸 medium / small / mini
      size: String,
      // 图标类名
      icon: {
        type: String,
        default: ''
      },
      // 原生type属性 button / submit / reset
      nativeType: {
        type: String,
        default: 'button'
      },
      // 是否加载中状态
      loading: Boolean,
      // 是否禁用状态
      disabled: Boolean,
      // 是否朴素按钮
      plain: Boolean,
      // 是否默认聚焦
      autofocus: Boolean,
      // 是否圆形按钮
      round: Boolean
    },

    computed: {
      // elFormItem 尺寸获取
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      // 按钮尺寸计算
      buttonSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      }
    },

    methods: {
      // 点击事件，使得组件的点击事件为 @click，与原生点击保持一致。
      handleClick(evt) {
        this.$emit('click', evt);
      }
    }
  };
</script>
