<template>
  <div class="container">
    <h1>付费课程</h1>
    <h3>资深一线工程师在线辅导开发微信小程序</h3>
    <table v-for="n in 5">
      <tr>
        <td rowspan="4"><img src="../assets/img_course_weappdev2.png"/></td>
        <td>
          <h3>微信小程序开发</h3>
        </td>
      </tr>
      <tr>
        <td>
          <span style="color:red;">￥99.99</span>
        </td>
      </tr>
      <tr>
        <td>
          微信小程序将会极大的替代 iOS 或 Android app ，成为未来一两年的主流产品形态。
          <br/><br/>
          这是一个持续 8 周的微信小程序开发入门课程。在两个月的课程中，你可以从毫无经验的零基础，到学会开发微信小程序产品，再到开发完成一个你脑海中想要的产品，这一切都比你想象中的更简单。
        </td>
      </tr>
      <tr>
        <td>
          <el-button style="color:green;" :plain="true" type="success"><i class="el-icon-circle-check"></i> 微信支付</el-button>
        </td>
      </tr>
      <tr>
        <td colspan="2"><hr/></td>
      </tr>
    </table>
  </div>
</template>
