<template>
  <div class="hello">
    <mt-header :title="selected" fixed>
    </mt-header>
    <mt-tab-container class="page-tabbar-container" v-model="selected" swipeable>
        <mt-tab-container-item id="电梯保养">
          <maintain></maintain>
        </mt-tab-container-item>
         <mt-tab-container-item id="故障报告">
           <report></report>
         </mt-tab-container-item>
         <mt-tab-container-item id="保养预警">
           <warn></warn>
         </mt-tab-container-item>
         <mt-tab-container-item id="电梯总览">
           <overview></overview>
         </mt-tab-container-item>
    </mt-tab-container>
    <mt-tabbar v-model="selected" fixed>
      <mt-tab-item id="电梯保养">
        <img slot="icon" src="../assets/logo.png">
        外卖
      </mt-tab-item>
      <mt-tab-item id="故障报告">
        <img slot="icon" src="../assets/logo.png">
        订单
      </mt-tab-item>
      <mt-tab-item id="保养预警">
        <img slot="icon" src="../assets/logo.png">
        发现
      </mt-tab-item>
      <mt-tab-item id="电梯总览">
        <img slot="icon" src="../assets/logo.png">
        我的
      </mt-tab-item>
    </mt-tabbar>

  </div>
</template>

<script>
import Maintain from './maintain/maintain'
import Overview from './overview/overview'
import Report from './report/report'
import Warn from './warn/warn'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      selected: '电梯保养'
    }
  },
  components: {
    Maintain,
    Overview,
    Report,
    Warn
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.page-tabbar-container {
  margin-top: 40px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
