import React from 'react'
import { useState, useEffect } from 'react'
import { getRecommentPosts } from '../axios/request'
import { Link } from 'react-router-dom'
import LazyLoad from 'react-lazyload'

export default function Recomment({ cat }) {
  const [posts, setPost] = useState([])
  useEffect(() => {
    const getEffect = async () => {
      try {
        const res = await getRecommentPosts(cat)
        setPost(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getEffect()
  }, [cat])
  return (
    <div className='recomment'>
      <h1>推荐文章</h1>
      {
        posts.map(post => {
          return (
            <div className='post' key={post?.id}>
              <LazyLoad>
                <img src={post?.img} alt={post?.title} className='opacity' onLoad={(e) => e.target.className = 'unopacity'} />
              </LazyLoad>
              <h2>{post.title}</h2>
              <Link to={`/post/${post?.id}`}><button>查看文章</button></Link>
            </div>
          )
        })
      }
    </div >
  )
}
