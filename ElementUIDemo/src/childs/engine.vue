<template>
  <div class="container">
    <h1>数据引擎</h1>
    <h3>https://api.getweapp.com/engine/</h3>
    <el-row style="margin-top:10px;">

    </el-row>
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
    }
  }
</script>

<style>
.link {
  text-decoration: none;
}
</style>
