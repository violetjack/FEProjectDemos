<template>
  <div class="hello">
    <h1>page03</h1>
    <span>测试路由参数的传递</span>
    <h2> {{ $route.params.sex }} </h2>
    <h2> {{ $route.query.name }} </h2>
    <!--<span style="color:red;">问题：发现传递了动态路由、params和query。发现路由中params显示的是动态路由的结果。</span>-->
  </div>
</template>

<script>
    export default {
      mounted: function(){
        console.log(this.$route)
      }
    }
</script>
