export default {
  name: 'ElCol',

  props: {
    span: { // 栅格占据的列数
      type: Number,
      default: 24
    },
    tag: { // 自定义元素标签
      type: String,
      default: 'div'
    },
    offset: Number, // 栅格左侧的间隔格数
    pull: Number, // 栅格向左移动格数
    push: Number, // 栅格向右移动格数
    xs: [Number, Object], // <768px 响应式栅格数或者栅格属性对象
    sm: [Number, Object], // ≥768px 响应式栅格数或者栅格属性对象
    md: [Number, Object], // ≥992px 响应式栅格数或者栅格属性对象
    lg: [Number, Object], // ≥1200px 响应式栅格数或者栅格属性对象
    xl: [Number, Object] // ≥1920px 响应式栅格数或者栅格属性对象
  },

  computed: {
    gutter() {
      let parent = this.$parent;
      while (parent && parent.$options.componentName !== 'ElRow') {
        parent = parent.$parent;
      }
      return parent ? parent.gutter : 0;
    }
  },
  render(h) {
    let classList = [];
    let style = {};

    if (this.gutter) {
      style.paddingLeft = this.gutter / 2 + 'px';
      style.paddingRight = style.paddingLeft;
    }

    ['span', 'offset', 'pull', 'push'].forEach(prop => {
      if (this[prop] || this[prop] === 0) {
        classList.push(
          prop !== 'span'
            ? `el-col-${prop}-${this[prop]}`
            : `el-col-${this[prop]}`
        );
      }
    });

    ['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
      if (typeof this[size] === 'number') {
        classList.push(`el-col-${size}-${this[size]}`);
      } else if (typeof this[size] === 'object') {
        let props = this[size];
        Object.keys(props).forEach(prop => {
          classList.push(
            prop !== 'span'
              ? `el-col-${size}-${prop}-${props[prop]}`
              : `el-col-${size}-${props[prop]}`
          );
        });
      }
    });

    // 看看 render 函数源码
    return h(this.tag, {
      class: ['el-col', classList],
      style
    }, this.$slots.default);
  }
};
