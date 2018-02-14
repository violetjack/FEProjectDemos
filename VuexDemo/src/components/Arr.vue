<template>
  <div>
      <h2 v-for="n in arr" :key="n">{{ n }}</h2>
      <h3>{{ deep.name.who }}</h3>
  </div>
</template>

<script>
export default {
  props: ['arr', 'deep']
}
</script>
