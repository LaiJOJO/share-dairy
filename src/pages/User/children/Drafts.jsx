import React from 'react'
import { Pagination,Empty,Modal,message } from 'antd'
import { useContext, useEffect, useState } from 'react';
import domParser from '../../../units/dom-parser';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { getUserDrafts } from '../../../axios/request';
import { useCallback } from 'react';

export default function Drafts() {
  const navigate = useNavigate()
  // 请求数据函数
  const getRequest = useCallback(async (username, page) => {
    try {
      // 传入的是页数，数据索引要-1开始获取
      const res = await getUserDrafts(username, page - 1)
      setPublisheds(res.data.publisheds)
      setPublishedsLength(res.data.length)
    } catch (error) {
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
        message.warning('无权限操作用户信息 !')
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
    }
  },[navigate])
  // 跳转页触发函数
  const onChange = (pageNumber) => {
    // 页面改变重新请求数据
    getRequest(currentUsername, pageNumber)
  };
  const { currentUsername } = useContext(AuthContext)
  const [publisheds, setPublisheds] = useState([])
  const [publishedsLength, setPublishedsLength] = useState(1)
  useEffect(() => {
    // 初始化请求第一页数据
    getRequest(currentUsername, 1)
  }, [currentUsername,getRequest])
  return (
    <div className='drafts'>
      <span><h1>我的草稿</h1></span>
      {
        publisheds.length > 0 ?
          <div className='articles'>
            {
              publisheds.map(item => {
                return (
                  <Link to={`/draft/${item.id}`} key={item.id} style={{ textDecoration: 'none' }} state={item}>
                    <div className="article">
                      <div className='img'>
                        {item?.img && <img src={ item?.img} alt={item.title} className='opacity' onLoad={(e)=>e.target.className='unopacity'}/>}
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
      <div className='pages' style={{ margin: '0 auto' }}>
        <Pagination showQuickJumper defaultCurrent={1} total={publishedsLength} onChange={onChange} pageSize={3} />
      </div>
    </div>
  )
}
