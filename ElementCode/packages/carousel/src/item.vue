<template>
  <div
    v-show="ready"
    class="el-carousel__item"
    :class="{
      'is-active': active,
      'el-carousel__item--card': $parent.type === 'card',
      'is-in-stage': inStage,
      'is-hover': hover,
      'is-animating': animating
    }"
    @click="handleItemClick"
    :style="{
      msTransform: `translateX(${ translate }px) scale(${ scale })`,
      webkitTransform: `translateX(${ translate }px) scale(${ scale })`,
      transform: `translateX(${ translate }px) scale(${ scale })`
    }">
    <div
      v-if="$parent.type === 'card'"
      v-show="!active"
      class="el-carousel__mask">
    </div>
    <slot></slot>
  </div>
</template>

<script>
const CARD_SCALE = 0.83;
export default {
  name: "ElCarouselItem",

  props: {
    name: String,
    label: {
      type: [String, Number],
      default: ""
    }
  },

  data() {
    return {
      hover: false,
      translate: 0,
      scale: 1,
      active: false,
      ready: false,
      inStage: false,
      animating: false
    };
  },

  methods: {
    processIndex(index, activeIndex, length) {
      if (activeIndex === 0 && index === length - 1) {
        return -1;
      } else if (activeIndex === length - 1 && index === 0) {
        return length;
      } else if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
        return length + 1;
      } else if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
        return -2;
      }
      return index;
    },

    calculateTranslate(index, activeIndex, parentWidth) {
      if (this.inStage) {
        return parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1) / 4;
      } else if (index < activeIndex) {
        return -(1 + CARD_SCALE) * parentWidth / 4;
      } else {
        return (3 + CARD_SCALE) * parentWidth / 4;
      }
    },
    // index 当前 item 索引
    // activeIndex 激活的 item 索引
    // oldIndex 之前 item 索引
    translateItem(index, activeIndex, oldIndex) {
      // 获取父元素宽度 https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth
      const parentWidth = this.$parent.$el.offsetWidth;
      // 获取 item 页面数量
      const length = this.$parent.items.length;
      // 判断是否需要过渡动画 class
      // .el-carousel__item.is-animating {
      //  transition: transform 0.4s ease-in-out;
      // }
      if (this.$parent.type !== "card" && oldIndex !== undefined) {
        this.animating = index === activeIndex || index === oldIndex;
      }
      // 处理 index
      if (index !== activeIndex && length > 2) {
        index = this.processIndex(index, activeIndex, length);
      }
      if (this.$parent.type === "card") {
        // 卡片化
        this.inStage = Math.round(Math.abs(index - activeIndex)) <= 1; // 激活组件及其前后组件定义 cursor: pointer; z-index: 1;
        this.active = index === activeIndex; // 激活 class
        // 计算卡片化偏移量
        this.translate = this.calculateTranslate(
          index,
          activeIndex,
          parentWidth
        );
        // 激活卡片不缩放，其他卡片缩放为 0.83
        this.scale = this.active ? 1 : CARD_SCALE;
      } else {
        // 非卡片化
        this.active = index === activeIndex; // 激活 class
        this.translate = parentWidth * (index - activeIndex); // 计算位移 根据父组件宽度计算
      }
      // 计算完后显示
      this.ready = true;
    },

    handleItemClick() {
      const parent = this.$parent;
      if (parent && parent.type === "card") {
        const index = parent.items.indexOf(this);
        parent.setActiveItem(index);
      }
    }
  },

  created() {
    this.$parent && this.$parent.updateItems();
  },

  destroyed() {
    this.$parent && this.$parent.updateItems();
  }
};
</script>
