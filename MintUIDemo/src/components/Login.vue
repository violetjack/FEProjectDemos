<template>
  <div id="login">
    <img src="../assets/logo.png" height="200"/>

    <br/>
    <mt-field placeholder="请输入用户名" v-model="account"></mt-field>
    <mt-field placeholder="请输入密码" type="password" v-model="password"></mt-field>
    <!-- <router-link to="/hello" id="login-button"> -->
      <mt-button type="primary" size="large" v-on:click="logining">log in</mt-button>
    <!-- </router-link> -->
  </div>
</template>

<script>
  import serve from '../serve.js'

  export default {
    data (){
      return {
        account: 'wb-上海禾新机械工程有限公司',
        password: '123',
      }
    },
    components: {
    },
    methods: {
      logining: function(){
        var instance = this
        serve.login(this.account, this.password)
        .then(function (response) {
          let json = eval("(" + response.data + ")")
          console.log(response);
          instance.$toast(json.Message)
          if (json.Message == "登陆成功！") {
            instance.$router.push('/hello')
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    }
  }
</script>

<style>
  #login {
    margin-top: 100px;
    text-align: center;
  }

  #login-button {
    margin-top: 10px;
    text-decoration: none;
  }

</style>
