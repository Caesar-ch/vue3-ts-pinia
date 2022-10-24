<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <!-- 轮播图 -->
        <HomeBanner></HomeBanner>

      </div>
    </div>
  </div>
  <!-- 新鲜好物 -->
  <HomeNew></HomeNew>
  <!-- 人气推荐 -->
  <HomeHot></HomeHot>
  <!-- 品牌展示 -->
  <HomeBrand></HomeBrand>
  <!-- 商品区域 -->
  <HomeProduct />
  <!-- 最新专题 -->
  <HomeSpecial></HomeSpecial>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeCategory from './cpns/home-category.vue'
import HomeBanner from './cpns/home-banner.vue'
import HomeNew from './cpns/home-new.vue'
import HomeHot from './cpns/home-hot.vue'
import HomeBrand from './cpns/home-brand.vue'
import HomeProduct from './cpns/home-product.vue'
import HomeSpecial from './cpns/home-special.vue'
name: 'HomePage'
const a = ref(false)
</script>

<style scoped lang="less">
@import '../../assets/style/variables.less';
@import '../../assets/style/mixins.less';

.a {
  width: 200px;
  height: 200px;
  background-color: red;
}

.v-enter-from {
  opacity: 0;
}

.v-enter-active {
  transition: all 5s;
}

.v-enter-to {
  opacity: 1;
}

.v-leave-from {
  opacity: 1;
}

.v-leave-active {
  transition: all 5s;
}

.v-leave-to {
  opacity: 0;
}
</style>
