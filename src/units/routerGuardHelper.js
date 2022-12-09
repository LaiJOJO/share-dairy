import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { checkPath, checkAuth } from '../units/routesReg.js'

// 全局导航守卫函数，起主要拦截作用,routes是路由表
export const guard = function (navigate, location) {
  const { pathname } = location;

  //正则匹配没有找到路由，跳转404
  if (!checkPath(pathname)) {
    navigate("/404");
    return false;
  }

  // 根据路由表的自定义属性判断是否需要权限登录,true代表需要登录
  if (checkAuth(pathname)) {
    const token = JSON.parse(localStorage.getItem("USER"))
    if (!token) {
      Modal.confirm({
        title: 'Tips',
        icon: <ExclamationCircleOutlined />,
        content: '请登录后继续操作',
        okText: '前往登录页面',
        onOk: () => {
          navigate('/login', { replace: true });
        },
        cancelText: '返回上一页',
        onCancel: () => {
          navigate(-1, { replace: true })
        }
      });

      return false;
    }
  }
  return true;
}