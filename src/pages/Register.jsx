import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { postRegister } from '../axios/request.js'

export default function Register() {
  const [value, changeValue] = useState({
    username: '',
    password: '',
    email: ''
  })
  const [err, setErr] = useState(null)
  const navigate = useNavigate()
  // 点击注册
  const onSubmit = async function (event) {
    event.preventDefault()
    try {
      await postRegister(value)
      // 成功则跳转登录页面
      navigate('/login')
    } catch (error) {
      // 收集错误信息，显示在页面上
      setErr(() => {
        return (error.response.data)
      })
    }

  }
  // 监听输入变化更新state
  const handlerChange = function (event) {
    changeValue((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }
  return (
    <div className='auth'>
      <h1>REGISTER</h1>
      <form action="">
        <input type="text" placeholder='username' name='username' onChange={handlerChange} />
        <input type="password" placeholder='password' autoComplete='false' name='password' onChange={handlerChange} />
        <input type="email" placeholder='email' name='email' onChange={handlerChange} />
        <button onClick={onSubmit}>注册</button>
        {/* 有错误信息就显示 */}
        {err && <p>{err}</p>}
        <span>点击前往登录页面 <Link to='/login'>Login</Link></span>
      </form>
    </div>
  )
}
