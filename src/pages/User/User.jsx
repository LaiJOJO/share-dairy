import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { scrollToTop } from '../../units/scrollToTop'
import { AuthContext } from '../../context/authContext'
import { MenuFoldOutlined, MenuUnfoldOutlined, FormOutlined, UserOutlined, FileDoneOutlined, StarOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, PageHeader } from 'antd';
import { useContext } from 'react';
import Footer from '../../components/Footer'

const { Header, Sider, Content } = Layout;

export default function User() {

  // 根据刷新时的路由参数设置高亮key值，防止刷新时会默认1高亮
  const navigate = useNavigate()
  const location = useLocation()
  // 用于根据路由history匹配高亮key
  const setKey = (path) => {
    if (path === '/user/publisheds') {
      return ('2')
    } else if (path === '/user/drafts') {
      return ('3')
    }
    else if (path === '/user/collection') {
      return ('4')
    } else {
      return ('1')
    }
  }
  useEffect(() => {
    scrollToTop()
  })
  const { currentUsername, userImg } = useContext(AuthContext)
  // 根据路由进行匹配返回高亮的key值，对高亮选项进行渲染
  const [defaultSelectedKeys] = useState(() => setKey(location.pathname))
  // 侧边栏折叠
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className='user'>
      <header className='navbar'>
        <PageHeader
          className="site-page-header"
          onBack={() => navigate(-1, { replace: true })}
          title="用户中心"
        />
        <div className='home'><Link to={'/'} className='back' style={{ textDecoration: 'none' }}>返回首页</Link></div>
      </header>

      <div className='user-major'>
        <Layout className='layout'>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo" />
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={[defaultSelectedKeys]}
              items={[
                {
                  key: '1',
                  icon: <UserOutlined />,
                  label: '用户信息',
                  onClick: () => {
                    navigate('/user/')
                  }
                },
                {
                  key: '2',
                  icon: <FileDoneOutlined />,
                  label: '分享文章',
                  onClick: () => {
                    navigate('/user/publisheds')
                  }
                },
                {
                  key: '3',
                  icon: <FormOutlined />,
                  label: '文章草稿',
                  onClick: () => {
                    navigate('/user/drafts')
                  }
                },
                {
                  key: '4',
                  icon: <StarOutlined />,
                  label: '我的收藏',
                  onClick: () => {
                    navigate('/user/collection')
                  }
                },
              ]}
            />
          </Sider>


          <Layout className="site-layout">
            {/* 头像区域 */}
            <Header className="site-layout-background" style={{ paddingLeft: '20px' }} id="site-layout">
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
              })}
              <span className='user-info'>
                {
                  userImg && userImg !== 'null' ?
                    <span className='img'>
                      <img src={userImg} alt="头像" />
                    </span> :
                    <Avatar style={{ backgroundColor: '#b9e7e7', verticalAlign: 'middle' }} size={50}>
                      {currentUsername?.[0] || 'U'}
                    </Avatar>
                }
                <span>{currentUsername}</span>
              </span>
            </Header>

            {/* 显示区域 */}
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>

      </div>
      <Footer />
    </div>
  )
}
