import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ChRequestInterceptors<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (res: T) => T //这个类型参数主要是决定了返回的res的类型
  responseInterceptorCatch?: (error: any) => any
}

export interface ChRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: ChRequestInterceptors<T>
  showLoading?: boolean
}
