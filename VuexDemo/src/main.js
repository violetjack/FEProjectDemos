// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import stores from './stores.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 存储状态值
  state: {
    count: 0
  },
  // 状态值的改变方法,操作状态值
  // 提交mutations是更改Vuex状态的唯一方法
  mutations: {
    increment(state) {
      state.count++
    },
    // 提交载荷 Payload
    add(state, n) {
      state.count += n
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    },
    incrementAsync (context) {
      setTimeout(() => {
        context.commit('increment')
      }, 1000)
    },
    incrementAsyncWithValue (context, value) {
      setTimeout(() => {
        context.commit('add', value)
      }, 1000)
    }
  },
  // 在store中定义getters（可以认为是store的计算属性）。Getters接收state作为其第一个函数
  getters: {
    done(state) {
      return state.count + 5;
    },
  }
})
// 要改变状态值只能通过提交mutations来完成
store.commit('increment')

console.log(store.state.count) // -> 1

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  // 将store实例注入到根组件下的所有子组件中
  store
  // 子组件通过this.$store来方位store
})
