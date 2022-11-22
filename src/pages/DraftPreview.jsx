import React from 'react'
import edit from '../img/content/edit.png'
import del from '../img/content/del.png'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, Fragment, useContext } from 'react'
import { getDraft, deletePost } from '../axios/request'
import moment from 'moment'
import { AuthContext } from '../context/authContext.js'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Modal, message, PageHeader, Tooltip } from 'antd';
import { loginErrorFn } from '../units/errorFn'
import { scrollToTop } from '../units/scrollToTop'
import Footer from '../components/Footer'

export default function Single() {
  useEffect(() => {
    scrollToTop()
  })

  const [post, setPost] = useState({})
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const navigate = useNavigate()
  let draftId = useParams().id
  const { currentUsername } = useContext(AuthContext)
  // 确认框的异步确认回调
  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const res = await deletePost(draftId)
      if (res.status === 200) {
        message.success('删除成功 !')
        navigate(-1, { replace: true })
      }
    } catch (error) {
      loginErrorFn(error, Modal, message, navigate)
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
        const res = await getDraft(draftId)
        if (res.data.length === 0) {
          message.info('无该文章信息, 已返回首页 !')
          return navigate('/', { replace: true })
        }
        setPost(res.data)
      } catch (error) {
        if (error.message.includes('401')) {
          Modal.warning({
            title: 'Tips',
            content: (
              <p>用户信息已过期, 请登录后重新进行操作 !</p>
            ),
            onOk() {
              window.localStorage.removeItem('USER')
              navigate('/login')
            },
            okText: '点击前往登录页面 '
          });
        } else {
          Modal.warning({
            title: 'Tips',
            content: (
              <p>获取文章异常,请稍后尝试 !</p>
            ),
            onOk() {
              navigate(-1, { replace: true })
            },
            okText: '返回上一页 '
          });
        }
      }
    }
    getEffect()
    // eslint-disable-next-line
  }, [draftId])

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
        <p>{'是否确认删除该文章 ( 无法恢复 ) !'}</p>
      </Modal>
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
          {post?.img && <img src={post.img} alt={post?.title} className='opacity' onLoad={(e) => e.target.className = 'unopacity'} />}
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
                      <img src={edit} alt="edit" title='编辑' />
                    </Link>
                  </Tooltip>
                  <Tooltip title="点击删除草稿!" >
                    <img src={del} alt="delete" title='删除' onClick={onDelete} />
                  </Tooltip>
                </div>
              )
            }
          </div>
          <h1>{post?.title}</h1>
          <p dangerouslySetInnerHTML={{ __html: post?.description }}>
          </p>
        </div>
      </div>
      <Footer />
    </Fragment>

  )
}