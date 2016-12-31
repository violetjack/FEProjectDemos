<template>
  <div class="hello">
    <h1>page03</h1>
    <h2> {{ $route.params.sex }} </h2>
    <h2> {{ $route.query.name }} </h2>
  </div>
</template>

<script>
    export default {
      mounted: function(){
        console.log(this.$route.params.sex)
      }
    }


</script>
