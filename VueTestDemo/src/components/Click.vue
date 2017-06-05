<template>
  <button @click="add">{{ num }}</button>
</template>

<script>
export default {
  name: 'Click',
  data () {
    return {
      num: 2
    }
  },
  methods: {
    add () {
      this.num += 2
    }
  }
}
</script>
