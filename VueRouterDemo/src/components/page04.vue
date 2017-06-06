<template>
  <div class="hello">
    <h1>Page04</h1>
    <span>Page04研究了嵌套路由的用法。</span>
    <hr>
    <router-link to="/04/">01</router-link>
    <router-link to="/c02">02</router-link>
    <button v-on:click="back">back</button>
    <span style="color:red;">这里测试发现，this.$router.go(-1)方法的作用于不止是在Page04中，而是全局的。作用于浏览器的回退按钮一致。</span>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    back: function (){
      // 返回上个页面
      this.$router.go(-1)
    }
  }
}
</script>
