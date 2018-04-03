import Vue from 'vue';
import Main from './main.vue';
import { PopupManager } from 'element-ui/src/utils/popup';
import { isVNode } from 'element-ui/src/utils/vdom';
const NotificationConstructor = Vue.extend(Main);

let instance;
let instances = [];
let seed = 1;

const Notification = function(options) {
  // 服务器渲染
  if (Vue.prototype.$isServer) return;
  options = options || {};
  const userOnClose = options.onClose; // 自定义关闭
  const id = 'notification_' + seed++; // 组件 id
  const position = options.position || 'top-right'; // 位置
  // 关闭事件
  options.onClose = function() {
    Notification.close(id, userOnClose);
  };
  // 组件实例
  instance = new NotificationConstructor({
    data: options
  });
  // vnode
  if (isVNode(options.message)) {
    instance.$slots.default = [options.message];
    options.message = 'REPLACED_BY_VNODE';
  }
  instance.id = id;
  instance.vm = instance.$mount();
  // 添加实例
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instance.dom = instance.vm.$el;
  instance.dom.style.zIndex = PopupManager.nextZIndex();
  // 偏移量计算
  let verticalOffset = options.offset || 0;
  instances.filter(item => item.position === position).forEach(item => {
    verticalOffset += item.$el.offsetHeight + 16;
  });
  verticalOffset += 16;
  instance.verticalOffset = verticalOffset;
  // 传入数组
  instances.push(instance);
  return instance.vm;
};

['success', 'warning', 'info', 'error'].forEach(type => {
  Notification[type] = options => {
    if (typeof options === 'string' || isVNode(options)) {
      options = {
        message: options
      };
    }
    options.type = type;
    return Notification(options);
  };
});

Notification.close = function(id, userOnClose) {
  let index = -1;
  const len = instances.length;
  const instance = instances.filter((instance, i) => {
    if (instance.id === id) {
      index = i;
      return true;
    }
    return false;
  })[0];
  if (!instance) return;

  if (typeof userOnClose === 'function') {
    userOnClose(instance);
  }
  instances.splice(index, 1);

  if (len <= 1) return;
  const position = instance.position;
  const removedHeight = instance.dom.offsetHeight;
  for (let i = index; i < len - 1 ; i++) {
    if (instances[i].position === position) {
      instances[i].dom.style[instance.verticalProperty] =
        parseInt(instances[i].dom.style[instance.verticalProperty], 10) - removedHeight - 16 + 'px';
    }
  }
};

Notification.closeAll = function() {
  for (let i = instances.length - 1; i >= 0; i--) {
    instances[i].close();
  }
};

export default Notification;
