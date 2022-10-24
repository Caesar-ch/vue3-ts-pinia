import { defineStore } from 'pinia'
import {
  getNewCartGoods,
  mergeLocalCart,
  findCartList,
  insertCart,
  deleteCart,
  updateCart,
  checkAllCart
} from '@/api/cart'
import { userStore } from './user'
const store = userStore()
export const cartStore = defineStore('cart', {
  state() {
    return {
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList(): any[] {
      return this.list.filter((item) => item.stock > 0 && item.isEffective)
    },
    // 有效商品件数
    validTotal(): number {
      return this.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount(): number {
      return this.validList.reduce((p, c) => p + parseInt(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList(): any[] {
      return this.list.filter((item) => !(item.stock > 0 && item.isEffective))
    },
    // 选中商品列表
    selectedList() {
      return this.validList.filter((item) => item.selected)
    },
    // 选中商品件数
    selectedTotal() {
      return this.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 选中商品总金额
    selectedAmount() {
      return this.selectedList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll() {
      //判断大于0是当商品件数为0时全选框没有意义
      return this.validList.length === this.selectedList.length && this.selectedList.length !== 0
    }
  },
  actions: {
    insertCartlocal(goods) {
      const sameIndex = this.list.findIndex((item) => item.skuId === goods.skuId)
      // 逻辑：有相同的给goods累加数量，删除相同skuId的商品
      if (sameIndex >= 0) {
        goods.count = this.list[sameIndex].count + goods.count
        this.list.splice(sameIndex, 1)
      }
      this.list.unshift(goods)
    },
    //加入购物车
    insertCart(goods) {
      return new Promise((resolve, reject) => {
        if (store.userInfo.token) {
          //有token,从userStore拿到token，能拿到就是有登陆
          insertCart(goods)
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              this.setCartList(data.result)
              resolve('')
            })
        } else {
          //没有token,直接在本地进行存储
          this.insertCartlocal(goods)
          resolve('')
        }
      })
    },
    // 修改购物车商品
    updateCart(goods) {
      // goods中字段有可能不完整，goods有的信息才去修改。
      // 1. goods中必需又skuId，才能找到对应的商品信息
      const updateGoods = this.list.find((item) => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== null && goods[key] !== undefined && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 修改购物车商品
    updateCartAction(goods) {
      // goods 中：必须有skuId，其他想修改的属性 selected  count
      return new Promise((resolve, reject) => {
        if (store.userInfo.token) {
          // 登录 TODO
          updateCart(goods)
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              this.setCartList(data.result)
              resolve('')
            })
        } else {
          // 本地
          this.updateCart(goods)
          resolve('')
        }
      })
    },
    // 做有效商品的全选&反选
    checkAllCart(selected) {
      return new Promise((resolve, reject) => {
        if (store.userInfo.token) {
          // 登录 TODO
          const ids = this.validList.map((item) => item.skuId)
          checkAllCart({ selected, ids })
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              this.setCartList(data.result)
              resolve('')
            })
        } else {
          // 本地
          // 1. 获取有效的商品列表，遍历的去调用修改mutations即可
          this.validList.forEach((item) => {
            this.updateCart({ skuId: item.skuId, selected })
          })
          resolve('')
        }
      })
    },
    // 获取购物车列表
    findCartList() {
      return new Promise((resolve, reject) => {
        if (store.userInfo.token) {
          // 登录 TODO
          findCartList().then((data) => {
            this.setCartList(data.result)
            resolve('')
          })
        } else {
          // 本地
          // Promise.all() 可以并列发送多个请求，等所有请求成功，调用then
          // Promise.race() 可以并列发送多个请求，等最快的请求成功，调用then
          // 传参事promise数组
          const promiseArr = this.list.map((item) => {
            // 返回接口函数的调用
            return getNewCartGoods(item.skuId)
          })
          Promise.all(promiseArr)
            .then((dataArr) => {
              dataArr.forEach((data, i) => {
                this.updateCart({ skuId: this.list[i].skuId, ...data.result })
              })
              resolve('')
            })
            .catch((e) => {
              reject(e)
            })
        }
      })
    },
    // 删除购物车商品
    deleteCartList(skuId) {
      const index = this.list.findIndex((item) => item.skuId === skuId)
      this.list.splice(index, 1)
    },
    // 删除购物车商品
    deleteCart(skuId) {
      return new Promise((resolve, reject) => {
        if (store.userInfo.token) {
          // 登录 TODO
          deleteCart([skuId])
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              this.setCartList(data.result)
              resolve('')
            })
        } else {
          // 本地
          this.deleteCartList(skuId)
          resolve('')
        }
      })
    },
    // 批量删除选中商品
    batchDeleteCart(isClear = false) {
      return new Promise((resolve, reject) => {
        if (store.userInfo.token) {
          // 登录 TODO
          // 得到需要删除的商品列表（失效，选中）的skuId集合
          const ids = this[isClear ? 'invalidList' : 'selectedList'].map((item) => item.skuId)
          deleteCart(ids)
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              this.setCartList(data.result)
              resolve('')
            })
        } else {
          // 本地
          // 1. 获取选中商品列表，进行遍历调用deleteCart mutataions函数
          this[isClear ? 'invalidList' : 'selectedList'].forEach((item) => {
            this.deleteCart(item.skuId)
          })
          resolve('')
        }
      })
    },
    // 修改sku规格函数
    updateCartSku({ oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (store.userInfo.token) {
          // 登录 TODO
          // 1. 获取原先商品的数量
          // 2. 删除原先商品
          // 3. 获取修改的skuId 和 原先商品数量 做一个加入购物车操作
          // 4. 更新列表
          const oldGoods = this.list.find((item) => item.skuId === oldSkuId)
          deleteCart([oldSkuId])
            .then(() => {
              return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
            })
            .then(() => {
              return findCartList()
            })
            .then((data) => {
              this.setCartList(data.result)
              resolve('')
            })
        } else {
          // 本地
          // 但你修改了sku的时候其实skuId需要更改，相当于把原来的信息移出，创建一条新的商品信息。
          // 1. 获取旧的商品信息
          const oldGoods = this.list.find((item) => item.skuId === oldSkuId)
          // 2. 删除旧的商品
          this.deleteCart(oldSkuId)
          // 3. 合并一条新的商品信息
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          // 4. 去插入即可
          this.insertCart(newGoods)
        }
      })
    },
    // 设置购物车列表
    setCartList(list: []) {
      this.list = list
    },
    // 合并本地购物车
    async mergeLocalCart() {
      // 存储token后调用合并API接口函数进行购物合并
      const cartList = this.validList.map(({ skuId, selected, count }) => {
        return { skuId, selected, count }
      })
      await mergeLocalCart(cartList)
      // 合并成功将本地购物车删除
      this.setCartList([])
    }
  }
})
