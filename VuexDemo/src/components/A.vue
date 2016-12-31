<template>
  <div>
    {{ $store.state.count }}
    <button @click="increment">increment</button>
  </div>
</template>

<script>
  export default {
    methods: {
      increment () {
        this.$store.commit('increment')
      }
    },
    mounted () {
      console.log(this.$store.state.count)
      console.log(this.$store.getters.done)
    }
  }
</script>
