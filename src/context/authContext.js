import { createContext, useEffect, useState } from "react";
import { postLogin, postLogout } from '../axios/request.js'
import { message } from 'antd'
import React from 'react'
export const AuthContext = createContext()

// context作为一个函数暴露，参数children即为外部引入包裹的<App/>,这里必须 {children} 因为下面返回值内部必须不能是对象
export const AuthContextProvider = function ({ children }) {

  // 初始值本地存储的用户名
  const [username, setUsername] = useState(JSON.parse(localStorage.getItem('USER')) || null)
  const [userImg, setUserImg] = useState(JSON.parse(localStorage.getItem('USERIMG')) || null)
  // 登录修改当前用户名
  const login = async function (data) {
    try {
      const res = await postLogin(data)
      setUsername(res.data.username)
      setUserImg(res.data.img)
      return Promise.resolve('登录成功')
    } catch (error) {
      return Promise.reject(new Error(error))
    }
  }
  // 登出清空状态
  const logout = async function (isShow = true) {
    try {
      const res = await postLogout()
      if (res.status === 200) {
        setUsername(null)
        setUserImg(null)
        if (isShow) message.info('已退出登录')
      }
    } catch (error) {
      message.warning(error.message)
    }
  }
  // 监听state状态，及时更新本地存储
  useEffect(() => {
    localStorage.setItem('USER', JSON.stringify(username))
    localStorage.setItem('USERIMG', JSON.stringify(userImg))
  }, [username, userImg])
  return (
    <AuthContext.Provider value={{ login, logout, currentUsername: username, userImg, setUserImg }}>
      {children}
    </AuthContext.Provider>
  )
}
