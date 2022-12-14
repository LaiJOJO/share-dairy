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
    let keyword = value.trim()
    if(keyword === '') return
    navigate(`/search/?keyword=${keyword}`)
   }
  const [text, setText] = useState('展开搜索框')
  const changeText = () => {
      if (text === '展开搜索框') {
      setText('关闭搜索框')
    } else {
      setText('展开搜索框')
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
