import React, { useState, useEffect, useContext } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadPost, addPost, updatePost } from '../../../axios/request';
import moment from 'moment'
import { useForm } from "react-hook-form";
import { message, Progress, Button, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import { checkImgType } from '../../../units/checkImgType.js'
import { loginErrorFn } from '../../../units/errorFn';
import { scrollToTop } from '../../../units/scrollToTop';
import { AuthContext } from '../../../context/authContext';
import { sensitiveWordsParser, checkSensitiveWords } from '../../../units/sensitiveWordsReg';

export default function Write() {
  useEffect(() => {
    scrollToTop()
  }, [])
  const { logout } = useContext(AuthContext)
  // 表单验证
  const { register, handleSubmit, formState: { errors } } = useForm();
  // 进度条
  const [percent, setPercent] = useState(0);

  const navigate = useNavigate()
  // 根据state传参判断是更新还是写入新文章
  const postState = useLocation().state
  // 先进行一次post上传图片至服务器，返回保存的图片文件名
  const upload = async () => {
    // 修改文件操作且文件state内部没有文件则不需要上传图片，直接返回传递的state的img原值
    if (postState && !file) {
      return Promise.resolve(postState.img)
    }

    try {
      // 使用FromData进行提交表单，注意自命名要和后台接收的命名对应
      if (!file) {
        return Promise.reject(new Error('请上传文章封面'))
      }
      // 不属于可上传格式警告
      if (!checkImgType(file.name)) {
        return Promise.reject(new Error('仅支持上传jpg、png、jpeg、svg格式的图片'))
      }
      if (file.size > 3000000) return Promise.reject(new Error('图片大小不超过3M'))
      const newData = new FormData()
      newData.append('myfile', file) //这里自命名myfile
      // 设置进度条的setState函数也传递过去回传进度
      const res = await uploadPost(newData, setPercent)
      message.success('图片上传成功')
      return res.data
    } catch (error) {
      loginErrorFn(error, Modal, message, navigate)
      return Promise.reject(new Error('请登录后进行操作 !'))
    }
  }
  // 将图片文件名作为文件进行上传，后台可以通过文件名筛选数据库内的文件路径返回给前台 
  const onSubmit = async function (data, status, e) {
    e.preventDefault()
    if (desc.length <= 0) {
      return message.warning('文章内容不能为空 !');
    }
    if (cat.length <= 0) {
      return message.warning('请选择文章分类 !');
    }
    if (checkSensitiveWords(title)) {
      setTitle(sensitiveWordsParser(title))
      return message.warning('标题包含敏感词汇')
    }
    if (checkSensitiveWords(desc)) {
      setTitle(sensitiveWordsParser(desc))
      return message.warning('文章内容包含敏感词汇')
    }
    let imgUrl = ''
    try {
      imgUrl = await upload()
    } catch (error) {
      // 上传图片失败则直接返回
      return message.warning(error.message)
    }
    const postData = {
      title,
      desc,
      cat,
      img: imgUrl || postState.img || '',
      date: moment(Date.now()).format('YYYY-MM-DD HH-mm-ss'),
      status
    }
    try {
      await (postState ? updatePost(postData, postState.id) : addPost(postData))
      status === 'published' ? message.success('文章分享成功') : message.success('已存为草稿')
      // 创建或者修改成功则3秒后跳转主页面
      const countDown = () => {
        let secondsToGo = 3;

        const modal = Modal.success({
          title: '提交成功',
          content: `即将在 ${secondsToGo} 秒后跳转主页...`,
          centered: true,
          okText: '正在跳转 ... ',
          okButtonProps: { disabled: true }
        });

        const timer = setInterval(() => {
          secondsToGo -= 1;
          modal.update({
            content: `即将在 ${secondsToGo} 秒后跳转主页...`,
          });
        }, 1000);

        setTimeout(() => {
          clearInterval(timer);
          modal.destroy();
          navigate('/', { replace: true })
        }, secondsToGo * 1000);
      };
      countDown()
    } catch (error) {
      loginErrorFn(error, Modal, message, navigate, logout)
    }
  }

  const [desc, setDesc] = useState(postState ? postState.description : '');
  const [title, setTitle] = useState(postState ? postState.title : '');
  const [cat, setCat] = useState(postState ? postState.cat : '');
  const [file, setFile] = useState(null);
  return (
    <div className='write'>
      <div className="content">
        {/* title框 */}
        <input type="text" {...register("title", { required: true, maxLength: 40 })} value={title} placeholder='文章标题' className='input' onChange={(e) => setTitle(e.target.value)} />
        {errors.title && <span className='red'>请输入40个字以内的标题 !</span>}
        {/* desc框 */}
        <div className="editorContainer">
          <ReactQuill theme="snow" value={desc} onChange={setDesc} className='editor' />
        </div>
      </div>
      <div className="menu">
        <div className="item" style={{ gap: '20px' }}>
          <h1>文章信息</h1>
          {
            postState && <span>
              <b>状态 :</b> {postState.status === 'published' ? '已分享足迹' : '私人足迹'}
            </span>
          }
          {
            postState && <span>
              <b>公开信息 :</b> {postState.status === 'published' ? '分享给所有人' : '仅自我浏览'}
            </span>
          }
          {/* 图片框 */}
          <div className='progress'>
            <div>
              <input type="file" style={{ 'display': 'none' }} id='file' onChange={(e) => { setFile(e.target.files[0]) }} />
              <Button icon={<UploadOutlined />}><label htmlFor="file" className='file'>上传封面 </label></Button>
              {file && <p>{file.name}</p>}
            </div>
            {percent !== 0 && <Progress type="circle" percent={percent} width={70} />}

          </div>

          <div className='btns'>
            <button onClick={(e) => handleSubmit((data) => onSubmit(data, 'draft', e))()}>存为临时草稿</button>
            <button onClick={(e) => handleSubmit((data) => onSubmit(data, 'published', e))()}>发布文章</button>
          </div>
        </div>
        {/* cat框 */}
        <div className="item">
          <h1>分类</h1>
          <div className='cat'><label ><input type="radio" name="cat" value='art' onChange={e => setCat(e.target.value)} checked={cat === 'art'} /> 艺术</label></div>
          <div className='cat'><label ><input type="radio" name="cat" value='fashion' onChange={e => setCat(e.target.value)} checked={cat === 'fashion'} /> 流行</label></div>
          <div className='cat'><label ><input type="radio" name="cat" value='technology' onChange={e => setCat(e.target.value)} checked={cat === 'technology'} /> 科技</label></div>
          <div className='cat'><label ><input type="radio" name="cat" value='sport' onChange={e => setCat(e.target.value)} checked={cat === 'sport'} /> 体育</label></div>
          <div className='cat'><label ><input type="radio" name="cat" value='food' onChange={e => setCat(e.target.value)} checked={cat === 'food'} /> 美食</label></div>
          <div className='cat'><label ><input type="radio" name="cat" value='acg' onChange={e => setCat(e.target.value)} checked={cat === 'acg'} /> 二次元</label></div>
          <div className='cat'><label ><input type="radio" name="cat" value='else' onChange={e => setCat(e.target.value)} checked={cat === 'else'} /> 其它</label></div>
        </div>
      </div>
    </div>
  )
}
