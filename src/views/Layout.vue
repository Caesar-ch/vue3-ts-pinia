<template>
  <!-- 顶部通栏 -->
  <AppNavbar></AppNavbar>
  <!-- 头部组件 -->
  <AppHeader></AppHeader>
  <!-- 内容容器 -->
  <div class="Layout">
    <router-view></router-view>
  </div>
  <AppHeaddrSticky></AppHeaddrSticky>
  <!-- 底部组件 -->
  <AppFooter />
</template>

<script setup lang="ts">
import AppNavbar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaddrSticky from '@/components/app-header-sticky.vue'
</script>

<style scoped>

</style>
