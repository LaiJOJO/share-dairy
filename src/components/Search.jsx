import React, { useState } from 'react'
import { Input, Collapse } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

export default function Search() {
  const navigate = useNavigate()
  const { Search } = Input
  const { Panel } = Collapse;
  // 点击搜索跳转
  const onSearch = (value) => { 
    if(value === '') return
    navigate(`/search/?keyword=${value}`)
   }
  const [text, setText] = useState('点击展开搜索框')
  const changeText = () => {
      if (text === '点击展开搜索框') {
      setText('点击关闭搜索框')
    } else {
      setText('点击展开搜索框')
    }
  }
  return (
    <div className='search'>
      <Collapse ghost expandIcon={({ isActive }) => <CaretDownOutlined rotate={isActive ? 180 : 0}/>} onChange={changeText}>
        <Panel header={text} key="1" >
          <div className='input'>
            <Search placeholder="请输入搜索关键词" onSearch={onSearch} enterButton />
          </div>
        </Panel>
      </Collapse>
    </div>
  )
}
