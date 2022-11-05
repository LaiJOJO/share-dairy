import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadPost, addPost, updatePost } from '../../../axios/request';
import moment from 'moment'
import domParser from '../../../units/dom-parser';

export default function Write() {
  const navigate = useNavigate()
  // 根据state传参判断是更新还是写入新文章
  const postState = useLocation().state
  // 先进行一次post上传图片至服务器，返回保存的图片文件名
  const upload = async () => {
    try {
      // 使用FromData进行提交表单，注意自命名要和后台接收的命名对应
      const newData = new FormData()
      newData.append('myfile', file) //这里自命名myfile
      const res = await uploadPost(newData)
      // const res = await uploadPost(file)
      return res.data
    } catch (error) {
      alert(error)
    }
  }
  // 将图片文件名作为文件进行上传，后台可以通过文件名筛选数据库内的文件路径返回给前台 
  const onSubmit = async function (e) {
    e.preventDefault()
    const imgUrl = await upload()
    const postData = {
      title,
      desc,
      cat,
      img: imgUrl || postState?.img || '',
      // img: file,
      // img: 'http://114.132.214.26:3001/images/maka.jpg',
      date: moment(Date.now()).format('YYYY-MM-DD hh-mm-ss')
    }
    try {
      await (postState ? updatePost(postData, postState.id) : addPost(postData))
      // 创建或者修改成功则跳转主页面
      navigate('/', { replace: true })
    } catch (error) {
      // localStorage.removeItem('USER')
      alert(error.message)
      alert('请重新登录后尝试')
    }
  }

  const [desc, setDesc] = useState(postState ? domParser(postState.desc) : '');
  const [title, setTitle] = useState(postState ? postState.title : '');
  const [cat, setCat] = useState(postState ? postState.cat : '');
  const [file, setFile] = useState(null);
  return (
    <div className='write'>
      <div className="content">
        {/* title框 */}
        <input type="text" value={title} placeholder='Title' className='input' onChange={(e) => setTitle(e.target.value)} />
        {/* desc框 */}
        <div className="editorContainer">
          <ReactQuill theme="snow" value={desc} onChange={setDesc} className='editor' />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status:</b> 草稿
          </span>
          <span>
            <b>Visibility:</b> Public
          </span>
          {/* 图片框 */}
          <input type="file" style={{ 'display': 'none' }} id='file' onChange={e => setFile(e.target.files[0])} />
          <label htmlFor="file" className='file'>更新图片</label>
          <div className='btns'>
            <button>存为临时草稿</button>
            <button onClick={onSubmit}>更新文档</button>
          </div>
        </div>
        {/* cat框 */}
        <div className="item">
          <h1>分类</h1>
          <div className='cat'><label ><input type="radio" name="cat" value='art' onChange={e => setCat(e.target.value)} checked={cat === 'art'} /> ART</label></div>
          <div className='cat'><label ><input type="radio" name="cat" value='science' onChange={e => setCat(e.target.value)} checked={cat === 'science'} /> science</label></div>
          <div className='cat'><label ><input type="radio" name="cat" value='technology' onChange={e => setCat(e.target.value)} checked={cat === 'technology'} /> technology</label></div>
          <div className='cat'><label ><input type="radio" name="cat" value='cinema' onChange={e => setCat(e.target.value)} checked={cat === 'cinema'} /> cinema</label></div>
          <div className='cat'><label ><input type="radio" name="cat" value='design' onChange={e => setCat(e.target.value)} checked={cat === 'design'} /> design</label></div>
          <div className='cat'><label ><input type="radio" name="cat" value='food' onChange={e => setCat(e.target.value)} checked={cat === 'food'} /> food</label></div>
        </div>
      </div>
    </div>
  )
}
