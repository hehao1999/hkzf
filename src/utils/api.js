import axios from 'axios'
import { getToken, removeToken } from '.'
import { BASE_URL } from './url'

const API = axios.create({
  baseURL: BASE_URL
})

// 添加请求拦截器
API.interceptors.request.use(config => {
  const { url } = config
  if(url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith('/user/register')){
    // 添加请求头
    config.headers.Authorization = getToken()
  }
  return config
})

// 添加响应拦截器
API.interceptors.response.use(response => {
  const { status } = response
  // Token失效，移除
  if (status === 400) {
    removeToken()
  }
  return response
})

export { API }