import React from 'react'
import edit from '../../../img/content/edit.png'
import del from '../../../img/content/del.png'
import Recomment from '../../../components/Recomment'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import { getPost, deletePost } from '../../../axios/request'
import moment from 'moment'
import { useContext } from 'react'
import { AuthContext } from '../../../context/authContext.js'
import domParser from '../../../units/dom-parser'

export default function Single() {
  const [post, setPost] = useState({})
  const navigate = useNavigate()
  let postId = useParams().id
  const { currentUsername } = useContext(AuthContext)
  const onDelete = async function () {
    try {
      const res = await deletePost(postId)
      if (res.status === 200) {
        navigate(-1)
      }
    } catch (error) {
      alert(error.response.data)
    }
  }
  useEffect(() => {
    const getEffect = async () => {
      try {
        const res = await getPost(postId)
        setPost(res.data)
      } catch (error) {
        alert(error)
      }
    }
    getEffect()
  }, [postId])
  return (
    <div className='single'>
      <div className='content'>
          <img src={require('../../../../public/uploads/' + post?.img)} alt={post?.title} />
        {/* 头像 */}
        <div className='user'>
          {post.userImg !== 'null' && <img src={post?.userImg} alt="" />}
          <div className='info'>
            <span>{post?.username}</span>
            <p>Posted {moment(post?.date).fromNow()}</p>
          </div>
          {
            currentUsername === post?.username && (
              <div className="edit">
                <Link to={`/write?edit=${post?.id}`} state={post}>
                  <img src={edit} alt="edit" title='edit' />
                </Link>
                <img src={del} alt="delete" title='delete' onClick={onDelete} />
              </div>
            )
          }
        </div>
        <h1>{post?.title}</h1>
        <p>
          {domParser(post?.desc)}
        </p>
      </div>
      <Recomment cat={post.cat} />
    </div>
  )
}
