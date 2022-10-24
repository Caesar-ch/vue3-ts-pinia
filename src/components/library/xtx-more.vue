<template>
  <RouterLink :to="path" class="xtx-more">
    <span>查看全部</span>
    <i class="iconfont icon-angle-right"></i>
  </RouterLink>
</template>

<script  lang="ts" setup>
name: 'XtxMore'
const props = defineProps({
  path: {
    type: String,
    default: '/'//用来点击时改变路径
  }
})

</script>

<style scoped lang='less'>
@import '../../assets/style/variables';
@import '../../assets/style/mixins.less';

.xtx-more {
  margin-bottom: 2px;

  span {
    font-size: 16px;
    vertical-align: middle;
    margin-right: 4px;
    color: #999;
  }

  i {
    font-size: 14px;
    vertical-align: middle;
    position: relative;
    top: 2px;
    color: #ccc;
  }

  &:hover {

    span,
    i {
      color: @xtxColor;
    }
  }
}
</style>
