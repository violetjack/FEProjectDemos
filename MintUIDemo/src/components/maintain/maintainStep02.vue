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
        <mt-cell title="标题" label="描述信息" @click.native="toast" is-link></mt-cell>
        <mt-cell title="标题" label="描述信息" @click.native="alert" is-link></mt-cell>
        <mt-popup v-model="popupVisible" position="bottom" class="mint-popup-4">
            <mt-picker :slots="dateSlots" @change="onDateChange" :visible-item-count="3" :show-toolbar="false"></mt-picker>
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
          areas: ['无机房客梯', '无机房客梯', '无机房客梯', '无机房客梯',],
          dateSlots: [
            {
              flex: 1,
              values: ['2016-01', '2016-02', '2016-03', '2016-04', '2016-05', '2016-06'],
              className: 'slot1',
              textAlign: 'right'
            }, {
              divider: true,
              content: '-',
              className: 'slot2'
            }, {
              flex: 1,
              values: ['2016-01', '2016-02', '2016-03', '2016-04', '2016-05', '2016-06'],
              className: 'slot3',
              textAlign: 'left'
            }
          ],
        }
      },
      mounted: function () {
        this.$nextTick(function () {
          console.log(this.$route.params);
          console.log(this.$route.path);
          console.log(this.$route.query);
        })
      },
      methods: {
        back: function () {
           this.$router.go(-1)
        },
        next: function (){
            this.$router.push('./maintainStep02')
        },
        toast: function (){
            //this.$toast('hello')
            this.popupVisible = true
        },
        alert: function () {
            this.$messagebox.alert('你好').then(action => {
                this.$toast({
                    message: '操作成功',
                    position: 'bottom'
                })
            })
        }
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

</style>
