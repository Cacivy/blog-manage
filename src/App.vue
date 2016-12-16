<template>
  <div id="app">
    <nav-menu></nav-menu>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import navMenu from './components/nav-menu'
export default {
  name: 'app',
  components: { 
    navMenu
  },
  data () {
    return {
      
    }
  }
}
</script>

<style scoped>
  .content {
    padding: 20px 100px;
  }
</style>
