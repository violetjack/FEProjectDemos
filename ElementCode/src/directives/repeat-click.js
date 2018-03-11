import { once, on } from 'element-ui/src/utils/dom';
// on 添加监听事件
// once 监听一次事件

export default {
  bind(el, binding, vnode) {
    let interval = null;
    let startTime;
    // 执行表达式方法
    const handler = () => vnode.context[binding.expression].apply();
    // 清除interval
    const clear = () => {
      if (new Date() - startTime < 100) {
        handler();
      }
      clearInterval(interval);
      interval = null;
    };

    // 监听 mousedown 鼠标点击事件
    on(el, 'mousedown', (e) => {
      if (e.button !== 0) return;
      startTime = new Date();
      once(document, 'mouseup', clear);
      clearInterval(interval);
      // setInterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式。
      interval = setInterval(handler, 100);
    });
  }
};
