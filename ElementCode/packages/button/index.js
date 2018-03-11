import ElButton from './src/button';

// 全局注册组件
ElButton.install = function(Vue) {
  Vue.component(ElButton.name, ElButton);
};

export default ElButton;
