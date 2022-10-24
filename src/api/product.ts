import { chRequest } from '@/service'
export const findGoods = (id: number) => {
  return chRequest.get({ url: '/goods', data: { id } })
}

export const userAccountLogin = (a = { account: 'xiaotuxian001', password: '123456' }) => {
  return chRequest.post({ url: '/login', data: { ...a } })
}
