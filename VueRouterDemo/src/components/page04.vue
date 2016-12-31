<template>
  <div class="hello">
    <h1>page04</h1>
    <router-link to="/04/">01</router-link>
    <router-link to="/c02">02</router-link>
    <button v-on:click="back">back</button>
    <router-view></router-view>
  </div>
</template>

<script>
export default {

  methods: {
    back: function (){
      //返回上个页面
      this.$router.go(-1)
    }
  }
}
</script>
