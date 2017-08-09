<template>
  <div id="app">
    <h1>用router-link实现跳转</h1>
    <router-link to="/">跳转到Page01</router-link>
    <router-link to="/" replace>替换到Page01</router-link>
    <router-link to="/02/123">动态路由跳转到Page02</router-link>
    <router-link :to="{ name: 'Page02', params: { id: 111 }}">动态路由跳转到Page02</router-link>
    <router-link :to="{ name: 'com03', params: { sex: '123'}, query: { name: 'hello query' }}">带参数跳转到Page03</router-link>
    <router-link to="/04">跳转到嵌套路由示例Page04</router-link>
    <router-link :to="{ path: '/05/111', query: { name: 'query', type: 'object' }}" replace>带参数替换到Page05</router-link>
    <router-link to="/04">
      <button>按钮形式的router-link跳转到Page04</button>
    </router-link>
    <h1>用JS实现跳转</h1>
    <button v-on:click="go01">Page01</button>
    <button v-on:click="go02">Page02</button>
    <button v-on:click="go03">Page03</button>
    <button v-on:click="go04">Page04</button>
    <button v-on:click="go05">Page05</button>
    <button v-on:click="back">back</button>
    <h1>界面效果</h1>
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
        console.log(this.$route)
      },
    },
    methods: {
      go01: function () {
        this.$router.push({ path: '/' })
      },
      go02: function () {
        this.$router.push({ path: '/02/111' })
      },
      go03: function () {
        // 发现问题：path不能喝params一起使用，否则params将无效。
        this.$router.push({ name: 'com03', params: { sex: '7879' }, query: { name: 'jack', age: 15, sex: 'male' }})
      },
      go04: function () {
        this.$router.push({ path: '/04' })
      },
      go05: function () {
        this.$router.replace({ name: 'Page05', params: { abc: 'hello', txt: 'world' }, query: { name: 'query', type: 'object' }})
        // this.$router.push({ path: '/05/441'})
      },
      back: function (){
        //返回上个页面
        this.$router.go(-1)
      }
    },
  }

</script>
