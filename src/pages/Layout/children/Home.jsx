import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import querystring from 'query-string'
import { useEffect } from 'react'
import { getPosts } from '../../../axios/request'
import domParser from '../../../units/dom-parser.js'
import { scrollToTop } from '../../../units/scrollToTop.js'
import { message, Pagination } from 'antd'
import Lazyload from 'react-lazyload'

export default function Home() {
  useEffect(() => {
    scrollToTop()
  })
  const [posts, setPost] = useState([])
  const [postsLength, setLength] = useState(1)
  // 每页文章数量
  const [pageSize] = useState(6)
  const location = useLocation()
  let cat = querystring.parse(location.search).cat
  // 分页获取文章,每页6篇
  const getPagePosts = async function (cat, page, pageSize) {
    try {
      const res = await getPosts(cat, page, pageSize)
      setPost(res.data.posts)
      setLength(res.data.dataLength)
    } catch (error) {
      message.warning('网络异常,请稍后尝试 !')
    }
  }
  // hook不能使用async修饰
  useEffect(() => {
    getPagePosts(cat, 1, pageSize)
  }, [cat, pageSize])
  // 跳转页触发函数
  const onChange = (pageNumber) => {
    // 页面改变重新请求数据
    getPagePosts(cat, pageNumber, pageSize)
  };
  return (
    <div className='home'>
      {
        (posts.length !== 0) && (
          <ul className='posts'>
            {
              posts.map(post => {
                return (
                  <li className='post' key={post?.id}>
                    <div className='img'>
                      <Lazyload className='wid'>
                        {/* {post?.img && <img className='opacity' src={require('../../../../public/uploads/' + post?.img)} alt={post?.title} onLoad={(e) => e.target.className = 'unopacity'} />} */}
                        {post?.img && <img className='opacity' src={post?.img} alt={post?.title} onLoad={(e) => e.target.className = 'unopacity'} />}
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
        )
      }
      {/* 每页6篇 */}
      <div className='pages' style={{ margin: '0 auto' }}>
        <Pagination showQuickJumper defaultCurrent={1} total={postsLength} onChange={onChange} pageSize={6} />
      </div>
    </div>
  )

}
