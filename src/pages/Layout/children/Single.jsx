import React from 'react'
import Recomment from '../../../components/Recomment'
import Comment from '../../../components/Comment'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, Fragment, useContext } from 'react'
import { getPost, deletePost, postAddCollect, postAddLike, getCollectStatus, getLikeStatus, postDelCollect, postDelLike } from '../../../axios/request'
import moment from 'moment'
import { AuthContext } from '../../../context/authContext.js'
import { UserOutlined, EditTwoTone, DeleteTwoTone, StarTwoTone, LikeTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Modal, message, Tooltip, Image } from 'antd';
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
    return () => {
      Modal.destroyAll()
    }
    // eslint-disable-next-line
  }, [postId])

  const [isLike, setIsLike] = useState(false)
  const [isCollect, setIsCollect] = useState(false)
  const [post, setPost] = useState({})
  const [visible, setVisible] = useState(false)
  const [previewSrc, setPreviewSrc] = useState('error')
  const navigate = useNavigate()
  const { currentUsername, logout } = useContext(AuthContext)
  // 确认删除框的确认回调
  const onDelete = async function () {
    Modal.confirm({
      title: 'Tips',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认删除, 无法恢复 !',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deletePost(postId)
          if (res.status === 200) {
            message.success('删除成功 !')
            navigate(-1, { replace: true })
          }
        } catch (error) {
          loginErrorFn(error, Modal, message, navigate, logout)
        }
      },
    })
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
      message.info(res.data.message)
      setIsLike(false)
    } catch (error) {
      interactErrorFn(error, Modal, message, navigate)
    }
  }
  const onDiscollect = async function () {
    try {
      const res = await postDelCollect(postId)
      message.info(res.data.message)
      setIsCollect(false)
    } catch (error) {
      interactErrorFn(error, Modal, message, navigate)
    }
  }

  const onImgPreview = function (e) {
    if (e.target.nodeName === 'IMG') {
      setVisible(true)
      setPreviewSrc(e.target.src)
    }
  }
  return (
    <Fragment>
      {/* 预览图，默认隐藏 */}
      <Image
        width={200}
        style={{
          display: 'none',
        }}
        src={previewSrc}
        preview={{
          visible,
          scaleStep: 0.5,
          src:  previewSrc,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />

      <div className='single'>

        <div className='single-details'>
          {/* 主题内容 */}
          <div className='content'>
            {/* 异步加载post，因此更新后再渲染数据 */}
            {post?.img && <img src={post.img} alt={post?.title} className='opacity img' onLoad={(e) => e.target.className = 'unopacity img'} onClick={onImgPreview}/>}
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
            <p className='desc' onClick={onImgPreview} dangerouslySetInnerHTML={{ __html: post?.description }}>
            </p>
          </div>
          {/* 推荐列表 */}
          <Recomment cat={post.cat} />
        </div>
        <Comment postId={postId} publisher={post.username} />
      </div>
    </Fragment>
  )
}
