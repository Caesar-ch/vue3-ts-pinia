<template>
  <div class="container">
    <AppMemberAside />
    <article class="article">
      <RouterView />
    </article>
  </div>
</template>
<script lang="ts" setup>
import AppMemberAside from '@/components/app-member-aside.vue'
name: 'MemberLayout'

</script>
<style scoped lang="less">
.container {
  display: flex;
  padding-top: 20px;

  .article {
    width: 1000px;
  }
}
</style>
