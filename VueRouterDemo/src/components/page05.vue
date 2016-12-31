<template>
  <div class="hello">
    <h1>page05</h1>
    <h2> {{ $route.query.name }} </h2>
  </div>
</template>

<script>
    export default {
      mounted: function(){
        console.log(this.$route.query.type)
      }
    }
</script>
