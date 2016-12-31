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
        //this.$store.commit('increment')
        //this.$store.dispatch('incrementAsync')
        this.$store.dispatch('incrementAsyncWithValue', 5)
      }
    }
  }
</script>
