// 登录错误调用该函数前往登录页面
export const loginErrorFn = function (error, Modal, message, navigate,logout) {
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
    message.warning('非作者无法进行操作 !')
  } else {
    Modal.warning({
      title: 'Tips',
      content: (
        <p>操作异常, 请稍后尝试 !</p>
      ),
      onOk() {
        navigate(-1, { replace: true })
      },
      okText: '返回上一页 '
    });
  }
}

// 修改信息错误函数
export const changeErrorFn = function(error,Modal,message,navigate,setErr){
  // 收集错误信息，显示在页面上
  if (error.message.includes('409')) {
    setErr('用户名已存在或该邮箱已绑定其他用户 !')
    Modal.confirm({
      title: 'Tips',
      content: (
        <p>用户名已存在或该邮箱已绑定其他用户, 是否前往登录 ?</p>
      ),
      onOk() {
        navigate('/login')
      },
      okText: '点击前往登录页面 ',
      cancelText: '取消'
    });
  }else{
    setErr(error.message)
    message.warning('服务器异常, 请稍后尝试 !')
  } 
}
