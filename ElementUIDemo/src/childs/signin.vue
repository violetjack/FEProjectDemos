<template>
  <div class="container">
    <h1>登录</h1>
    <el-row style="margin-top:10px;">
      <el-col :span="8">
        <el-input v-model="phoneNO" placeholder="手机号"></el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;">
      <el-col :span="8">
        <el-input v-model="password" placeholder="密码"></el-input>
      </el-col>
    </el-row>

    <el-button type="primary" style="margin-top:10px;" @click.native="sign">立即登录</el-button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        phoneNO: '',
        password: ''
      }
    },
    methods: {
      sign () {
        this.$alert('手机号：' + this.phoneNO + ' 密码：' + this.password, '登录结果', {
         confirmButtonText: '确定',
         callback: action => {
           this.$message({
             type: 'info',
             message: `action: ${ action }`
           });
         }
       });
      },
    },
    mounted () {
      this.$router.push( "/start" )
    },
  }


</script>
