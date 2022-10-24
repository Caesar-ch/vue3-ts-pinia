import { chRequest } from '@/service'
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return chRequest.get({ url: '/member/collect', data: { page, pageSize, collectType } })
}
