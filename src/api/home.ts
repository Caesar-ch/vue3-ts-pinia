import { chRequest } from '@/service'
export const findBrand = (limit: number) => {
  return chRequest.get({
    url: '/home/brand',
    data: {
      limit
    }
  })
}
export const findBanner = () => {
  return chRequest.get({ url: '/home/banner' })
}
export const findNew = () => {
  return chRequest.get({ url: 'home/new', showLoading: false })
}
export const findHot = () => {
  return chRequest.get({ url: 'home/hot', showLoading: false })
}
export const findGoods = () => {
  return chRequest.get({ url: 'home/goods', showLoading: false })
}
export const findSpecial = () => {
  return chRequest.get({ url: 'home/special', showLoading: false })
}
