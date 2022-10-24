import { ChRequest } from './request'
import { Base_URL, Time_Out } from './request/config'
import { userStore } from '@/store/user'
import { useRouter } from 'vue-router'
const localCache = {
  getCache(a: any) {
    return a
  }
}
const store = userStore()
const router = useRouter()
const chRequest = new ChRequest({
  baseURL: Base_URL,
  timeout: Time_Out,
  interceptors: {
    requestInterceptor: (config) => {
      // if (localStorage.getItem('token'))
      //   config.headers!.Authorization = `Bearer	${localStorage.getItem('token')}`
      const token = store.userInfo.token
      if (token && token != 'token' && token != undefined) {
        config.headers!.Authorization = `Bearer ${token}` //非空断言因为header为可选属性，可能为空，则可能没有属性Author，所以使用非空断言。为什么不使用可选链呢，因为可选链不能出现在赋值操作符的左侧::赋值表达式的左侧不能是可选属性访问。
        // config.headers!.Authorization = `Bearer ${token}`
      }
      return config
    },
    requestInterceptorCatch: (err) => {
      return err
    },
    responseInterceptor: (res) => {
      return res
    },
    responseInterceptorCatch: (err) => {
      // 401 状态码，进入该函数
      if (err.response && err.response.status === 401) {
        // 1. 清空无效用户信息
        // 2. 跳转到登录页
        // 3. 跳转需要传参（当前路由地址）给登录页码
        // store.commit('user/setUser', {})
        // 当前路由地址
        // 组件里头：`/user?a=10` $route.path === /user  $route.fullPath === /user?a=10
        // js模块中：router.currentRoute.value.fullPath 就是当前路由地址，router.currentRoute 是ref响应式数据
        const fullPath = encodeURIComponent(router.currentRoute.value.fullPath) //
        //这里主要是当未登录状态进行结算购物车，会返回401，告诉未登录，则此时会跳转到登陆页面，但跳转之前需要保存现在的地址，然后装在url地址栏里，
        //然后当在登陆页面登陆成功时，此时地址脸保存之前的路由位置，则需要从地址栏拿到路有地址，跳转到之前，页面，若地址栏没存则就跳到首页'/'
        // encodeURIComponent 转换uri编码，防止解析地址出问题
        router.push('/login?redirectUrl=' + fullPath)
      }
      return Promise.reject(err)
    }
  }
})
export { chRequest }
