import React from 'react'
import logo from '../img/logo.png'
import { Link, useSearchParams } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { Tooltip, Avatar } from 'antd';
import { HomeOutlined, SkinOutlined, RocketOutlined, CoffeeOutlined, DribbbleOutlined, HighlightOutlined, CodeOutlined, CopyOutlined } from '@ant-design/icons';

export default function Navbar() {
  const { logout, currentUsername, userImg } = useContext(AuthContext)
  const onLogout = function () {
    logout()
  }
  const [search] = useSearchParams()
  return (
    <div className='navbar'>
      <div className='container'>
        <Tooltip title="点击返回首页">
          <div className='logo'><Link to='/'><img src={logo} alt="logo" /></Link></div>
        </Tooltip>
        {/* 导航栏标签 */}
          <div className='links'>
            <Link className='link' to='/'><h6 style={{ fontSize: !search.get('cat') ? '18px' : '15px', fontWeight: !search.get('cat') ? 'bolder' : '' }}><HomeOutlined /> 主界面</h6></Link>

            <Link className='link' to='/?cat=art'><h6 style={{ fontSize: search.get('cat') === 'art' ? '18px' : '15px', fontWeight: search.get('cat') === 'art' ? 'bolder' : '' }}><HighlightOutlined /> 艺术</h6></Link>

            <Link className='link' to='/?cat=fashion'><h6 style={{ fontSize: search.get('cat') === 'fashion' ? '18px' : '15px', fontWeight: search.get('cat') === 'fashion' ? 'bolder' : '' }}><SkinOutlined /> 流行</h6></Link>

            <Link className='link' to='/?cat=technology'><h6 style={{ fontSize: search.get('cat') === 'technology' ? '18px' : '15px', fontWeight: search.get('cat') === 'technology' ? 'bolder' : '' }}><RocketOutlined /> 科技</h6></Link>

            <Link className='link' to='/?cat=sport'><h6 style={{ fontSize: search.get('cat') === 'sport' ? '18px' : '15px', fontWeight: search.get('cat') === 'sport' ? 'bolder' : '' }}><DribbbleOutlined /> 体育</h6></Link>

            <Link className='link' to='/?cat=food'><h6 style={{ fontSize: search.get('cat') === 'food' ? '18px' : '15px', fontWeight: search.get('cat') === 'food' ? 'bolder' : '' }}><CoffeeOutlined /> 美食</h6></Link>

            <Link className='link' to='/?cat=acg'><h6 style={{ fontSize: search.get('cat') === 'acg' ? '18px' : '15px', fontWeight: search.get('cat') === 'acg' ? 'bolder' : '' }}><CodeOutlined /> 二次元</h6></Link>

            <Link className='link' to='/?cat=else'><h6 style={{ fontSize: search.get('cat') === 'else' ? '18px' : '15px', fontWeight: search.get('cat') === 'else' ? 'bolder' : '' }}><CopyOutlined /> 其它</h6></Link>

            {/* 头像用户名 */}
            <div className='user-info'>
              <Link to='/user' state={{ userImg, currentUsername }}>
                {
                  userImg && userImg !== 'null' ?
                    <div className='img'>
                      <img src={userImg} alt="头像" />
                    </div> :
                    <Avatar style={{ backgroundColor: '#b9e7e7', verticalAlign: 'middle', display: currentUsername ? 'block' : 'none' }} size={50}>
                      {currentUsername?.[0] || 'U'}
                    </Avatar>
                }
              </Link>
              <Link to='/user' state={{ userImg, currentUsername }}><span style={{ fontSize: '16px', fontWeight: 'bolder', color: 'black' }}>{currentUsername}</span></Link>

              {currentUsername ? <span onClick={onLogout} style={{ fontSize: '12px' }}>退出登录</span> : <Link to='/login'>登录</Link>}
            </div>

            <span className='write'>
              <Link to='/write' className='link'><strong>Write</strong></Link>
            </span>
          </div>
      </div>
    </div >
  )
}
