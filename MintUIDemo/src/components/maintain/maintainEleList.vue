<template>
    <div>
      <mt-header :title="title" fixed>
        <mt-button icon="back" slot="left" @click.native="back">返回</mt-button>
        <mt-button icon="more" slot="right"></mt-button>
      </mt-header>
      <div>
        <mt-cell
          v-for="(item, index) in areas"
          :title="(index + 1) + '.' + item"
          v-on:click.native="goToStep01(item)"
          is-link/>
      </div>
    </div>
</template>

<script>
  export default {
      data(){
        return {
          title: '电梯列表',
          areas: ['无机房客梯', '无机房客梯', '无机房客梯', '无机房客梯',]
        }
      },
      mounted: function () {
        this.$nextTick(function () {
          console.log(this.$route.params);
        })
      },
      methods: {
        back: function () {
           this.$router.go(-1)
        },
        goToStep01: function(){
            this.$router.push({ path: './maintainStep01', query: { eleID: '125487' } })
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

</style>
