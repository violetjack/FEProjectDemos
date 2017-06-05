import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Click from '@/components/Click'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Click',
      component: Click
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    }
  ]
})
