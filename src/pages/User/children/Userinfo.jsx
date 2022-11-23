import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../../context/authContext'
import { getUserInfo, getUserRecommentPosts } from '../../../axios/request'
import { Modal, message, Avatar,Tooltip,Empty } from 'antd'
import domParser from '../../../units/dom-parser'
import ChangeUser from '../../../components/ChangeUser'
import ChangeImg from '../../../components/ChangeImg'
import { loginErrorFn } from '../../../units/errorFn'

export default function Userinfo() {
  const { currentUsername, userImg,logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const [recommentPosts, setRecommentPosts] = useState([])
  // 修改信息
  const [open, setOpen] = useState(false)
  const [changeData, setChangeData] = useState('password')
  // 修改头像
  const [imgopen, setImgopen] = useState(false)

  useEffect(() => {
    const getEffect = async () => {
      try {
        const userInfo = await getUserInfo(currentUsername)
        const recommentPosts = await getUserRecommentPosts(userInfo.data.id)
        setUserInfo(userInfo.data)
        setRecommentPosts(recommentPosts.data)
      } catch (error) {
        loginErrorFn(error, Modal, message, navigate,logout)
      }
    }
    getEffect()
    // eslint-disable-next-line
  }, [currentUsername])

  // 修改用户信息触发弹窗
  const changeUserHandle = (changeData) => {
    setChangeData(changeData)
    setOpen(true)
  }

  return (
    <div className='user-info'>
      {/* 修改用户信息弹窗 */}
      <ChangeUser setOpen={setOpen} open={open} changeData={changeData} />
      <ChangeImg setImgopen={setImgopen} imgopen={imgopen}/>

      <div className='info'>
        {/* 头像 */}
        <Tooltip title="点击修改头像" onClick={()=>setImgopen(true)}>
          {
            userImg && userImg !== 'null' ?
              <span className='img'>
                <img src={ userImg} alt="头像" />
              </span> :
              <Avatar shape='square' style={{ backgroundColor: '#b9e7e7', verticalAlign: 'middle' ,cursor:"pointer"}} size={100}>
                {currentUsername || 'U'}
              </Avatar>
          }
        </Tooltip>
        <div className='username'>
          <span>用户名 : <span>{currentUsername}</span><i onClick={() => changeUserHandle('username')}>修改用户名</i></span>
          <span>邮箱 : <span>{userInfo?.email}</span><i onClick={() => changeUserHandle('email')}>修改邮箱</i></span>
          <span>密码 : <span> *************</span><i onClick={() => changeUserHandle('password')}>修改密码</i></span>
        </div>
      </div>
      <div className='user-articles'>
        <h1>推荐最新文章</h1>
        {/* 推荐文章部分, 有文章才显示 */}
        {
          recommentPosts.length > 0 ?
            <div className='articles'>
              {
                recommentPosts.map(item => {
                  return (
                    <Link to={`/post/${item?.id}`} key={item.id} style={{ textDecoration: 'none' }}>
                      <div className="article">
                        <div className='img'>
                          {item?.img && <img src={item?.img} alt={item.title} className='opacity' onLoad={(e) => e.target.className = 'unopacity'} />}
                        </div>
                        <div className='post'>
                          <h6>{item.title}</h6>
                          <p>{domParser(item.description)}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })
              }
            </div>
            : <div className="no-posts"><Empty/></div>}
      </div>
    </div>
  )
}
