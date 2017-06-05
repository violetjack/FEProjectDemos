import { destroyVM, createTest } from '../util'
import Click from '@/components/Hello'

describe('click.vue', () => {
  let vm

  afterEach(() => {
    destroyVM(vm)
  })

  it('click test', done => {
    vm = createTest()
  })
})
