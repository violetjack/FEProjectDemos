<template>
    <div>
      <mt-cell v-for="(item, index) in areas" :title="(index + 1) + '.' + item" is-link/>
    </div>
</template>

<script>
  export default {
      data(){
        return {
          areas: ['民乐小区','荣乐小区']
        }
      }
  }
</script>
