import React, { useState, useEffect, useContext } from 'react'
import { Pagination, Input, Avatar, message, Modal, Empty, PageHeader } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import { getCommentReply, getComment, postAddReply, postDelReply } from '../axios/request'
import { checkSensitiveWords, sensitiveWordsParser } from '../units/sensitiveWordsReg'
import LazyLoad from 'react-lazyload'
import moment from 'moment'
import { scrollToTop } from '../units/scrollToTop'
import { AuthContext } from '../context/authContext'
import { commentErrorFn } from '../units/errorFn'
const { TextArea } = Input

export default function CommentReply() {
  const navigate = useNavigate()
  const commentId = useParams().id
  const { currentUsername } = useContext(AuthContext)
  const publisher = useLocation().state.publisher
  const [commentText, setCommentText] = useState('')
  const [commentInfo, setCommentInfo] = useState({})
  const [placeholder, setPlaceholder] = useState('点击评论进行指定回复  ^_^ ')
  const [replyLength, setReplyLength] = useState(1)
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  // 被回复人用户名和id
  const [replyTarget, setReplyTarget] = useState(null)
  // 获取二级评论回复
  const [allReply, setAllReply] = useState([])
  const onGetCommentReply = async function (commentId, page, pageSize) {
    try {
      const res = await getCommentReply(commentId, page - 1, pageSize)
      setReplyLength(res.data.replyLength)
      setAllReply(res.data.replyInfo)
    } catch (error) {
      commentErrorFn(error, Modal, message, navigate)
    }
  }
  // 获取评论的信息，评论人名称等
  const onGetComment = async function (commentId) {
    try {
      const res = await getComment(commentId)
      setCommentInfo(res.data)
    } catch (error) {
      commentErrorFn(error, Modal, message, navigate)
    }
  }
  // 切换回复评论页码获取更多评论
  const onGetMoreComments = function (pageNumber) {
    onGetCommentReply(commentId, pageNumber, 6)
    setCurrentPageNumber(pageNumber)
  }
  // 发送回复
  const onComment = async function () {
    let str = commentText.trim().replace(/[\r\n]{2,}/g, "\n")
    if (str === '' || str === '\n') return
    if (checkSensitiveWords(str)) {
      setCommentText(sensitiveWordsParser(str))
      return message.warning('包含敏感词汇')
    }
    const formdata = {
      commentId,
      commentText: str,
      date: moment(Date.now()).format('YYYY-MM-DD HH-mm-ss'),
      // 被回复人id，没有则默认为回复评论，id为评论人id
      subscripterId: replyTarget?.id || commentInfo.userid,
      // 有回复对象则为true
      isReply: (replyTarget ? 1 : 0)
    }
    try {
      const res = await postAddReply(formdata)
      message.success(res.data.message)
      setCommentText('')
      setPlaceholder('点击评论进行指定回复  ^_^ ')
      setReplyTarget(null)
      onGetMoreComments(currentPageNumber)
    } catch (error) {
      commentErrorFn(error, Modal, message, navigate)
    }
  }
  const onClear = function () {
    Modal.confirm({
      title: 'Tips',
      icon: <ExclamationCircleOutlined />,
      content: '是否清空 ?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setCommentText('')
        setPlaceholder('点击评论进行指定回复  ^_^ ')
        setReplyTarget(null)
      }
    });
  }
  // 点击评论指定回复
  const onReply = function (publisherUsername, publisherId) {
    setPlaceholder(`回复 @${publisherUsername}`)
    setReplyTarget({ id: publisherId })
  }
  // 删除回复
  const onDelReply = function (replyId) {
    Modal.confirm({
      title: 'Tips',
      icon: <ExclamationCircleOutlined />,
      content: '是否删除该评论? (无法恢复)',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 删除时先判断当前页面是否剩下一条，是的话删除后请求页面应提前一页
          const res = await postDelReply(replyId)
          if (allReply.length <= 1) {
            let pageNumber = currentPageNumber <= 1 ? 1 : currentPageNumber - 1
            onGetMoreComments(pageNumber)
          } else {
            onGetMoreComments(currentPageNumber)
          }
          message.info(res.data.message)
        } catch (error) {
          commentErrorFn(error, Modal, message, navigate)
        }
      }
    })
  }
  // 评论id变化则重新获取评论和回复
  useEffect(() => {
    onGetComment(commentId)
    onGetCommentReply(commentId, 1, 6)
    scrollToTop()
    // eslint-disable-next-line
  }, [commentId])
  return (
    <div className='comment-reply'>
      <div className='header'>
        <PageHeader
          className="site-page-header"
          onBack={() => navigate(-1, { replace: true })}
          title="评论详情"
        />
        <Link className="link" to={`/post/${commentInfo.commentpostid}`}><span className='to-single'>查看文章</span></Link>
      </div>

      <div className='comment'>
        <div className='comment-item'>
          <div className="user-info">
            <div className='img'>
              {commentInfo.img !== 'null' && commentInfo.img ?
                <LazyLoad>
                  <img src={commentInfo.img} alt="" />
                </LazyLoad>
                : <Avatar style={{ backgroundColor: '#b9e7e7', verticalAlign: 'middle' }} size={40}>
                  {commentInfo.username?.[0] || 'U'}
                </Avatar>
              }

            </div>
            <div className='username'><span className='auto-col text'>{commentInfo.username}</span>
            </div>
          </div>
          <div className="comment-info">
            <div className="comment-text">
              <span className='auto-col'>{commentInfo.commenttext}</span>
            </div>
            <div className='comment-date'>
              <span>评论时间 : {moment(commentInfo?.commentdate).fromNow()}</span>
            </div>
          </div>
        </div>
        <div className='input'>
          <div className='text'>
            <TextArea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={placeholder}
              autoSize={{
                minRows: 2,
                maxRows: 4,
              }}
              showCount
              maxLength={50}
            />
          </div>
          <div className='on-comment'>
            <button className='btn' onClick={onClear}>清空</button>
            <button className='btn' onClick={onComment}>发送评论</button>
          </div>
        </div>
        {
          replyLength <= 0 ? <div className='empty'> <Empty /> </div> :

            (allReply.length > 0) &&
            <ul className='reply-items'>
              {allReply.map(item => {
                return (
                  <li className='reply-item' key={item.replyId} onClick={() => onReply(item.publisherUsername, item.publisherId)}>
                    <div className='username auto-col'>
                      <div className='left'>
                        <span className='publisher'>{item.publisherUsername}</span>
                        {item.isreply ? <span style={{ fontSize: '12px' }}>回复</span> : ''}
                        {item.isreply ? <span className='subscripter'>{item.subscripterUsername}</span> : ''
                        }
                        <span>: </span>
                      </div>
                      {(currentUsername === item.publisherUsername || currentUsername === publisher) && <div className="right"><span onClick={() => onDelReply(item.replyId)}>删除</span></div>}
                    </div>
                    <div className="reply-text auto-col">
                      <span style={{ textIndent: '2em' }}>{item.replytext}</span>
                      <span className='reply-date'>评论时间 : {moment(item.replydate).fromNow()}</span>
                    </div>
                  </li>
                )
              })}
            </ul>

        }
        <div className='pagination'>
          <Pagination showQuickJumper defaultCurrent={1} total={replyLength} onChange={onGetMoreComments} pageSize={6} showSizeChanger={false} />
        </div>
      </div>
      <Footer />
    </div >
  )
}
