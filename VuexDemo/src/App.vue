<template>
  <div id="app">
    <hello></hello>
    <helloo></helloo>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Helloo from './components/Hello02'

export default {
  name: 'app',
  components: {
    Hello,
    Helloo
  },
  mounted () {
    console.log(this.$store.state.count)
  }
}
</script>
