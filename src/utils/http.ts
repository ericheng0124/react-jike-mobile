// 封装axios

import axios from 'axios'

// 创建实例
const httpInstance = axios.create({
  // 基础地址
  baseURL: 'http://geek.itheima.net/v1_0',
  // 超出时间
  timeout: 5000,
})

// 请求拦截器
httpInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
httpInstance.interceptors.response.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export {httpInstance}
