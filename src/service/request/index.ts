import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { ChRequestConfig, ChRequestInterceptors } from './type'
import { ElLoading } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'
const Default_Loading = false
class ChRequest {
  instance: AxiosInstance
  interceptors?: ChRequestInterceptors
  showLoading: Boolean
  loading?: LoadingInstance
  constructor(config: ChRequestConfig) {
    this.instance = axios.create(config)
    this.showLoading = config.showLoading ?? Default_Loading
    this.interceptors = config.interceptors
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )
    //公共拦截器，控制加载按钮的显隐
    this.instance.interceptors.request.use(
      (config) => {
        if (this.showLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: '正在请求数据...',
            background: 'rgba(0,0,0,0.5)'
          })
        }
        return config
      },
      (err) => {
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        this.loading?.close()
        const data = res.data
        return data
      },
      (err) => {
        this.loading?.close()
        if (err.response.status === 404) {
          console.log('404的错误')
        }
        return err
      }
    )
  }

  request<T>(config: ChRequestConfig<T>): Promise<T> {
    //1.对特殊请求的拦截器进行配置拦截
    return new Promise((resolve, reject) => {
      // 1.单个请求对请求config的处理  //就是在使用的时候油传过来独特的拦截器
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config) // ??
      }

      //2.判断是否需要显示loading
      if (config.showLoading === false) {
        this.showLoading = config.showLoading
      }

      //3.使用axios实例发送请求
      this.instance
        .request<any, T>(config) //这里的config是一步一步传的，在创建axios.create(config)这个config传入的是基础的baseurl，timeout，
        .then((res) => {
          //1.单个请求对数据的处理
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
          //2.将showLoading设置为true，这样不会影响下一个请求
          this.showLoading = Default_Loading
          //3.请求结果返回出去resolve
          resolve(res)
        })
        .catch((err) => {
          this.showLoading = Default_Loading
          reject(err)
          return err
        })
    })
  }
  get<T = any>(config: ChRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', params: { ...config.data } }) //get请求一般不穿参，若传参，则要讲data改成params：{...data}
  }
  post<T = any>(config: ChRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }
  delete<T = any>(config: ChRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }
  put<T = any>(config: ChRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' })
  }
  patch<T = any>(config: ChRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH' })
  }
}
export { ChRequest }
