<template>
  <div class="order-detail-page" v-if="order">
    <!-- 操作栏 -->
    <DetailAction :order="order" />
    <!-- 步骤条 组件xtx-steps.vue-->
    <DetailSteps :order="order" />
    <!-- 物流栏 -->
    <Suspense v-if="[3,4,5].includes(order.orderState)">
      <!-- 组件加载完毕 -->
      <template #default>
        <DetailLogistics :order="order" />
      </template>
      <!-- 组件加载中显示 -->
      <template #fallback>
        <div class="loading">loading</div>
      </template>
    </Suspense>
    <!-- 订单商品信息 -->
    <DetailInfo :order="order"></DetailInfo>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import DetailAction from './components/detail-action.vue'
import { findOrder } from '@/api/order'
import { useRoute } from 'vue-router'
import DetailSteps from './components/detail-steps.vue'
import DetailLogistics from './components/detail-logistics.vue'
import DetailInfo from './components/detail-info.vue'

name: 'OrderDetailPage'
const order = ref(null)
const route = useRoute()
findOrder(route.params.id).then(data => {
  order.value = data.result
})
</script>
<style scoped lang="less">
.order-detail-page {
  background: #fff;
}

.loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>
