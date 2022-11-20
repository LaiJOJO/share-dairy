// 登录错误调用该函数前往登录页面
export const loginErrorFn = function (error, Modal, message, navigate) {
  if (error.message.includes('401')) {
    Modal.warning({
      title: 'Tips',
      content: (
        <p>用户信息已过期, 请登录后重新进行操作 !</p>
      ),
      onOk() {
        window.localStorage.removeItem('USER')
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