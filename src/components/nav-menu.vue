<template>
  <div id="nav-menu">
    <el-menu 
    theme="dark" 
    default-active="1" 
    :router="true" 
    class="el-menu-nav" 
    mode="horizontal" 
    @select="handleSelect">
      <el-menu-item index="1" :route="{path: '/'}">首页</el-menu-item>
      <el-menu-item index="2" :route="{path: '/post'}">文章管理</el-menu-item>
      <el-menu-item index="3" :route="{path: '/data'}">数据分析</el-menu-item>
      <el-menu-item index="4" :route="{path: '/log'}">日志记录</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    methods: {
      handleSelect(key, keyPath) {
        
      }
    }
  }
</script>

<style scoped>
  .el-menu-nav {
    padding-left: 100px;
  }
</style>