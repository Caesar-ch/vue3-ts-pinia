<template>
  <div class="goods-tabs">
    <nav>
      <a :class="{ active: activeName === 'Detail' }" href="javascript:;" @click="clickTab('Detail')">商品详情</a>
      <a :class="{ active: activeName === 'Comment' }" href="javascript:;"
        @click="clickTab('Comment')">商品评价<span>({{goods.commentCount}})</span></a>
    </nav>
    <!-- 这个位置显示对应的组件 GoodsDetail 或者 GoodsComment -->

    <!-- <component :is="'Goods'+activeName"></component>不起作用 -->
    <!-- polfill版本 -->
    <template v-if="activeName == 'Detail'">
      <GoodsDetail></GoodsDetail>
    </template>
    <template v-else>
      <GoodsComment></GoodsComment>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import GoodsDetail from './goods-detail.vue'
import GoodsComment from './goods-comment.vue'
name: 'GoodsTabs'
// detail-->详情   comment-->评价
const activeName = ref('Detail')
const goods = inject('goods')
const clickTab = (name) => {
  activeName.value = name
  console.log(activeName);

}
</script>

<style scoped lang="less">
@import '../../../assets/style/mixins.less';
@import '../../../assets/style/variables.less';

.goods-tabs {
  min-height: 600px;
  background: #fff;

  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;

    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;

      >span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }

      &:first-child {
        border-right: 1px solid #f5f5f5;
      }

      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
