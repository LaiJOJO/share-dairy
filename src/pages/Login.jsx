import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import { scrollToTop } from '../units/scrollToTop'
import { message, Modal } from 'antd'
import { HomeOutlined, LeftOutlined } from '@ant-design/icons'

export default function Login() {
  useEffect(() => {
    scrollToTop()
  }, [])
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [value, changeValue] = useState({
    username: '',
    password: ''
  })
  const [err, setErr] = useState(null)
  const onSubmit = async function (event) {
    event.preventDefault()
    try {
      // 调用context内的login函数，进行异步登录请求
      const res = await login(value)
      message.success(res)
      navigate('/')
    } catch (error) {
      if (error.message.includes('401')) {
        setErr('用户名不存在 !')
        Modal.confirm({
          title: 'Tips',
          content: (
            <p>用户不存在! 是否前往注册?</p>
          ),
          onOk() {
            navigate('/register')
          },
          okText: '点击前往注册页面 ',
          cancelText: '取消'
        });
      } else if (error.message.includes('404')) {
        setErr('用户名或密码错误 !')
        message.warning('用户名或密码错误 !')
      } else {
        setErr(error.message)
        message.warning('网络异常, 请稍后尝试 !')
      }
    }
  }
  const handlerChange = function (event) {
    changeValue((prev) => {
      return { ...prev, [event.target.name]: event.target.value }
    })
  }
  return (
    <div className='auth'>
      <div className='logo'>
        <span className="mobile-dec" onClick={() => navigate(-1)}><LeftOutlined /> 返回</span>
        <span className="mobile-dec" onClick={() => navigate('/')}><HomeOutlined /> 首页</span>
      </div>
      <h1>LOGIN</h1>
      <form action="">
        <input type="text" placeholder='username' name='username' onChange={handlerChange} />
        <input type="password" placeholder='password' autoComplete='false' name='password' onChange={handlerChange} />
        <button onClick={onSubmit}>登录</button>
        {err && <p>{err}</p>}
        <span>点击前往注册页面 <Link to='/register'>Register</Link></span>
      </form>
    </div>
  )
}
