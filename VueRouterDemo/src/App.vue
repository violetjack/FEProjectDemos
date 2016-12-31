<template>
  <div id="app">
    <router-link to="/">01</router-link>
    <router-link to="/02/123">02</router-link>
    <router-link :to="{ path: '/03/333', params: { sex: 'hello'}, query: { name: 'hello query' }}">03</router-link>
    <router-link to="/04">04</router-link>
    <router-link to="/05" replace>05</router-link>
    <router-link :to="{ path: '/05', query: { name: 'query', type: 'object' }}" replace>05</router-link>
    <router-link to="/04">
      <button>to04</button>
    </router-link>
    <router-link :to="{ path: '/04', query: { plan: 'private' }}">query04</router-link>
    <button v-on:click="go01">01</button>
    <button v-on:click="go02">02</button>
    <button v-on:click="go03">03</button>
    <button v-on:click="go04">04</button>
    <button v-on:click="go05">05</button>
    <button v-on:click="back">back</button>
    <br/>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data(){
      return {
      }
    },
    watch: {
      //路由监听方法
      '$route' (to, from) {
        console.log(to);
        //console.log(from);
      },
    },
    methods: {
      go01: function () {
        this.$router.push({ path: '/' })
      },
      go02: function () {
        this.$router.push({ path: '/02' })
      },
      go03: function () {
        //this.$router.push({ path: '/03/441', params: { sex: '123' }, query: { name: 'jack', age: 15, sex: 'male' }})
        this.$router.push({ path: '/03/441'})
      },
      go04: function () {
        this.$router.push({ path: '/04' })
      },
      go05: function () {
        this.$router.replace({ path: '/05', query: { name: 'query', type: 'object' }})
      },
      back: function (){
        //返回上个页面
        this.$router.go(-1)
      }
    },
  }

</script>
