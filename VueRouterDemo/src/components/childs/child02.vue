<template>
  <div>
    <h1>child02</h1>
    <button v-on:click="back">back</button>
    <router-link :to="{ name: 'child01' }">child</router-link>
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
