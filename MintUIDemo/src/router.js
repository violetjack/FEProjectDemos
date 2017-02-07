import VueRouter from 'vue-router'

import Home from './components/Home'
import Login from './components/Login'
import MaintainEleList from './components/maintain/maintainEleList'
import MaintainStep01 from './components/maintain/maintainStep01'
import MaintainStep02 from './components/maintain/maintainStep02'
import ReportEleList from './components/report/reportEleList'

export default new VueRouter({
  routes: [
    { path: '/', component: Login },
    { path: '/hello', component: Home },
    { path: '/maintainEleList', component: MaintainEleList },
    { path: '/maintainStep01', component: MaintainStep01 },
    { path: '/maintainStep02', component: MaintainStep02 },
    { path: '/reportEleList', component: ReportEleList },
  ]
})
