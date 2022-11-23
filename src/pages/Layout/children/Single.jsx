import React from 'react'
import edit from '../../../img/content/edit.png'
import del from '../../../img/content/del.png'
import Recomment from '../../../components/Recomment'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, Fragment, useContext } from 'react'
import { getPost, deletePost } from '../../../axios/request'
import moment from 'moment'
import { AuthContext } from '../../../context/authContext.js'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Modal, message } from 'antd';
import { loginErrorFn } from '../../../units/errorFn'
import { scrollToTop } from '../../../units/scrollToTop'

export default function Single() {
  useEffect(() => {
    scrollToTop()
  })

  const [post, setPost] = useState({})
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const navigate = useNavigate()
  let postId = useParams().id
  const { currentUsername,logout } = useContext(AuthContext)
  // 确认框的异步确认回调
  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const res = await deletePost(postId)
      if (res.status === 200) {
        message.success('删除成功 !')
        navigate(-1, { replace: true })
      }
    } catch (error) {
      loginErrorFn(error, Modal, message, navigate,logout)
    }
    setOpen(false)
    setConfirmLoading(false)
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const onDelete = async function () {
    setOpen(true)
  }
  useEffect(() => {
    const getEffect = async () => {
      try {
        const res = await getPost(postId)
        if (res.data.length === 0) {
          message.info('无该文章信息, 已返回首页 !')
          return navigate('/', { replace: true })
        }
        setPost(res.data)
      } catch (error) {
        message.warning('获取文章异常,请稍后尝试 !')
      }
    }
    getEffect()
    // eslint-disable-next-line
  }, [postId])

  return (
    <Fragment>
      {/* 确认弹窗 */}
      <Modal
        title="Tips"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{'是否确认删除该文章(无法恢复) !'}</p>
      </Modal>
      <div className='single'>

        {/* 主题内容 */}
        <div className='content'>
          {/* 异步加载post，因此更新后再渲染数据 */}
          {post?.img && <img src={post.img} alt={post?.title} className='opacity' onLoad={(e) => e.target.className = 'unopacity'} />}
          {/* 头像 */}
          <div className='user'>
            {post.userImg === 'null' ? <Avatar size={50} icon={<UserOutlined />} /> : <img src={post?.userImg} alt="" />}
            <div className='info'>
              <span>{post?.username}</span>
              <p>发布时间 : {moment(post?.date).fromNow()}</p>
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
          <p dangerouslySetInnerHTML={{ __html: post?.description }}>
            {/* {domParser(post?.desc)} */}
          </p>
        </div>
        <Recomment cat={post.cat} />
      </div>
    </Fragment>

  )
}
