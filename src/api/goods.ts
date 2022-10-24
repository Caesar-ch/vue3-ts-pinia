import { chRequest } from '@/service'
export const findRelGoods = (id, limit = 16) => {
  return chRequest.get({ url: '/goods/relevant', data: { id, limit } })
}
export const findHotGoods = ({ id, type, limit = 3 }) => {
  return chRequest.get({ url: '/goods/hot', data: { id, type, limit } })
}
export const findCommentInfoByGoods = (id) => {
  return chRequest.get({ url: `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate` })
}
//
export const findCommentListByGoods = (id, params) => {
  return chRequest.get({
    url: `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,
    data: { ...params }
  })
}
