<template>
  <div>
    获取state：{{ $store.state.count }} {{ getState }}
    <br>
    获取getter:{{ $store.getters.done }} {{ getGetter }}
    <br>
    提交mutations increment：
    <button @click="increment">+1</button>
    <br>
    提交mutations add:
    <button @click="add(5)">+5</button>
  </div>
</template>

<script>
  export default {
    //actions 响应在view上的用户输入导致的状态变化
    methods: {
      increment () {
        // 逻辑为 state.count++
        this.$store.commit('increment')
      },
      add (num) {
        // 逻辑为 state.count += n
        this.$store.commit('add', num)
      }
    },
    computed: {
      // 代码获取state
      getState () {
        return this.$store.state.count
      },
      getGetter () {
        return this.$store.getters.done
      }
    }
  }
</script>
