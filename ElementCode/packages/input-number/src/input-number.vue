<template>
  <div
    @dragstart.prevent
    :class="[
      'el-input-number',
      inputNumberSize ? 'el-input-number--' + inputNumberSize : '',
      { 'is-disabled': inputNumberDisabled },
      { 'is-without-controls': !controls },
      { 'is-controls-right': controlsAtRight }
    ]">
    <!-- 减法 -->
    <span
      class="el-input-number__decrease"
      role="button"
      v-if="controls"
      v-repeat-click="decrease"
      :class="{'is-disabled': minDisabled}"
      @keydown.enter="decrease">
      <i :class="`el-icon-${controlsAtRight ? 'arrow-down' : 'minus'}`"></i>
    </span>
    <!-- 加法 -->
    <span
      class="el-input-number__increase"
      role="button"
      v-if="controls"
      v-repeat-click="increase"
      :class="{'is-disabled': maxDisabled}"
      @keydown.enter="increase">
      <i :class="`el-icon-${controlsAtRight ? 'arrow-up' : 'plus'}`"></i>
    </span>
    <!-- el-input 内容 -->
    <el-input
      ref="input"
      :value="currentValue"
      :disabled="inputNumberDisabled"
      :size="inputNumberSize"
      :max="max"
      :min="min"
      :name="name"
      :label="label"
      @keydown.up.native.prevent="increase"
      @keydown.down.native.prevent="decrease"
      @blur="handleBlur"
      @focus="handleFocus"
      @change="handleInputChange">
      <!-- 占位符模板 -->
      <template slot="prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </template>
      <template slot="append" v-if="$slots.append">
        <slot name="append"></slot>
      </template>
    </el-input>
  </div>
</template>
<script>
  import ElInput from 'element-ui/packages/input';
  import Focus from 'element-ui/src/mixins/focus';
  import RepeatClick from 'element-ui/src/directives/repeat-click';

  export default {
    name: 'ElInputNumber',
    // options 混合
    mixins: [Focus('input')],
    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },
    // 自定义指令
    directives: {
      repeatClick: RepeatClick
    },
    components: {
      ElInput
    },
    props: {
      // 计数器步长
      step: {
        type: Number,
        default: 1
      },
      // 设置计数器允许的最大值	
      max: {
        type: Number,
        default: Infinity
      },
      // 设置计数器允许的最小值
      min: {
        type: Number,
        default: -Infinity
      },
      // 绑定值
      value: {},
      // 是否禁用计数器
      disabled: Boolean,
      // 计数器尺寸 large, small
      size: String,
      // 是否使用控制按钮
      controls: {
        type: Boolean,
        default: true
      },
      // 控制按钮位置 right
      controlsPosition: {
        type: String,
        default: ''
      },
      // 原生 name 属性
      name: String,
      // 输入框关联的label文字
      label: String
    },
    data() {
      return {
        // 当前值
        currentValue: 0
      };
    },
    watch: {
      value: {
        // 立即执行 get()
        immediate: true,
        handler(value) {
          let newVal = value === undefined ? value : Number(value);
          if (newVal !== undefined && isNaN(newVal)) return;
          if (newVal >= this.max) newVal = this.max;
          if (newVal <= this.min) newVal = this.min;
          this.currentValue = newVal;
          // 触发 @input 事件
          this.$emit('input', newVal);
        }
      }
    },
    computed: {
      // 最小禁用，无法再减
      minDisabled() {
        return this._decrease(this.value, this.step) < this.min;
      },
      // 最大禁用，无法再加
      maxDisabled() {
        return this._increase(this.value, this.step) > this.max;
      },
      // 精度
      precision() {
        const { value, step, getPrecision } = this;
        return Math.max(getPrecision(value), getPrecision(step));
      },
      // 按钮是否要显示于右侧
      controlsAtRight() {
        return this.controlsPosition === 'right';
      },
      // FormItem尺寸
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      // 计算尺寸
      inputNumberSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      // 获取禁用状态
      inputNumberDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      }
    },
    methods: {
      // 计算精度
      toPrecision(num, precision) {
        if (precision === undefined) precision = this.precision;
        return parseFloat(parseFloat(Number(num).toFixed(precision)));
      },
      // 获取精度
      getPrecision(value) {
        if (value === undefined) return 0;
        const valueString = value.toString();
        const dotPosition = valueString.indexOf('.');
        let precision = 0;
        if (dotPosition !== -1) {
          precision = valueString.length - dotPosition - 1;
        }
        return precision;
      },
      // 获取加法后的精度
      _increase(val, step) {
        if (typeof val !== 'number' && val !== undefined) return this.currentValue;

        const precisionFactor = Math.pow(10, this.precision);
        // Solve the accuracy problem of JS decimal calculation by converting the value to integer.
        return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
      },
      // 获取减法后的精度
      _decrease(val, step) {
        if (typeof val !== 'number' && val !== undefined) return this.currentValue;

        const precisionFactor = Math.pow(10, this.precision);

        return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
      },
      // 加法行为
      increase() {
        if (this.inputNumberDisabled || this.maxDisabled) return;
        const value = this.value || 0;
        const newVal = this._increase(value, this.step);
        this.setCurrentValue(newVal);
      },
      // 减法行为
      decrease() {
        if (this.inputNumberDisabled || this.minDisabled) return;
        const value = this.value || 0;
        const newVal = this._decrease(value, this.step);
        this.setCurrentValue(newVal);
      },
      // 处理 blur 和 focus
      handleBlur(event) {
        this.$emit('blur', event);
        this.$refs.input.setCurrentValue(this.currentValue);
      },
      handleFocus(event) {
        this.$emit('focus', event);
      },
      // 设置当前value
      setCurrentValue(newVal) {
        const oldVal = this.currentValue;
        if (newVal >= this.max) newVal = this.max;
        if (newVal <= this.min) newVal = this.min;
        if (oldVal === newVal) {
          // 执行 el-input 中的 setCurrentValue 方法
          this.$refs.input.setCurrentValue(this.currentValue);
          return;
        }
        // 触发事件，改变value
        this.$emit('change', newVal, oldVal);
        this.$emit('input', newVal);
        this.currentValue = newVal;
      },
      // 处理文本框变化
      handleInputChange(value) {
        const newVal = value === '' ? undefined : Number(value);
        if (!isNaN(newVal) || value === '') {
          this.setCurrentValue(newVal);
        }
      }
    },
    mounted() {
      // 更改 el-input 内部 input 的属性。
      let innerInput = this.$refs.input.$refs.input;
      innerInput.setAttribute('role', 'spinbutton');
      innerInput.setAttribute('aria-valuemax', this.max);
      innerInput.setAttribute('aria-valuemin', this.min);
      innerInput.setAttribute('aria-valuenow', this.currentValue);
      innerInput.setAttribute('aria-disabled', this.inputNumberDisabled);
    },
    updated() {
      // 更改 el-input 内部 input 的属性。
      let innerInput = this.$refs.input.$refs.input;
      innerInput.setAttribute('aria-valuenow', this.currentValue);
    }
  };
</script>
