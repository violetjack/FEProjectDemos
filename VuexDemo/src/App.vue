<template>
  <div id="app">
    <!-- <hello></hello>
    <helloo></helloo>
    <single></single> -->
    <ma></ma>
    <mb></mb>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Helloo from './components/Hello02'
import Single from './components/Single'
import ma from './components/A'
import mb from './components/B'

export default {
  name: 'app',
  components: {
    ma,
    mb,
    Hello,
    Helloo,
    Single,
  },
  mounted () {
    //console.log(this.$store.state.count)
  }
}
</script>
