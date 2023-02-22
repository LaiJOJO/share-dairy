import { message, Modal } from 'antd';
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { postChangeUsername, postChangeEmail, postChangePassword } from '../axios/request.js';
import { AuthContext } from '../context/authContext';
import { checkUsername, checkPassword, checkEmail, checkRequired } from '../units/checkChangeUserInfo.js';
import { CheckCircleTwoTone } from '@ant-design/icons'
import { useEffect } from 'react';

export default function ChangeUser(props) {
  const { open, setOpen, changeData } = props

  // 根据开关弹窗禁用提交信息,清空输入过的信息
  useEffect(() => {
    setIsDisable(true)
    setChangeInfo({
      oldUsername: '',
      newUsername: '',
      oldEmail: '',
      newEmail: '',
      oldPassword: '',
      newPassword: ''
    })
  }, [open])

  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fromData, setFormData] = useState({})
  const [isDisable, setIsDisable] = useState(true)
  const [changeInfo, setChangeInfo] = useState({
    oldUsername: '',
    newUsername: '',
    oldEmail: '',
    newEmail: '',
    oldPassword: '',
    newPassword: ''
  })

  // 校验数据
  const onCheck = async () => {

    if (changeData === 'username') {
      if (checkRequired(changeInfo.oldUsername)) return message.warning('请输入原用户名')
      if (!checkUsername(changeInfo.newUsername)) return message.warning('新用户名应由4-16位数字、字母和下划线组成')
      if (checkRequired(changeInfo.oldPassword)) return message.warning('请输入密码')
      setFormData({ 'oldUsername': changeInfo.oldUsername, 'newUsername': changeInfo.newUsername, 'password': changeInfo.oldPassword })
    }
    else if (changeData === 'email') {
      if (checkRequired(changeInfo.oldUsername)) return message.warning('请输入用户名')
      if (checkRequired(changeInfo.oldPassword)) return message.warning('请输入密码')
      if (checkRequired(changeInfo.oldEmail)) return message.warning('请输入原邮箱')
      if (!checkEmail(changeInfo.newEmail)) return message.warning('请输入正确的新邮箱地址格式')
      setFormData({ 'oldEmail': changeInfo.oldEmail, 'newEmail': changeInfo.newEmail, 'password': changeInfo.oldPassword, 'username': changeInfo.oldUsername })
    }
    else {
      if (checkRequired(changeInfo.oldUsername)) return message.warning('请输入用户名')
      if (checkRequired(changeInfo.oldPassword)) return message.warning('请输入原密码')
      if (!checkPassword(changeInfo.newPassword)) return message.warning('密码应至少包含6位大小写字母和数字')
      if (checkRequired(changeInfo.oldEmail)) return message.warning('请输入用户邮箱')
      setFormData({ 'username': changeInfo.oldUsername, 'newPassword': changeInfo.newPassword, 'oldPassword': changeInfo.oldPassword, 'email': changeInfo.oldEmail })
    }
    // 通过则解除禁用
    setIsDisable(false)
  }

  // 点击提交时根据修改信息进行分类请求
  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      // 根据changeData的类型来确定修改什么信息,保存到formData中进行提交
      if (changeData === 'username') {
        await postChangeUsername(fromData)
      }
      else if (changeData === 'email') {
        await postChangeEmail(fromData)
      }
      else {
        await postChangePassword(fromData)
      }
      // 改变用户信息操作后都需要进行重新登录，因此清空localStorage并跳转登录页面
      setOpen(false);
      setConfirmLoading(false);
      // 执行一次退出登录
      logout(false)
      message.success('修改成功,请重新登录')
      navigate('/login', { replace: true })
    } catch (error) {
      setOpen(false);
      setConfirmLoading(false);
      if (error.message.includes('401')) {
        Modal.warning({
          title: 'Tips',
          content: (
            <p>用户信息已过期, 请登录后重新进行操作 !</p>
          ),
          onOk() {
            logout(false)
            navigate('/login')
          },
          okText: '点击前往登录页面 '
        });
      } else if (error.message.includes('403')) {
        message.warning('用户名或密码错误 !')
      } else if (error.message.includes('404')) {
        message.warning('不存在对应邮箱, 请输入正确邮箱 !')
      } else {
        Modal.warning({
          title: 'Tips',
          content: (
            <p>服务器异常, 请稍后尝试 !</p>
          ),
          onOk() {
            navigate('/user', { replace: true })
          },
          okText: '返回用户中心 '
        });
      }
    }
  };

  const handleCancel = () => {
    if (confirmLoading) return message.info('信息提交中,无法取消')
    setChangeInfo({
      oldUsername: '',
      newUsername: '',
      oldEmail: '',
      newEmail: '',
      oldPassword: '',
      newPassword: ''
    })
    setOpen(false);
    setConfirmLoading(false)
  };

  return (
    <div>
      <Modal
        title="修改信息"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{ disabled: isDisable }}
      >
        <div id='change-data'>
          {/* 根据修改状态呈现不同的内容 */}
          {changeData === 'username' && <div className='change' >
            <span><i>原用户名 : </i><input type="text" placeholder='原用户名' onChange={(e) => {
              setChangeInfo((state) => {
                // 不需要视图更新，直接取对象地址修改就行
                state.oldUsername = e.target.value
                return state
              })
            }} /></span>

            <span><i>新用户名 :</i> <input type="text" placeholder='新用户名' onChange={(e) => {
              setChangeInfo((state) => {
                // 不需要视图更新，直接取对象地址修改就行
                state.newUsername = e.target.value
                return state
              })
            }} /></span>

            <span><i>密码 : </i><input type="password" placeholder='密码' onChange={(e) => {
              setChangeInfo((state) => {
                // 不需要视图更新，直接取对象地址修改就行
                state.oldPassword = e.target.value
                return state
              })
            }} /></span>
          </div>}

          {changeData === 'email' && <div className='change' >
            <span><i>用户名 : </i><input type="text" placeholder='用户名' onChange={(e) => {
              setChangeInfo((state) => {
                // 不需要视图更新，直接取对象地址修改就行
                state.oldUsername = e.target.value
                return state
              })
            }} /></span>

            <span><i>密码 : </i><input type="password" placeholder='密码' onChange={(e) => {
              setChangeInfo((state) => {
                // 不需要视图更新，直接取对象地址修改就行
                state.oldPassword = e.target.value
                return state
              })
            }} /></span>

            {/* eslint-disable-next-line */}
            <span><i>原邮箱 : </i><input type="text" placeholder='原邮箱' onChange={(e) => {
              setChangeInfo((state) => {
                // 不需要视图更新，直接取对象地址修改就行
                state.oldEmail = e.target.value
                return state
              })
            }} /></span>

            {/* eslint-disable-next-line */}
            <span><i>新邮箱 : </i><input type="text" placeholder='新邮箱'
              onChange={(e) => {
                setChangeInfo((state) => {
                  // 不需要视图更新，直接取对象地址修改就行
                  state.newEmail = e.target.value
                  return state
                })
              }} /></span>

          </div>}

          {changeData === 'password' && <div className='change' >
            <span><i>用户名 : </i><input type="text" placeholder='用户名' onChange={(e) => {
              setChangeInfo((state) => {
                // 不需要视图更新，直接取对象地址修改就行
                state.oldUsername = e.target.value
                return state
              })
            }} /></span>

            <span><i>原密码 : </i><input type="password" placeholder='原密码' onChange={(e) => {
              setChangeInfo((state) => {
                // 不需要视图更新，直接取对象地址修改就行
                state.oldPassword = e.target.value
                return state
              })
            }} /></span>

            <span><i>新密码 : </i><input type="password" placeholder='新密码' onChange={(e) => {
              setChangeInfo((state) => {
                // 不需要视图更新，直接取对象地址修改就行
                state.newPassword = e.target.value
                return state
              })
            }} /></span>

            {/* eslint-disable-next-line */}
            <span><i>邮 箱 : </i><input type="text" placeholder='邮箱' onChange={(e) => {
              setChangeInfo((state) => {
                // 不需要视图更新，直接取对象地址修改就行
                state.oldEmail = e.target.value
                return state
              })
            }} /></span>
          </div>}

          <div className='check-info'>
            <button onClick={onCheck} className='check'>验证信息格式</button>
            <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '20px', display: isDisable ? 'none' : 'block' }} />
          </div>

        </div>
      </Modal>
    </div>
  )
}
