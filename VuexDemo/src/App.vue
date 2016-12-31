<template>
  <div id="app">
    <hello></hello>
    <helloo></helloo>
    <single></single>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Helloo from './components/Hello02'
import Single from './components/Single'

export default {
  name: 'app',
  components: {
    Hello,
    Helloo,
    Single
  },
  mounted () {
    console.log(this.$store.state.count)
  }
}
</script>
