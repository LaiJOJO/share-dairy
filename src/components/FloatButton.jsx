import React, { } from 'react'
import { Tooltip } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ReloadOutlined, HomeOutlined, MessageOutlined, VerticalAlignTopOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { checkIsPost } from '../units/routesReg'

export default function FloatButton() {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const scrollToComment = function () {
    const comment = document.querySelector('#comment')
    if (comment) {
      // 获取id为comment的元素，获取其距离body顶部的距离，使用平滑滚动实现滚动到评论栏
      const height = comment.offsetTop
      window.scrollTo({ top: height, behavior: 'smooth' })
    }
  }
  return (
    <ul className='float-button'>

      <Tooltip title='返回顶部'>
        <li onClick={scrollToTop}>
          <VerticalAlignTopOutlined />
        </li>
      </Tooltip>

      <Tooltip title='返回上一页'>
        <li onClick={() => navigate(-1)}>
          <ArrowLeftOutlined />
        </li>
      </Tooltip>

      <Tooltip title='返回首页'>
        <Link to={'/'} className='link'>
          <li>
            <HomeOutlined />
          </li>
        </Link>
      </Tooltip>

      <Tooltip title='刷新'>
        <li onClick={() => window.location.reload()}>
          <ReloadOutlined />
        </li>
      </Tooltip>

      <Tooltip title='查看评论'>
        <li style={{ display: checkIsPost(pathname) ? 'block' : 'none' }} onClick={scrollToComment}>
          <MessageOutlined />
        </li>
      </Tooltip>
    </ul>
  )
}
