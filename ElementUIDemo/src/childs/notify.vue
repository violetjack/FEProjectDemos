<template>
  <div class="container">
    <h1>订阅微信公众号公告通知</h1>
    <h4><i class="el-icon-time"></i> 微信公众平台(http://mp.weixin.qq.com)有新公告时，会发通知到您的邮箱</h4>
    <el-row style="margin-top:10px;">
      <el-col :span="8">
        <el-input v-model="mail" placeholder="您接收通知的邮箱"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;">
      <el-col :span="8">
        <el-input v-model="name" placeholder="您的昵称"></el-input>
      </el-col>
    </el-row>

    <el-button type="primary" style="margin-top:10px;" @click.native="sign">立即订阅</el-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        mail: '',
        name: ''
      }
    },
    methods: {
      sign () {
        this.$alert('手机号：' + this.mail + ' 密码：' + this.name, '登录结果', {
         confirmButtonText: '确定',
         callback: action => {
           this.$message({
             type: 'info',
             message: `action: ${ action }`
           });
         }
       });
      },
    }
  }
</script>
