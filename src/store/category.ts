import { defineStore } from 'pinia'
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export const categoryStore = defineStore('category', {
  state() {
    return {
      list: topCategory.map((item: any) => ({ name: item }))
    }
  },
  getters: {},
  actions: {
    async getList() {
      const { result } = await findAllCategory()
      //改造数据，加上控制二级分类显示隐藏的布尔值
      result.forEach((item: any) => {
        item.open = false
      })
      this.list = result
    },
    show(a: any) {
      const item: any = this.list.find((item: any) => a.id == item.id)
      item.open = true
    },
    close(a: any) {
      const item: any = this.list.find((item: any) => a.id == item.id)
      item.open = false
    }
  }
})
