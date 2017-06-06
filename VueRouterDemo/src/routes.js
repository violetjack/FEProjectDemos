import Page01 from './components/page01'
import Page02 from './components/page02'
import Page03 from './components/page03'
import Page04 from './components/page04'
import Page05 from './components/page05'

import Child01 from './components/childs/child01'
import Child02 from './components/childs/child02'

export default [
  //嵌套路由
  { path: '/', component: Page01 },
  //动态路由
  { name: 'Page02', path: '/02/:id', component: Page02 },
  //命名路由&路由传参
  { name: 'com03', path: '/03/:sex', component: Page03 },
  { path: '/04', component: Page04,
    children: [
      { name: 'child01', path: '/', component: Child01 },
      { name: 'child02', path: '/c02', component: Child02 },
    ]
  },
  { name: 'Page05', path: '/05/:txt', component: Page05 },
]
