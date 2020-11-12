<template>
  <router-view />
</template>

<script>
import { onMounted } from 'vue'
export default {
  name: "app",
  components: {},
  setup() {
    onMounted(() => {
      localStorage.removeItem('Router');
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
