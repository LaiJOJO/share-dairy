import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, Fragment, useContext } from 'react'
import { getDraft, deletePost } from '../axios/request'
import moment from 'moment'
import { AuthContext } from '../context/authContext.js'
import { UserOutlined, EditTwoTone, DeleteTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';
import { Avatar, Modal, message, PageHeader, Tooltip, Image } from 'antd';
import { loginErrorFn } from '../units/errorFn'
import { scrollToTop } from '../units/scrollToTop'
import Footer from '../components/Footer'

export default function Single() {

  const [post, setPost] = useState({})
  const [visible, setVisible] = useState(false)
  const [previewSrc, setPreviewSrc] = useState('error')
  const navigate = useNavigate()
  let draftId = useParams().id
  const { currentUsername, logout } = useContext(AuthContext)
  // 确认框的确认回调
  const onDelete = async function () {
    Modal.confirm({
      title: 'Tips',
      icon: <ExclamationCircleOutlined />,
      content: '是否确认删除, 无法恢复 !',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deletePost(draftId)
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
  useEffect(() => {
    const getEffect = async () => {
      try {
        const res = await getDraft(draftId)
        if (res.data.length === 0) {
          message.info('无该文章信息, 已返回首页 !')
          return navigate('/', { replace: true })
        }
        setPost(res.data)
      } catch (error) {
        loginErrorFn(error, Modal, message, navigate, logout)
      }
    }
    getEffect()
    scrollToTop()
    // eslint-disable-next-line
  }, [draftId])

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
          src: previewSrc,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />

      <div className='draft-preview'>
        <div className='header'>
          <PageHeader
            className="site-page-header"
            onBack={() => navigate(-1, { replace: true })}
            title="预览草稿"
          />
        </div>
        {/* 主题内容 */}
        <div className='content'>
          {/* 异步加载post，因此更新后再渲染数据 */}
          {post?.img && <img src={post.img} alt={post?.title} className='opacity img' onLoad={(e) => e.target.className = 'unopacity img'} onClick={onImgPreview}/>}
          {/* 头像 */}
          <div className='user'>
            {post.userImg === 'null' ? <Avatar size={50} icon={<UserOutlined />} /> : <img src={post?.userImg} alt="" />}
            <div className='info'>
              <span>{post?.username}</span>
              <p>创建时间 : {moment(post?.date).fromNow()}</p>
            </div>
            {
              currentUsername === post?.username && (
                <div className="edit">
                  <Tooltip title="点击前往编辑" >
                    <Link to={`/write?edit=${post?.id}`} state={post}>
                      <EditTwoTone />
                    </Link>
                  </Tooltip>
                  <Tooltip title="点击删除草稿!" >
                    <DeleteTwoTone onClick={onDelete} />
                  </Tooltip>
                </div>
              )
            }
          </div>
          <h1>{post?.title}</h1>
          <p className='desc' onClick={onImgPreview} dangerouslySetInnerHTML={{ __html: post?.description }}>
          </p>
        </div>
      </div>
      <Footer />
    </Fragment>

  )
}
