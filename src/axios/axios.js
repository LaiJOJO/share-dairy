import axios from 'axios'
export default axios.create({
  baseURL: 'http://localhost:8008/api',
  // timeout: 5000,
  withCredentials:true
})