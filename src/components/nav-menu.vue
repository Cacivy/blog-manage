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
      <div class="el-menu-userinfo">
        <el-submenu index="5">
          <template slot="title" index="5-1">{{$store.state.userinfo && $store.state.userinfo.username}}</template>
          <el-menu-item index="5-2">设置</el-menu-item>
          <el-menu-item index="5-3" @click.native="logout">退出</el-menu-item>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>

<script>
  export default {
    methods: {
      logout() {
        this.$api.get_user_logout().then(res => {
          this.$message({
              type: 'success',
              message: '已退出'
          })
          this.$store.dispatch('setUser', null)
          this.$router.push({name: 'login'})
        })
      },
      handleSelect(key, keyPath) {
        
      }
    }
  }
</script>

<style scoped>
  .el-menu-nav {
    padding-left: 100px;
  }
  .el-menu-userinfo {
    float: right;
    margin-right: 100px;
  }
</style>