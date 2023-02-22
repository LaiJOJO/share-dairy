import React from 'react'
import {  useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {postReset} from '../axios/request.js'
import { scrollToTop } from '../units/scrollToTop'
import { message, Modal } from 'antd'
import { HomeOutlined, LeftOutlined } from '@ant-design/icons'

export default function Login() {
  useEffect(() => {
    scrollToTop()
  }, [])
  const navigate = useNavigate()
  const [value, changeValue] = useState({
    username: '',
    email: ''
  })
  const [err, setErr] = useState(null)
  const onReset = async function (event) {
    event.preventDefault()
    if(value.username.length ===0 || value.email.length===0) return
    try {
      // 请求重置密码
      const res = await postReset(value)
      Modal.confirm({
        title: 'Tips',
        content: (
          <p>{res.data} 已重置为123456</p>
        ),
        onOk() {
          navigate('/login')
        },
        okText: '前往登录页面 ',
        cancelText: '取消'
      });
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
        setErr('邮箱错误 !')
        message.warning('邮箱错误 !')
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
      {/* 手机端导航栏 */}
      <div className='logo'>
        <span className="mobile-dec" onClick={() => navigate(-1)}><LeftOutlined /> 返回</span>
        <span className="mobile-dec" onClick={() => navigate('/')}><HomeOutlined /> 首页</span>
      </div>
      <h1>Reset Password</h1>
      <form action="">
        <input type="text" placeholder='username' name='username' onChange={handlerChange} />
        <input type="email" placeholder='email' autoComplete='false' name='email' onChange={handlerChange} />
        <button onClick={onReset}>重置密码</button>
        {err && <p>{err}</p>}
        <span>返回登陆页面 <Link to='/login'>Login</Link></span>
        <span>点击前往注册页面 <Link to='/register'>Register</Link></span>
      </form>
    </div>
  )
}
