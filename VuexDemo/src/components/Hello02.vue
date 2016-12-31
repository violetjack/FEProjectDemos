<template>
  <div>
    以声明方式将state映射到视图：
    {{ $store.state.count }}
    <button @click="increment">add</button>
  </div>
</template>

<script>
  export default {
    //state 驱动应用的数据源
    data () {
      return {
        count: 0
      }
    },
    //actions 响应在view上的用户输入导致的状态变化
    methods: {
      increment () {
        this.$store.commit('increment')
        console.log(this.count);
      }
    },
  }
</script>
