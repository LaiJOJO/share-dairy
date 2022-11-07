import axios from 'axios'
import { setLoad } from '../App';
const request = axios.create({
  baseURL: 'http://localhost:8008/api',
  // timeout: 5000,
  withCredentials: true
})
// 请求拦截器
request.interceptors.request.use((config) => {
  setLoad(true)
  return config
}, err => {
  console.log(err)
})

// 响应拦截器,res是返回的数据,可供预处理
request.interceptors.response.use((res) => {
  setLoad(false)
  return res
}, (err) => {
  return Promise.reject(new Error(err))
})
export let isLoading = false
export default request