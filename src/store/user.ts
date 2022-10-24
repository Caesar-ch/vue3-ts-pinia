import { defineStore } from 'pinia'
export const userStore = defineStore('user', {
  state() {
    return {
      userInfo: {
        id: '',
        account: '',
        nickname: '',
        avatar: '',
        token: '',
        mobile: ''
      }
    }
  },
  getters: {},
  actions: {
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    }
  }
})
