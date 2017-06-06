<template>
  <div class="hello">
    <h1 class="hello-title">{{ msg }}</h1>
    <h2 class="hello-content">{{ content }}</h2>
  </div>
</template>

<script>
export default {
  name: 'hello',
  props: {
    content: String
  },
  data () {
    return {
      msg: 'Welcome!'
    }
  }
}
</script>
