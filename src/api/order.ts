import { chRequest } from '@/service'
/**
 * 获取结算信息
 */
export const findCheckoutInfo = () => {
  return chRequest.get({ url: '/member/order/pre' })
}
/**
 * 添加收货地址信息
 * @param {Object} address - 地址对象
 */
export const addAddress = (address) => {
  return chRequest.post({ url: '/member/address', data: { ...address } })
}
/**
 * 编辑收货地址信息
 * @param {Object} address - 地址对象
 */
export const editAddress = (address) => {
  return chRequest.put({ url: '/member/address', data: { ...address } })
}
/**
 * 提交订单
 * @param {Object} order - 订单信息对象-购物车选中的商品
 */
export const createOrder = (order) => {
  return chRequest.post({ url: '/member/order', data: { ...order } })
}
/**
 * 获取再次购买的订单结算信息 - 根据订单id生成
 * @param {String} id - 订单ID
 * @returns
 */
export const findOrderRepurchase = (id) => {
  return chRequest.get({ url: `/member/order/repurchase/${id}` })
}
/**
 * 获取订单详情
 * @param {String} id - 订单ID
 */
export const findOrder = (id) => {
  return chRequest.get({ url: `/member/order/${id}` })
}
/**
 * 查询订单列表
 * @param {Number} orderState - 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @param {Number} page - 页码
 * @param {Number} pageSize - 每页条数
 * @returns
 */
export const findOrderList = ({ orderState, page, pageSize }) => {
  return chRequest.get({ url: '/member/order', data: { orderState, page, pageSize } })
}
/**
 * 取消订单
 * @param {String} orderId - 订单ID
 * @param {String} cancelReason - 取消原因
 * @returns Promise
 */
export const cancelOrder = (orderId, cancelReason) => {
  return chRequest.put({ url: `/member/order/${orderId}/cancel`, data: { cancelReason } })
}
/**
 * 删除订单
 * @param {Array<string>} ids - 删除订单，id集合
 * @returns
 */
export const delteOrder = (ids) => {
  return chRequest.delete({ url: '/member/order', data: { ids: [ids] } })
}
export const confirmOrder = (orderId) => {
  return chRequest.put({ url: `/member/order/${orderId}/receipt` })
}
/**
 * 查看物理
 * @param {String} id - 订单ID
 * @returns
 */
export const logisticsOrder = (id) => {
  return chRequest.get({ url: `/member/order/${id}/logistics` })
}
