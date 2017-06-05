import { destroyVM, createTest } from '../util'
import Hello from '@/components/Hello'

describe('Hello.vue', () => {
  let vm

  afterEach(() => {
    destroyVM(vm)
  })

  it('should render correct contents', () => {
    vm = createTest(Hello, {}, true)
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js App')
    expect(vm.msg)
      .to.equal('Welcome to Your Vue.js App')
  })
})
