<template>
  <div>
      <br/>
      <br/>
      <br/>
      <mt-button @click="$store.commit('increment')" type="primary" plain>add</mt-button>
      <span class="result">{{ $store.state.counter }}</span>
      <mt-button @click="$store.commit('increment')" type="primary" plain>add</mt-button>
  </div>
</template>

<style scoped>
    .result {
        width: 100px;
        height: 50px;
        font-size: 18px;
        color: aqua;
    }
</style>
