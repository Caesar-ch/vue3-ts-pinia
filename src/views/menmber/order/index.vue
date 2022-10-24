<template>
  <div class="member-order-page">
    <!-- tab组件 -->
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name">{{ item.label }}
      </XtxTabsPanel>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem @on-logistics="handlerLogistics" @on-confirm="handlerConfirm" @on-delete="handlerDelete"
        @on-canel="handlerCancel" v-for="item in orderList" :key="item.id" :order="item"></OrderItem>
    </div>
    <!-- 分页数据 -->
    <XtxPagination v-if="total > requestParams.pageSize" @current-change="requestParams.page=$event" :total="total"
      :page-size="requestParams.pageSize" :current-page="requestParams.page" />
    <!-- 取消订单 -->
    <OrderCancel ref="orderCancelCom" />
    <!-- 查看物流 -->
    <OrderLogistics ref="logisticsOrderCom" />
  </div>
</template>
<script lang="ts" setup>
import { orderStatus } from '@/api/constants'
import { reactive, ref, watch } from 'vue'
import { findOrderList, delteOrder, confirmOrder } from '@/api/order'
import OrderItem from './components/order-item.vue'
import XtxPagination from '@/components/library/xtx-pagination.vue';
import Message from '@/components/library/Message';
import Confirm from '@/components/library/confirm'
import OrderLogistics from './components/order-logistics.vue'
import OrderCancel from './components/order-cancel.vue'
name: 'MemberOrderPage'
const activeName = ref('all')
// 查询订单参数
const requestParams = reactive({
  page: 1,
  pageSize: 5,
  orderState: 0
})
// 订单列表
const orderList = ref([])
const loading = ref(true)
const total = ref(0)
// 初始化后，查询条件更改后，查询
const findOrderListFn = () => {
  findOrderList(requestParams).then(data => {
    orderList.value = data.result.items
    total.value = data.result.counts
    loading.value = false

  })
}
watch(requestParams, () => {
  loading.value = true
  findOrderListFn()
}, { immediate: true })

const tabClick = (tab: any) => {
  // 此时：tab.index 就是订单的状态
  requestParams.orderState = tab.index
  requestParams.page = 1
}
// 封装逻辑-取消订单
const orderCancelCom = ref(null)
const handlerCancel = (order) => {
  // item 就是你要取消的订单
  orderCancelCom.value.open(order)
}
//删除订单
const handlerDelete = (order) => {
  Confirm({ text: '您确认删除该条订单吗？' }).then(() => {
    delteOrder([order.id]).then(() => {
      Message({ text: '删除订单成功', type: 'success' })
      findOrderListFn()
    })
  }).catch(() => { })
}
//确认收货
const handlerConfirm = (order) => {
  // item 就是你要确认收货的订单
  Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' }).then(() => {
    confirmOrder(item.id).then(() => {
      Message({ text: '确认收货成功', type: 'success' })
      // 确认收货后状态变成 待评价
      item.orderState = 4
    })
  })
}
//查看物流
const logisticsOrderCom = ref(null)
const handlerLogistics = (order) => {
  logisticsOrderCom.value.open(order)
}
</script>
<style scoped lang="less">
@import '../../../assets/style/mixins.less';
@import '../../../assets/style/variables.less';

.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}

.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, .9) url(../../../assets/images/loading.gif) no-repeat center;
}

.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
