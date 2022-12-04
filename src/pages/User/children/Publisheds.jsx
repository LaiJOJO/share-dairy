import React, { useCallback } from 'react'
import { Pagination, Modal, message, Empty } from 'antd'
import { useContext, useEffect, useState } from 'react';
import domParser from '../../../units/dom-parser';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { getUserPublisheds } from '../../../axios/request';
import { loginErrorFn } from '../../../units/errorFn';

export default function Publisheds() {
  const navigate = useNavigate()
  const { currentUsername, logout } = useContext(AuthContext)
  // 请求数据函数
  const getRequest = useCallback(async (username, page) => {
    try {
      // 传入的是页数，数据索引要-1开始获取
      const res = await getUserPublisheds(username, page - 1)
      setPublisheds(res.data.publisheds)
      setPublishedsLength(res.data.length)
    } catch (error) {
      loginErrorFn(error, Modal, message, navigate, logout)
    }
  }, [navigate,logout])
  // 跳转页触发函数
  const onChange = (pageNumber) => {
    // 页面改变重新请求数据
    getRequest(currentUsername, pageNumber)
  };
  const [publisheds, setPublisheds] = useState([])
  const [publishedsLength, setPublishedsLength] = useState(1)
  // 初始化请求第一页数据
  useEffect(() => {
    getRequest(currentUsername, 1)
  }, [currentUsername, getRequest])
  return (
    <div className='publisheds'>
      <span><h1>已发布文章</h1></span>
      {
        publisheds.length > 0 ?
          <div className='articles'>
            {
              publisheds.map(item => {
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
          : <div className="no-posts"><Empty /></div>}
      <div className='pages' style={{ margin: '0 auto' }}>
        <Pagination showQuickJumper defaultCurrent={1} total={publishedsLength} onChange={onChange} pageSize={3} showSizeChanger={false}/>
      </div>
    </div>
  )
}
