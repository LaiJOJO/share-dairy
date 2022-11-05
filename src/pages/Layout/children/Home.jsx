import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import querystring from 'query-string'
import { useEffect } from 'react'
import { getPosts } from '../../../axios/request'
import domParser from '../../../units/dom-parser.js'

export default function Home() {
  const [posts, setPost] = useState([])
  const location = useLocation()
  let cat = querystring.parse(location.search).cat
  // hook不能使用async修饰
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
    <div className='home'>
      <ul className='posts'>
        {
          posts.map(post => {
            return (
              <li className='post' key={post?.id}>
                <div className='img'>
                  <img src={require('../../../../public/uploads/'+post?.img)} alt={post?.title} />
                </div>
                <div className='content'>
                  <Link className='link' to={`/post/${post?.id}`}><h1>{post?.title}</h1></Link>
                  <p>{domParser(post?.desc)}</p>
                  <button>Get More</button>
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )

}
