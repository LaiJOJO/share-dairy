import React from 'react'
import Recomment from '../../../components/Recomment'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, Fragment, useContext } from 'react'
import { getPost, deletePost, postAddCollect, postAddLike, getCollectStatus, getLikeStatus, postDelCollect, postDelLike } from '../../../axios/request'
import moment from 'moment'
import { AuthContext } from '../../../context/authContext.js'
import { UserOutlined, EditTwoTone, DeleteTwoTone, StarTwoTone, LikeTwoTone } from '@ant-design/icons';
import { Avatar, Modal, message, Tooltip } from 'antd';
import { loginErrorFn, interactErrorFn } from '../../../units/errorFn'
import { scrollToTop } from '../../../units/scrollToTop'

export default function Single() {
  const checkLikeAndCollect = async function (postId) {
    try {
      const likeRes = await getLikeStatus(postId)
      const collectRes = await getCollectStatus(postId)
      setIsLike(likeRes.data.isLike)
      setIsCollect(collectRes.data.isCollect)
    } catch (error) {
      console.log(error)
    }
  }
  let postId = useParams().id
  // 文章id改变重置滚动条，发起点赞收藏状态请求，警告非法文章id
  useEffect(() => {
    scrollToTop()
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
    checkLikeAndCollect(postId)
    // eslint-disable-next-line
  }, [postId])

  const [isLike, setIsLike] = useState(false)
  const [isCollect, setIsCollect] = useState(false)
  const [post, setPost] = useState({})
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const navigate = useNavigate()
  const { currentUsername, logout } = useContext(AuthContext)
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
      loginErrorFn(error, Modal, message, navigate, logout)
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

  // 点赞收藏
  const onLike = async function () {
    try {
      const res = await postAddLike(postId)
      message.success(res.data.message)
      setIsLike(true)
    } catch (error) {
      interactErrorFn(error, Modal, message, navigate)
    }
  }
  const onCollect = async function () {
    try {
      const res = await postAddCollect(postId)
      message.success(res.data.message)
      setIsCollect(true)
    } catch (error) {
      interactErrorFn(error, Modal, message, navigate)
    }
  }
  // 取消点赞收藏
  const onDislike = async function () {
    try {
      const res = await postDelLike(postId)
      message.success(res.data.message)
      setIsLike(false)
    } catch (error) {
      interactErrorFn(error, Modal, message, navigate)
    }
  }
  const onDiscollect = async function () {
    try {
      const res = await postDelCollect(postId)
      message.success(res.data.message)
      setIsCollect(false)
    } catch (error) {
      interactErrorFn(error, Modal, message, navigate)
    }
  }

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
            <div className="left">
              {post.userImg === 'null' ? <Avatar size={50} icon={<UserOutlined />} /> : <img src={post?.userImg} alt="" />}
              <div className='info'>
                <span>{post?.username}</span>
                <p>发布时间 : {moment(post?.date).fromNow()}</p>
              </div>
              {
                currentUsername === post?.username && (
                  <div className="edit">
                    <Link to={`/write?edit=${post?.id}`} state={post}>
                      <Tooltip title="点击前往编辑" >
                        <EditTwoTone />
                      </Tooltip>
                    </Link>
                    <Tooltip title="点击删除文章" >
                      <DeleteTwoTone onClick={onDelete} />
                    </Tooltip>
                  </div>
                )
              }
            </div>
            <div className="right">
              {
                isLike ?
                  <div className='dislike' onClick={onDislike}>
                    <Tooltip title="取消点赞">
                      <LikeTwoTone />
                    </Tooltip>
                  </div> :
                  <div className='like' onClick={onLike}>
                    <Tooltip title="点赞">
                      <LikeTwoTone />
                    </Tooltip>
                  </div>
              }
              {
                isCollect ? <div className='discollect' onClick={onDiscollect}>
                  <Tooltip title="取消收藏">
                    <StarTwoTone />
                  </Tooltip>
                </div> :
                  <div className='collect' onClick={onCollect}>
                    <Tooltip title="收藏">
                      <StarTwoTone />
                    </Tooltip>
                  </div>
              }
            </div>
          </div>
          <h1>{post?.title}</h1>
          <p dangerouslySetInnerHTML={{ __html: post?.description }}>
          </p>
        </div>
        <Recomment cat={post.cat} />
      </div>
    </Fragment>

  )
}
