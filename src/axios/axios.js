import axios from 'axios'
import { setLoad } from '../App';
const request = axios.create({
  baseURL: 'http://114.132.214.26:3004/api',
  // baseURL: 'http://192.168.175.131:8008/api',
  // baseURL: 'http://localhost:8008/api',
  timeout: 20000,
  withCredentials: true
})
// 请求拦截器
request.interceptors.request.use((config) => {
  setLoad(true)
  return config
}, err => {
  setLoad(false)
  console.log(err)
})

// 响应拦截器,res是返回的数据,可供预处理
request.interceptors.response.use((res) => {
  setLoad(false)
  return res
}, (err) => {
  setLoad(false)
  return Promise.reject(new Error(err))
})
export let isLoading = false
export default request