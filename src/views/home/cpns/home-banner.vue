<template>
  <div class="home-banner">
    <XtxCarousel :sliders=sliders />
  </div>
</template>
<script lang="ts" setup>
import { findBanner } from '@/api/home'
import { ref } from 'vue';
name: 'HomeBanner'
const sliders = ref([])
findBanner().then((res) => {
  sliders.value = res.result
})
</script>
<style lang="less" scoped>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;

  z-index: 98;

  :deep(.xtx-carousel) {
    .carousel-btn.prev {
      left: 270px;
    }

    .carousel-indicator {
      padding-left: 250px;
    }
  }
}
</style>
