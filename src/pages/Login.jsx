import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

export default function Login() {
  const {login} = useContext(AuthContext)
  const navigate = useNavigate()
  const [value, changeValue] = useState({
    username: '',
    password: ''
  })
  const [err, setErr] = useState(null)
  const onSubmit = async function(event){
    event.preventDefault()
    try {
      // 调用context内的login函数，进行异步登录请求
        await login(value)
        navigate('/')
    } catch (error) { 
      // 收集错误信息，显示在页面上
      setErr(() => {
        return (error.response.data)
      })
    }
  }
  const handlerChange = function (event) {
    changeValue((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }
  return (
    <div className='auth'>
      <h1>LOGIN</h1>
      <form action="">
        <input type="text" placeholder='username' name='username' onChange={handlerChange}/>
        <input type="password" placeholder='password' autoComplete='false' name='password' onChange={handlerChange}/>
        <button onClick={onSubmit}>登录</button>
        {err && <p>{err}</p>}
        <span>点击前往注册页面 <Link to='/register'>Register</Link></span>
      </form>
    </div>
  )
}
