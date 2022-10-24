<template>
  <div class="home-hot">
    <HomePanel title="人气推荐" sub-title="人气爆款 不容错过">
      <div ref="target" syle="possition:relative;height:426px;">
        <transition>
          <ul v-if="goods.length" ref="pannel" class="goods-list">
            <li v-for="item in goods" :key="'home-hot'+item.id">
              <RouterLink to="/">
                <img :src="item.picture" alt="">
                <p class="name">{{item.title}}</p>
                <p class="desc">{{item.alt}}</p>
              </RouterLink>
            </li>
          </ul>
          <template v-else>
            <HomeSkeleton></HomeSkeleton>
          </template>
        </transition>
      </div>
    </HomePanel>
  </div>
</template>

<script lang="ts" setup>
// import { ref, computed } from 'vue'
import HomePanel from './home-panel.vue'
import HomeSkeleton from './home-skeleton.vue'
import { findHot } from '@/api/home'
import { useLazyData } from '@/hooks'
name: 'HomeNew'
const { result: goods, target } = useLazyData(findHot)

</script>

<style scoped lang='less'>
@import '../../../assets/style/mixins.less';
@import '../../../assets/style/variables.less';

.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;

  li {
    width: 306px;
    height: 406px;
    .hoverShadow();

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }

    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
