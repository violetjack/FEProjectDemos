export default {
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
  // 在store中定义getters（可以认为是store的计算属性）。Getters接收state作为其第一个函数
  getters: {
    done(state) {
      return state.count + 5;
    },
  }
}
