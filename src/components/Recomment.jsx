import React from 'react'
import { useState,useEffect} from 'react'
import { getPosts } from '../axios/request'
import {Link} from 'react-router-dom'

export default function Recomment({cat}) {
  const [posts, setPost] = useState([])
  useEffect(() => {
    const getEffect = async () => {
      try {
        const res = await getPosts(cat)
        setPost(res.data)
      } catch (error) {
        alert(error)
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
              <img src={require('../../public/uploads/'+post?.img)} alt="" />
              <h2>{post.title}</h2>
              <Link to={`/post/${post?.id}`}><button>Get More</button></Link>
            </div>
          )
        })
      }
    </div >
  )
}
