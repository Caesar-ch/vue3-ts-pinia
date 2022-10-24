<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template #right>
      <div>
        <a @click="toggle(-1)" :class="{disabled:index=== 0}" href="javascript:;"
          class="iconfont icon-angle-left prev"></a>
        <a @click="toggle(1)" :class="{disabled:index=== 1}" href="javascript:;"
          class="iconfont icon-angle-right next"></a>
      </div>
    </template>
    <div class="box" ref="target">
      <ul v-if="brands.length" class="list" :style="{transform:`translateX(${-index * 1240 }px)`}">
        <li v-for="(item,index) in brands" :key="'home-brand'+index">
          <RouterLink to="/">
            <img :src="item.picture" alt="">
          </RouterLink>
        </li>
      </ul>
      <div v-else class="skeleton">
        <XtxSkeleton class="item" v-for="i in 5" :key="i" animated bg="#e4e4e4" width="240px" height="305px" />
      </div>
    </div>
  </HomePanel>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import HomePanel from './home-panel.vue'
import { findBrand } from '@/api/home'
import { useLazyData } from '@/hooks'
name: 'HomeBrand'
// const brands = ref<any>([])
// findBrand(10).then(res => brands.value = res.result)
// 注意：useLazyData需要的是API函数，如果遇到要传参的情况，自己写函数再函数中调用API
const { result: brands, target } = useLazyData(() => findBrand(10))
const index = ref(0)
const toggle = (step: number) => {
  const newIndex = index.value + step
  if (newIndex > 1 || newIndex < 0) return
  index.value = newIndex
}
</script>

<style scoped lang='less'>
@import '../../../assets/style/variables.less';
@import '../../../assets/style/mixins.less';

.skeleton {
  width: 100%;
  display: flex;

  .item {
    margin-right: 10px;

    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}

.home-panel {
  background: #f5f5f5
}

.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;

  &::before {
    font-size: 12px;
    position: relative;
    top: -2px
  }

  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}

.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;

  .list {
    width: 200%;
    display: flex;
    transition: all 1s;

    li {
      margin-right: 10px;
      width: 240px;

      &:nth-child(5n) {
        margin-right: 0;
      }

      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
