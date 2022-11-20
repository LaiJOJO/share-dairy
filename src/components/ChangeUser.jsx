import { message, Modal } from 'antd';
import React, { useState,useContext,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { postChangeUsername, postChangeEmail, postChangePassword } from '../axios/request';
import { AuthContext } from '../context/authContext';

export default function ChangeUser(props) {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('');
  const [changeInfo, setChangeInfo] = useState({
    oldUsername: '',
    newUsername: '',
    oldEmail: '',
    newEmail: '',
    oldPassword: '',
    newPassword: ''
  })

  const { open, setOpen, changeData } = props

  // 动态判断修改邮箱，用户名还是密码,动态保存更改的信息
  function changeStates(changeData) {
    if (changeData === 'username') {
      return setModalText(
        <div className='change' >
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
        </div>
      )
    } else if (changeData === 'email') {
      return setModalText(
        <div className='change' >
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
          <span><i>原邮箱 : </i><input type="text" placeholder='原邮箱' onChange={(e) => {
            setChangeInfo((state) => {
              // 不需要视图更新，直接取对象地址修改就行
              state.oldEmail = e.target.value
              return state
            })
          }} /></span>
          <span><i>新邮箱 : </i><input type="text" placeholder='新邮箱'
            onChange={(e) => {
              setChangeInfo((state) => {
                // 不需要视图更新，直接取对象地址修改就行
                state.newEmail = e.target.value
                return state
              })
            }} /></span>
        </div>
      )
    } else {
      return setModalText(
        <div className='change' >
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
          <span><i>邮 箱 : </i><input type="text" placeholder='邮箱' onChange={(e) => {
            setChangeInfo((state) => {
              // 不需要视图更新，直接取对象地址修改就行
              state.oldEmail = e.target.value
              return state
            })
          }} /></span>
        </div>
      )
    }
  }

  useEffect(() => {
    changeStates(changeData)
  }, [changeData])

  // 点击提交时根据修改信息进行分类请求
  const handleOk = async () => {
    setModalText('信息提交中......');
    setConfirmLoading(true);
    // 发起ajax请求
    try {
      // 根据changeData的类型来确定修改什么信息,保存到formData中进行提交
      if (changeData === 'username') {
        const formData = ({ oldUsername: changeInfo.oldUsername, newUsername: changeInfo.newUsername, password: changeInfo.oldPassword })
        await postChangeUsername(formData)
      }
      else if (changeData === 'email') {
        const formData = ({ oldEmail: changeInfo.oldEmail, newEmail: changeInfo.newEmail, password: changeInfo.oldPassword, username: changeInfo.oldUsername })
        await postChangeEmail(formData)
      }
      else {
        const formData = ({ username: changeInfo.oldUsername, newPassword: changeInfo.newPassword, oldPassword: changeInfo.oldPassword, email: changeInfo.oldEmail })
        await postChangePassword(formData)
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
            navigate(-1, { replace: true })
          },
          okText: '返回上一页 '
        });
      }
      changeStates(changeData)
    }
  };

  const handleCancel = () => {
    if (confirmLoading) return message.info('信息提交中,无法取消')
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
      >
        <div id='change-data'>{modalText}</div>
      </Modal>
    </div>
  )
}
