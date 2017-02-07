<template>
    <div>
      <mt-cell
        v-for="(item, index) in areas"
        :title="(index + 1) + '.' + item.name"
        @click.native="goToList(item)"
        is-link/>
    </div>
</template>

<script>
  export default {
      data(){
        return {
          areas: [
            { name: '民乐小区', id: '1234'},
            { name: '荣乐小区', id: '5678'},
          ]
        }
      },
      methods: {
        goToList: function(item){
          this.$router.push({ path: '/maintainEleList', query: { userId: item.id }})
        }
      }
  }
</script>
