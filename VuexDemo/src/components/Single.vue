<template>
    <div>
      {{ count }}
      <button @click="increment">increment</button>
    </div>

</template>

<script>
export default {
  // state
  data () {
    return {
      count: 0
    }
  },
  // actions
  methods: {
    increment () {
      this.count++
    }
  }
}

</script>
