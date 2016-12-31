<template>
  <div>
    以声明方式将state映射到视图：
    {{ count }}
    {{ count1 }}
    {{ $store.getters.done }}
    <button @click="increment">increment</button>
    <button @click="add">add</button>
  </div>
</template>

<script>
  export default {
    //state 驱动应用的数据源
    data () {
      return {
        count: 0,
      }
    },
    //actions 响应在view上的用户输入导致的状态变化
    methods: {
      increment () {
        this.$store.commit('increment')
      },
      add () {
        this.$store.commit('add', 10)
      }
    },
    computed: {
      count1 () {
        return this.$store.state.count
      },
    }
  }
</script>
