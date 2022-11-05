import { createContext, useEffect, useState } from "react";
import { postLogin, postLogout } from '../axios/request.js'
import React from 'react'
export const AuthContext = createContext()

// context作为一个函数暴露，参数children即为外部引入包裹的<App/>,这里必须 {children} 因为下面返回值内部必须不能是对象
export const AuthContextProvider = function ({ children }) {
  // 初始值本地存储的用户名
  const [username, setUsername] = useState(JSON.parse(localStorage.getItem('USER')) || null)
  // 登录修改当前用户名
  const login = async function (data) {
    try {
      const res = await postLogin(data)
      setUsername(res.data.username)
    } catch (error) {
      console.log(error)
    }
  }
  // 登出清空状态
  const logout = async function () {
    try {
      const res = await postLogout()
      if(res.status===200){
        setUsername(null)
      }
    } catch (error) {
      
    }
  }
  // 监听state状态，及时更新本地存储
  useEffect(() => {
    localStorage.setItem('USER', JSON.stringify(username))
  }, [username])
  return (
    <AuthContext.Provider value={{ login, logout, currentUsername: username }}>
      {children}
    </AuthContext.Provider>
  )
}
