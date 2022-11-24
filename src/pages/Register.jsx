import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { postRegister } from '../axios/request.js'
import { scrollToTop } from '../units/scrollToTop.js'
import { message, Modal } from 'antd'
import { useForm } from "react-hook-form";

export default function Register() {
  // 表单验证
  const { register, handleSubmit, formState: { errors } } = useForm();
  useEffect(() => {
    scrollToTop()
  }, [])
  const [value, changeValue] = useState({
    username: '',
    password: '',
    email: ''
  })
  const [err, setErr] = useState(null)
  const navigate = useNavigate()
  // 点击注册
  const onSubmit = async function (data) {
    try {
      await postRegister(value)
      message.success('注册成功')
      // 成功则跳转登录页面
      navigate('/login')
    } catch (error) {
      // 收集错误信息，显示在页面上
      if (error.message.includes('409')) {
        setErr('用户名已存在或该邮箱已绑定其他用户 !')
        Modal.confirm({
          title: 'Tips',
          content: (
            <p>用户名已存在或该邮箱已绑定其他用户, 是否前往登录 ?</p>
          ),
          onOk() {
            navigate('/register')
          },
          okText: '点击前往登录页面 ',
          cancelText: '取消'
        });
      } else {
        setErr(error.message)
        message.warning('服务器异常, 请稍后尝试 !')
      }
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
        <input type="text" placeholder='username' name='username'  {...register("username", { required: true, pattern: /^[a-zA-Z0-9_-]{4,16}$/ })} onChange={handlerChange} />
        {errors.username && <span className='red'>用户名应由4-16位数字、字母和下划线组成</span>}

        <input type="password" placeholder='password' autoComplete='false' name='password'  {...register("password", { required: true, pattern: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/ })} onChange={handlerChange} />
        {errors.password && <span className='red'>密码应至少包含6位大小写字母和数字</span>}

        {/* eslint-disable-next-line */}
        <input type="email" placeholder='email' name='email' {...register("email", { required: true, pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ })} onChange={handlerChange} />
        {errors.email && <span className='red'>请输入正确的邮箱地址</span>}

        <button onClick={handleSubmit(onSubmit)}>注册</button>
        {/* 有后台返回的错误信息就显示 */}
        {err && <p>{err}</p>}
        <span>点击前往登录页面 <Link to='/login'>Login</Link></span>
      </form>
    </div>
  )
}
