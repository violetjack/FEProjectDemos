import { destroyVM, createTest, createVue } from '../util'
import Click from '@/components/Click'

describe('click.vue', () => {
  let vm

  afterEach(() => {
    destroyVM(vm)
  })

  it('测试按钮点击事件', () => {
    vm = createTest(Click, {
      AddNum: 10,
      InitNum: 11
    }, true)
    let buttonElm = vm.$el.querySelector('button')
    buttonElm.click()
    buttonElm.click()
    buttonElm.click()
    // setTimeout 的原因
    // 在数据改变之后，界面的变化会有一定延时。不用timeout有时候会发现界面没有变化
    setTimeout(done => {
      expect(vm.ResultNum).to.equal(41)
      expect(vm.$el.querySelector('.init-num').textContent).to.equal('初始值为11')
      expect(vm.$el.querySelector('.click-num').textContent).to.equal('点击了3次')
      expect(vm.$el.querySelector('.result-num').textContent).to.equal('最终结果为41')
      done()
    }, 100)
  })

  it('测试创建Vue对象', () => {
    let result
    vm = createVue({
      template: `
        <click @click="handleClick"></click>
      `,
      props: {
        AddNum: 10,
        InitNum: 11
      },
      methods: {
        handleClick (obj) {
          result = obj
        }
      },
      components: {
        Click
      }
    }, true)
    vm.$el.click()
    vm.$nextTick(done => {
      expect(result).to.be.exist
      expect(result.ClickNum).to.equal(1)
      expect(result.ResultNum).to.be.equal(21)
      done()
    })
  })
})
