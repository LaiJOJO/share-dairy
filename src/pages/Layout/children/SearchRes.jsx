import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import domParser from '../../../units/dom-parser'
import { scrollToTop } from '../../../units/scrollToTop.js'
import { Pagination, message,Empty } from 'antd'
import { getSearchPosts } from '../../../axios/request'
import Lazyload from 'react-lazyload'

export default function SearchRes() {
  useEffect(() => {
    scrollToTop()
  })
  const [search] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [postsLength, setPostsLength] = useState(1)

  // 发起搜索请求的函数
  const getSearch = async (keyword, page, pageSize) => {
    try {
      const res = await getSearchPosts(keyword, page, pageSize)
      setPosts(res.data.posts)
      setPostsLength(res.data.dataLength)
    } catch (error) {
      message.warning('网络异常,请稍后尝试 !')
    }
  }

  // search参数变化时发请求，获得首页6条数据
  useEffect(() => {
    getSearch(search.get('keyword'), 1, 6)
  }, [search])
  // 修改页码时也发请求获取页面对应数据
  const onChange = (pageNumber) => {
    getSearch(search.get('keyword'), pageNumber, 6)
  }
  return (
    <div className='search-res'>
      {
        (posts.length !== 0) ? (
          <ul className='posts'>
            {
              posts.map(post => {
                return (
                  <li className='post' key={post?.id}>
                    <div className='img'>
                      <Lazyload className='wid'>
                        {post?.img && <img className='opacity' src={ post?.img} alt={post?.title} onLoad={(e) => e.target.className = 'unopacity'} />}
                      </Lazyload>
                    </div>
                    <div className='content'>
                      <Link className='link' to={`/post/${post?.id}`}><h1>{post?.title}</h1></Link>
                      <p>{domParser(post?.description)}</p>
                      <Link className='link' to={`/post/${post?.id}`}><button>Get More</button></Link>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        ) : <div className="no-posts"><Empty/></div>
      }
      {/* 每页6篇 */}
      <div className='pages' style={{ margin: '0 auto' }}>
        <Pagination showQuickJumper defaultCurrent={1} total={postsLength} onChange={onChange} pageSize={6} />
      </div>
    </div>
  )
}

