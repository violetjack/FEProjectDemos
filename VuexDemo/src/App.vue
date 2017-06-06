<template>
  <div id="app">
    <h2>这是由多个组件修改一个state的例子，可以看到所有组件的state一同变化，而且每个组件中都可以操作state的变化。</h2>
    <hr>
    <hello></hello>
    <!-- <single></single> -->
    <ma></ma>
    <mb></mb>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Single from './components/Single'
import ma from './components/A'
import mb from './components/B'

export default {
  name: 'app',
  components: {
    ma,
    mb,
    Hello,
    Single,
  }
}
</script>
