import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='not-found'>
      <span className='title'>404</span>
      <span className='desc'>页面走丢啦...... (Q A Q)</span>
      <Link className='link' to='/' replace><span><button>返回首页</button></span></Link>
    </div>
  )
}
