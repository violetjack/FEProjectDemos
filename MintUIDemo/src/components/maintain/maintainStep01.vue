<template>
    <div>
      <mt-header :title="title" fixed>
        <mt-button icon="back" slot="left" @click.native="back">返回</mt-button>
        <mt-button icon="more" slot="right"></mt-button>
      </mt-header>
      <div>
        <mt-field label="username" placeholder="Input username"></mt-field>
        <mt-field label="email" placeholder="Input email" type="email"></mt-field>
        <mt-field label="password" placeholder="Input password" type="password"></mt-field>
        <mt-field label="phone" placeholder="Input tel" type="tel"></mt-field>
        <mt-field label="website" placeholder="Input website" type="url"></mt-field>
        <mt-field label="number" placeholder="Input number" type="number"></mt-field>
        <mt-field label="birthday" placeholder="Input birthday" type="date"></mt-field>
        <mt-field label="introduction" placeholder="introduction" type="textarea" rows="4"></mt-field>
        <mt-field label="email" state="success"></mt-field>
        <mt-field label="email" state="error"></mt-field>
        <mt-field label="email" state="warning"></mt-field>
        <mt-cell title="标题" :value="result" @click.native="pickResult"></mt-cell>
        <mt-cell title="标题" label="描述信息" @click.native="alert" is-link></mt-cell>
        <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
            <mt-picker :slots="yearSlot" @change="onDateChange" :visible-item-count="3" :show-toolbar="false"></mt-picker>
            <mt-button size="normal" type="primary" class="btn-picker" @click.native="doPick">确认</mt-button>
            <mt-button size="normal" type="default" class="btn-picker" @click.native="popupVisible = false">取消</mt-button>
        </mt-popup>
        <mt-button id="step01" size="large" type="primary" @click.native="next">下一步</mt-button>
      </div>
    </div>
</template>

<script>
  export default {
      data(){
        return {
          title: '资料填写',
          popupVisible: false,
          result: '123',
          result01: '',
          areas: ['无机房客梯', '无机房客梯', '无机房客梯', '无机房客梯',],
          yearSlot: [{
            flex: 1,
            values: ['1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995'],
            className: 'slot1'
          }],

        }
      },
      mounted: function () {
        this.$nextTick(function () {
          console.log(this.$route.query);
        })
      },
      methods: {
        back () {
           this.$router.go(-1)
        },
        next (){
            this.$router.push('./maintainStep02')
        },
        pickResult (){
            this.popupVisible = true
        },
        alert () {
            this.$messagebox.alert('你好').then(action => {
                this.$toast({
                    message: '操作成功',
                    position: 'bottom'
                })
            })
        },
        onDateChange (picker, values) {
            this.result01 = values[0]
        },
        doPick () {
            this.result = this.result01
            this.popupVisible = false
        },
      }
  }
</script>

<style scoped>
div {
  margin-top: 40px;
}

.link {
  text-decoration: none;
}

#step01 {
  margin-top: 5px;
}

.mint-popup-4 {
  width: 100%;
  .picker-slot-wrapper, .picker-item {
      backface-visibility: hidden;
  }
}

.btn-picker {
  width: 49%;
}

</style>
