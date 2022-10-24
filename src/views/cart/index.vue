<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <XtxCheckbox @change="checkAll" :modelValue="store.isCheckAll">全选</XtxCheckbox>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-if="store.validList.length === 0">
              <td colspan="6">
                <CartNone />
              </td>
            </tr>
            <tr v-for="good in store.validList" :key="good.id">
              <td>
              <td>
                <XtxCheckbox @change="$event=>checkOne(good.skuId,$event)" :modelValue="good.selected" />
              </td>
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${good.id}`"><img :src="good.picture" alt=""></RouterLink>
                  <div>
                    <p class="name ellipsis">{{good.name}}</p>
                    <!-- 选择规格组件 -->
                    <CartSku @change="$event=>updateCartSku(item.skuId,$event)" :attrsText="good.attrsText"
                      :skuId="good.skuId"></CartSku>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{good.nowPrice}}</p>
                <p v-if="good.price-good.nowPrice>0">
                  比加入时降价<span class="red">&yen;{{good.price-good.nowPrice}}</span>
                </p>
              </td>
              <td class="tc">
                <XtxNumbox :max="good.stock" @change="$event=>changeCount(good.skuId,$event)"
                  :modelValue="good.count" />
              </td>

              <td class="tc">
                <p class="f16 red">&yen;{{good.nowPrice*100*good.count/100}}</p>
              </td>

              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a @click="deleteCart(good.skuId)" class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody v-if="store.invalidList.length>0">
            <tr>
              <td colspan="6">
                <h3 class="tit">失效商品</h3>
              </td>
            </tr>
            <tr v-for="item in store.invalidList" :key="item.skuId">
              <td>
                <XtxCheckbox style="color:#eee;" />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${item.id}`">
                    <img :src="item.picture" alt="">
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">{{item.name}}</p>
                    <p class="attr">{{item.attrsText}}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{item.nowPrice}}</p>
              </td>
              <td class="tc">{{item.count}}</td>
              <td class="tc">
                <p>&yen;{{item.nowPrice*100*item.count/100}}</p>
              </td>
              <td class="tc">
                <p><a @click="deleteCart(item.skuId)" class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox @change="checkAll" :modelValue="store.isCheckAll">全选</XtxCheckbox>
          <a @click="batchDeleteCart()" href="javascript:;">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a @click="batchDeleteCart(true)" href="javascript:;">清空失效商品</a>
        </div>
        <div class="total">
          共 {{store.validTotal}} 件商品，已选择 {{store.selectedTotal}} 件，商品合计：
          <span class="red">¥{{store.selectedAmount}}</span>
          <XtxButton @click="checkout" type="primary">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>
<script lang="ts" setup>
import GoodRelevant from '@/views/goods/components/goods-relevant.vue'
import { cartStore } from '@/store/cart'
import { userStore } from '@/store/user'
import { useRouter } from 'vue-router'
import CartNone from './components/cart-none.vue'
import CartSku from './components/cart-sku.vue'
import Message from '@/components/library/Message'
import Confirm from '@/components/library/confirm'
name: 'XtxCartPage'
const store = cartStore()
//单选
const checkOne = (skuId, selected) => {
  store.updateCartAction({ skuId, selected })
}
//全选
const checkAll = (selected: boolean) => {
  store.checkAllCart(selected)
}
//删除商品
const deleteCart = (skuId) => {
  Confirm({ text: ' 您确认从购物车删除该商品吗？' }).then(() => {
    // console.log('点击确认')
    store.deleteCart(skuId).then(() => {
      Message({ type: 'success', text: '删除成功' })
    })
  }).catch(() => {
    // console.log('点击取消')
  })
}
// 批量删除
const batchDeleteCart = (isClear) => {
  // 如果要做批量删除的列表无数据，阻止提示下没有你要删除的商品。
  // 清空失效商品：目前传人[]数据，会清空说有的商品包括有效商品（后台BUG）
  Confirm({ text: `您确定从购物车删除${isClear ? '失效' : '选中'}选中的商品吗？` }).then(() => {
    store.batchDeleteCart()
  }).catch(() => { })
}
// 修改数量
const changeCount = (skuId, count) => {
  store.updateCart({ skuId, count })
}
// 修改规格
const updateCartSku = (oldSkuId, newSku) => {
  //拿着新旧skuId进行信息合并和删除
  store.updateCartSku({ oldSkuId, newSku })
}
//下单结算
const router = useRouter()
const userstore = userStore()
const checkout = () => {
  // 1. 判断是否选择有效商品
  // 2. 判断是否已经登录，未登录 弹窗提示
  // 3. 进行跳转 （需要做访问权限控制）
  if (store.selectedTotal.length === 0) return Message({ text: '至少选中一件商品才能结算' })
  if (!userstore.userInfo.token) {
    Confirm({ text: '下单结算需要登录，您是否去登录？' }).then(() => {
      // 点击确认
      router.push('/member/checkout')
    }).catch(() => { })
  } else {
    router.push('/member/checkout')
  }
}
</script>
<style scoped lang="less">
@import '../../assets/style/mixins.less';
@import '../../assets/style/variables.less';

.tc {
  text-align: center;

  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}

.red {
  color: @priceColor;
}

.green {
  color: @xtxColor
}

.f16 {
  font-size: 16px;
}

.goods {
  display: flex;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
  }

  >div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;

    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}

.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;

  .xtx-checkbox {
    color: #999;
  }

  .batch {
    a {
      margin-left: 20px;
    }
  }

  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}

.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}

.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;

    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;

      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;

        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }

      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
