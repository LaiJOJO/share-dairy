import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Input, message, Empty, Avatar, Pagination, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { postAddComment, getComments, postDelComment } from '../axios/request';
import { checkSensitiveWords,sensitiveWordsParser } from '../units/sensitiveWordsReg';
import LazyLoad from 'react-lazyload';
import moment from 'moment'
import { AuthContext } from '../context/authContext';
import { commentErrorFn } from '../units/errorFn';
const { TextArea } = Input;

export default function Comment(props) {
  const navigate = useNavigate()
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [commentsLength, setCommentsLength] = useState(1)
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const { postId, publisher } = props
  const { currentUsername } = useContext(AuthContext)
  // 切换评论页面时调用，滚动到评论区顶部
  const scrollToComment = function () {
    const comment = document.querySelector('#comment')
    if (comment) {
      // 获取id为comment的元素，获取其距离body顶部的距离，使用平滑滚动实现滚动到评论栏
      const height = comment.offsetTop
      window.scrollTo({ top: height })
    }
  }
  const onComment = async function () {
    // 过滤多个换行符
    let str = commentText.trim().replace(/[\r\n]{2,}/g, "\n")
    if (str === '' || str === '\n') return
    if (checkSensitiveWords(str)) {
      setCommentText(sensitiveWordsParser(str))
      return message.warning('包含敏感词汇')
    }
    const formdata = {
      commentText: str,
      date: moment(Date.now()).format('YYYY-MM-DD HH-mm-ss')
    }
    try {
      const res = await postAddComment(postId, formdata)
      message.success(res.data.message)
      setCommentText('')
      // 执行一次拉取评论函数
      onGetMoreComments(currentPageNumber)
    } catch (error) {
      commentErrorFn(error, Modal, message, navigate)
    }
  }
  // 请求时直接请求数据索引和量即可
  const onGetComments = async function (postId, page, pageSize = 6) {
    try {
      const res = await getComments(postId, page - 1, pageSize)
      setComments(res.data.comments)
      setCommentsLength(res.data.length)
    } catch (error) {
      commentErrorFn(error, Modal, message, navigate)
    }
  }
  // 使用目前评论数量作为索引即可接着往下请求,再次调用获取评论函数即可
  const onGetMoreComments = async function (pageNumber) {
    setCurrentPageNumber(pageNumber)
    onGetComments(postId, pageNumber, 6)
    scrollToComment()
  }
  // 删除评论
  const deleteComment = function (commentId) {
    Modal.confirm({
      title: 'Tips',
      icon: <ExclamationCircleOutlined />,
      content: '是否删除该评论? (无法恢复)',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        // 删除之后判断是否需要往前跳转一页
        try {
          const res = await postDelComment(commentId)
          if (comments.length <= 1) {
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
    });
  }

  useEffect(() => {
    onGetComments(postId, 1, 6)
    // eslint-disable-next-line
  }, [postId])
  return (
    <div className='comment' id='comment'>
      <div className='input'>
        <div className='text'>
          <TextArea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="在这里分享你的评论吧  ^_^ "
            autoSize={{
              minRows: 3,
              maxRows: 6,
            }}
            showCount
            maxLength={150}
          />
        </div>
        <div className='on-comment'>
          <button className='btn' onClick={onComment}>发送评论</button>
        </div>
      </div>
      <ul className="comment-items">
        {
          comments.length > 0 ? comments.map((item) => {
            return (
              <li className='comment-item' key={item.id}>
                <div className="user-info">
                  <div className='img'>

                    {item.img !== 'null' && item.img ?
                      <LazyLoad>
                        <img src={item.img} alt="" />
                      </LazyLoad>
                      : <Avatar style={{ backgroundColor: '#b9e7e7', verticalAlign: 'middle' }} size={40}>
                        {item.username?.[0] || 'U'}
                      </Avatar>
                    }

                  </div>
                  <div className='username'><span className='auto-col text'>{item.username}</span>
                    {publisher === item.username && <span className='icon'>作者</span>}
                  </div>
                </div>
                <div className="comment-info">
                  <div className="comment-text">
                    <span className='auto-col'>{item.commenttext}</span>
                  </div>
                  <div className='comment-date'>
                    <Link className='link' to={`/comment/${item.id}`} state={{ publisher: publisher }}><span className='comment-detail'>评论</span></Link>
                    {(currentUsername === item.username || currentUsername === publisher) ? <span className='del' onClick={() => deleteComment(item.id)}>删除</span> : ''}
                    <span>评论时间 : {moment(item?.commentdate).fromNow()}</span>
                  </div>
                  {/* 没有回复不需要展示 */}
                  {
                    item.reply &&
                    <div className='reply-info'>
                      <div className='username auto-col'>
                        <span className='publisher'>{item.reply?.publisherUsername}</span>
                        {item.reply?.isreply ? <span style={{ fontSize: '12px' }}>回复</span> : ''}
                        {item.reply?.isreply ? <span className='subscripter'>{item.reply?.subscripterUsername}</span> : ''
                        }
                        <span>: </span>
                      </div>
                      <div className="reply-text auto-col">
                        <span style={{ textIndent: '2em' }}>{item.reply?.replytext}</span>
                      </div>
                      <Link className='link' to={`/comment/${item.id}`} state={{ publisher: publisher }}  >
                        <div className='more-reply'>
                          <span>查看更多评论 &gt;</span>
                        </div>
                      </Link>

                    </div>
                  }
                </div>
              </li>
            )
          }
          ) :
            <div className='empty'><Empty /></div>
        }
      </ul>
      <div className='pagination'>
        <Pagination showQuickJumper defaultCurrent={1} total={commentsLength} onChange={onGetMoreComments} pageSize={6} showSizeChanger={false} />
      </div>
    </div>
  )
}
