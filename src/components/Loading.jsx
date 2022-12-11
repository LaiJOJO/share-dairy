import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'

export default function Loading() {
  return (
    <div className='loading'>
      <span><LoadingOutlined /></span>
      <h1>资源加载中,请稍候......</h1>
    </div>
  )
}
