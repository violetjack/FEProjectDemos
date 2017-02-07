import Container from './pages/Container'
import Home from './childs/home'
import Courses from './childs/courses'
import Engine from './childs/engine'
import Notify from './childs/notify'
import Resource from './childs/resource'
import SignIn from './childs/signin'
import Start from './childs/start'


export default [
  { path: '/', component: Container,
    children: [
      { name: 'home', path: '/', component: Home },
      { name: 'Courses', path: '/Courses', component: Courses },
      { name: 'Engine', path: '/Engine', component: Engine },
      { name: 'Notify', path: '/Notify', component: Notify },
      { name: 'Resource', path: '/Resource', component: Resource },
      { name: 'SignIn', path: '/SignIn', component: SignIn },
      { name: 'Start', path: '/Start', component: Start },
      { name: 'Home', path: '/Home', component: Home },
    ]
  },
]
