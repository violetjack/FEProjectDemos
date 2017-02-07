<template>
  <div>
    <div class="title container">
      <el-menu :default-active="index" class="nav el-menu-demo" mode="horizontal" @select="handleSelect">
        <img src="../assets/img_logo.png" class="logo" :click.native="init"/>
        <el-menu-item index="/notify">订阅公众号通知</el-menu-item>
        <el-menu-item index="/start">新手入门</el-menu-item>
        <el-menu-item index="/">模板源码</el-menu-item>
        <el-menu-item index="/engine">数据引擎</el-menu-item>
        <el-menu-item index="/resource">资源中心</el-menu-item>
        <el-menu-item index="/courses">付费课程</el-menu-item>
        <el-menu-item index="/signin">登录</el-menu-item>
      </el-menu>
    </div>
    <router-view></router-view>
    <div class="container foot">
      <el-row>
        <el-col :span="24" class="foot-col">联系我们 <span style="float: right;">沪ICP备14046093号-4</span></el-col>
        <el-col :span="24" class="foot-col">电话 : 021 6786 6532</el-col>
        <el-col :span="24" class="foot-col">Email : support@getweapp.com </el-col>
        <el-col :span="24" class="foot-col">地址 : 上海市松江区广富林路658弄215号1406室</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        index: '/'
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key);
        this.$router.push( key )
      },
      init () {
        this.index = '/'
      }
    },

  }
</script>

<style>
  .large {
    font-size: 16px;
  }

  .container {
    padding-left: 10%;
    padding-right: 10%;
  }

  .foot {
    margin-top: 100px;
  }

  .foot-col {
    margin-top: 5px;
    color: gray;
  }

  .link {
    text-decoration: none;
  }

  .title {
    background-color: #ccc;
  }

  .nav {
    background-color: #ccc;
    height: 100%;
    text-align: right;
  }

  .logo {
    height: 50px;
    width: 50px;
    margin: 5px;
  }
</style>
