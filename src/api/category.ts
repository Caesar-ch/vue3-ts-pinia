import { chRequest } from '@/service'

export const findAllCategory = () => {
  return chRequest.get({
    url: '/home/category/head'
  })
}
export const findTopCategory = (id: number) => {
  return chRequest.get({ url: '/category', data: { id }, showLoading: false })
}
export const findSubCategoryFilter = (id: number) => {
  return chRequest.get({ url: '/category/sub/filter', data: { id } })
}
export const findSubCategoryGoods = (params: Object) => {
  return chRequest.post({ url: '/category/goods/temporary', data: { ...params } })
}
