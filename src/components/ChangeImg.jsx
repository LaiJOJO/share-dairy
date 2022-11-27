import React, { useState, useContext } from 'react'
import { Modal, message, Slider, Button } from 'antd';
import { UploadOutlined, SearchOutlined } from '@ant-design/icons'
import AvatarEditor from 'react-avatar-editor'
import { postChangeImg } from '../axios/request';
import { checkImgType } from '../units/checkImgType.js'
import { base64ToBlob, blobToUrl } from '../units/base64ToBlob';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function ChangeImg(props) {

  // 获取context的setImg方法，修改后重置所有头像
  const { setUserImg, userImg, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const { setImgopen, imgopen } = props

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [imgUrl, setImgUrl] = useState('')
  const [file, setFile] = useState(null)
  const [btnLoading, setBtnLoading] = useState(false)

  // 点击预览触发函数
  const onPreview = async () => {
    if (!file) return message.info('未上传图片')
    if (editor) {
      setBtnLoading(true)
      // 将方框内的裁剪部分图片转换成canvas支持的资源形式
      const canvas = editor.getImageScaledToCanvas().toDataURL()
      // 再将资源转换成blob形式并生成连接，保存到setImgUrl的state中，使react页面刷新
      setImgUrl(blobToUrl(await base64ToBlob(canvas)))
      setBtnLoading(false)
    } else {
      message.info('未上传图片')
    }
  }

  // 上传文件时要检测格式和大小
  const uploadImg = (e) => {
    let file = e.target.files[0]
    let isCorrect = checkImgType(file.name)
    if (!isCorrect) return message.info('仅支持jpg/jpeg/png/svg格式图片')
    if (file.size > 150000) return message.info('图片大小不超过150k')
    setFile(e.target.files[0])
  }

  // 确认上传图片
  const handleOk = async () => {
    if (!file) return message.info('请上传图片')
    setConfirmLoading(true)
    // 生成base64格式字符串
    try {
      const base64 = editor.getImageScaledToCanvas().toDataURL()
      const res = await postChangeImg(base64)
      setUserImg(res.data)
      message.success('头像修改成功')
      setImgopen(false)
      setConfirmLoading(false)
    } catch (error) {
      setImgopen(false);
      setConfirmLoading(false);
      if (error.message.includes('401')) {
        Modal.warning({
          title: 'Tips',
          content: (
            <p>用户信息已过期, 请登录后重新进行操作 !</p>
          ),
          onOk() {
            logout(false)
            navigate('/login')
          },
          okText: '点击前往登录页面 '
        });
      } else if (error.message.includes('403')) {
        message.warning('无权限操作,请登录对应用户后再次尝试 !')
      } else {
        Modal.warning({
          title: 'Tips',
          content: (
            <p>服务器异常, 请稍后尝试 !</p>
          ),
          onOk() {
            navigate(-1, { replace: true })
          },
          okText: '返回上一页 '
        });
      }
    }
  }

  const handleCancel = () => {
    if (confirmLoading) return message.info('头像上传中,请耐心等待')
    setImgopen(false);
    setConfirmLoading(false)
  };

  // 图片大小滑动条
  const changeScale = (value) => {
    setScale(value)
  }
  // 图片旋转滑动条
  const changeRotate = (value) => {
    setRotate(value)
  }

  let editor = null

  // 1. 剪辑框通过ref属性触发函数(图片资源变化，大小，旋转角度变化都会触发 )，将裁剪的文件传递到参数
  const setEditorRef = (editorValue) => {
    editor = editorValue
  }

  return (
    <div>
      <Modal
        title="修改头像"
        open={imgopen}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={900}
        maskClosable={false}
        okText="确认提交"
      >
        <div id='change-img'>
          <div className='left'>
            <div className="editor">
              <AvatarEditor
                ref={setEditorRef}  //调整大小，角度都会触发函数，函数值为canvas类型的图像板
                image={file || userImg || ''} //图片资源，允许文档类型
                width={230}
                height={230}
                border={30}
                color={[0, 0, 0, 0.6]} // RGBA
                scale={scale}  // 放大倍数
                rotate={rotate} //旋转角度
              />
            </div>
            <div className='slider'>
              <span>图片大小 :</span>
              <Slider defaultValue={scale} onChange={changeScale} marks={0.1} min={0.5} max={2} step={0.1} />
              <span>旋转角度 :</span>
              <Slider defaultValue={rotate} onChange={changeRotate} marks={10} min={0} max={360} step={20} />
            </div>
          </div>
          <div className="right">

            {<div className='img'>
              <img src={imgUrl || userImg || ''} alt="图片" crossOrigin='anonymous' />
            </div>}
            <div className='upload-file'>
              <div className='btn-preview'>
                <Button type="primary" loading={btnLoading} onClick={onPreview}>
                  点击预览 <SearchOutlined />
                </Button>
              </div>
              <div className='input'>
                <input type="file" style={{ 'display': 'none' }} id='file' onChange={uploadImg} />
                <Button icon={<UploadOutlined />}><label htmlFor="file" className='file'>上传图片 </label></Button>
                {file && <p>{file.name}</p>}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
