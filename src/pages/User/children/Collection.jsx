import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import domParser from '../../../units/dom-parser'
import { Empty, Pagination, Modal, message } from 'antd'
import { getCollections } from '../../../axios/request'
import { AuthContext } from '../../../context/authContext'
import { loginErrorFn } from '../../../units/errorFn'

export default function Collection() {
  const { currentUsername, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [collections, setCollections] = useState([])
  const [collectionsLength, setCollectionsLength] = useState(1)
  // 请求数据函数
  const getRequest = useCallback(async (username, page, pageSize = 3) => {
    try {
      // 传入的是页数，数据索引要-1开始获取
      const res = await getCollections(username, page - 1, pageSize)
      setCollections(res.data.collections)
      setCollectionsLength(res.data.length)
    } catch (error) {
      loginErrorFn(error, Modal, message, navigate, logout)
    }
  }, [navigate, logout])

  useEffect(() => {
    // 初始化请求第一页数据
    getRequest(currentUsername, 1)
  }, [currentUsername, getRequest])

  // 下一页
  const onChange = (pageNumber) => {
    getRequest(currentUsername, pageNumber)
  }

  return (
    <div className='collection'>
      <span><h1>我的收藏</h1></span>
      {
        collections.length > 0 ?
          <div className='articles'>
            {
              collections.map(item => {
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
        <Pagination showQuickJumper defaultCurrent={1} total={collectionsLength} onChange={onChange} pageSize={3} showSizeChanger={false}/>
      </div>
    </div>
  )
}
