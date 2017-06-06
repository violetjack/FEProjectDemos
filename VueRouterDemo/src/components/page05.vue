<template>
  <div class="hello">
    <h1>page05</h1>
    <span>测试传入多个query参数</span>
    <h2> {{ $route.query.name }} </h2>
    <h2> {{ $route.query.type }} </h2>
  </div>
</template>

<script>
    export default {
      mounted: function(){
        console.log(this.$route)
      }
    }
</script>
