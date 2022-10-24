<template>
  <div class='xtx-goods-page' v-if="goods">
    <!-- v-if="goods" -->
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="'/category/'+goods.categories[0].id">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem :to="'/category/sub/'+goods.categories[1].id">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem>{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures"></GoodsImage>
          <GoodsSales />
        </div>
        <div class="spec">
          <!-- 名字区 -->
          <GoodsName :goods="goods" />
          <!-- 规格组件 -->

          <GoodsSku :goods="goods" @change="changeSku" />
          <!-- 数量组件 -->
          <XtxNumbox label="数量" v-model="num" :max="goods.inventory" />
          <XtxButton @click="insertCart()" type="plain" style="margin-top:20px;">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs :goods="goods" />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :goodsId="goods.id" :type="1" />
          <GoodsHot :goodsId="goods.id" :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, provide } from 'vue'
import { useRoute } from 'vue-router'
import { findGoods } from '@/api/product'
import GoodsRelevant from './components/goods-relevant.vue'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn.vue'
import { cartStore } from '@/store/cart'
import Message from '@/components/library/Message'
name: 'XtxGoodsPage'
const useGoods = () => {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(data => {
        // 让商品数据为null让后使用v-if的组件可以重新销毁和创建，即更新
        goods.value = null//先空值，立刻有值，操作不过来
        nextTick(() => {
          goods.value = data.result//若不加nextTick则当为空是触发的更新dom还未执行，就被覆盖了，立刻又有值，则v-if判断的组建会认为只直接从有值到有值
        })                          // 和让一个响应式数据循环递增100此，并不是每次都会触发更新dom操作，只有最后一次触发
      })
    }
  }, { immediate: true })
  return goods
}
const goods = useGoods()
const changeSku = (sku) => {
  //拿到spu进行修改价格，库存，现价，原价之类的信息
  if (sku.skuId) {
    goods.value.price = sku.price
    goods.value.oldPrice = sku.oldPrice
    goods.value.inventory = sku.inventory
  }
  currSku.value = sku
}
const num = ref(1)
provide('goods', goods)
const currSku = ref(null)
const store = cartStore()
const insertCart = () => {
  //调用state，去存储商品信息，用于打开购物车界面展示
  // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
  if (currSku.value) {
    store.insertCart({
      id: goods.value.id,
      skuId: currSku.value.skuId,
      name: goods.value.name,
      picture: goods.value.mainPictures[0],
      price: currSku.value.price,
      nowPrice: currSku.value.price,
      count: num.value,
      attrsText: currSku.value.specsText,
      selected: true,
      isEffective: true,
      stock: currSku.value.inventory
    }).then(() => {
      Message({ type: 'success', text: '加入购物车成功' })
    })
  } else {
    Message({ type: 'warn', text: '请选择完整规格' })
  }
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;

  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }

  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}

.goods-footer {
  display: flex;
  margin-top: 20px;

  .goods-article {
    width: 940px;
    margin-right: 20px;
  }

  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}

.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
