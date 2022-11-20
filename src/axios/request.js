import request from './axios.js'

// 登录注册
export const postRegister = (value) => {
  return request({ url: '/auth/register', method: 'POST', data: value })
}

export const postLogin = (value) => {
  return request({ url: '/auth/login', method: 'POST', data: value })
}

export const postLogout = () => {
  return request({ url: '/auth/logout', method: 'POST' })
}

// 获取文章
export const getPosts = (cat, page,pageSize) => {
  return request({ url: `/posts/getposts/?cat=${cat}&page=${page - 1}&pagesize=${pageSize}`, method: 'GET' })
}

export const getSearchPosts = (keyword,page,pageSize)=>{
  return request({ url: `/posts/getsearch/?keyword=${keyword}&page=${page - 1}&pagesize=${pageSize}`, method: 'GET' })
}

export const getRecommentPosts = (cat) => {
  return request({ url: `/posts/getrecommentposts/?cat=${cat}`, method: 'GET' })
}

export const getPost = (postId) => {
  return request({ url: `/posts/getpost/${postId}`, method: 'GET' })
}

export const deletePost = (postId) => {
  return request({ url: `/posts/deletepost/${postId}`, method: 'DELETE' })
}

export const uploadPost = (newData, setPercent) => {
  return request({
    url: `/posts/uploadpost`, method: 'Post', data: newData, onUploadProgress: progressEvent => {
      let persent = (progressEvent.loaded / progressEvent.total * 100 | 0)
      setPercent(persent)
    }
  })
}

export const addPost = (fromData) => {
  return request({ url: `/posts/addpost`, method: 'Post', data: fromData })
}

export const updatePost = (fromData, id) => {
  return request({ url: `/posts/updatepost/${id}`, method: 'PUT', data: fromData })
}
// 获取用户信息
export const getUserInfo = (username) => {
  return request({ url: `/users/userinfo/${username}`, method: 'GET' })
}
// 获取用户推荐文章
export const getUserRecommentPosts = (userId) => {
  return request({ url: `/users/userrecommentposts/${userId}`, method: 'GET' })
}

// 修改用户名
export const postChangeUsername = (formData) => {
  return request({ url: `/users/changeusername`, method: 'POST', data: formData })
}
// 修改邮箱
export const postChangeEmail = (formData) => {
  return request({ url: `/users/changeemail`, method: 'POST', data: formData })
}
// 修改密码
export const postChangePassword = (formData) => {
  return request({ url: `/users/changepassword`, method: 'POST', data: formData })
}
// 修改头像
export const postChangeImg = (base64)=>{
  return request({ url: `/users/changeimg`, method: 'POST', data: {image:base64} })
}

// 获取对应用户文章
export const getUserPublisheds = (username, page) => {
  return request({ url: `/users/getuserpublisheds/?username=${username}&page=${page}`, method: 'GET' })
}
// 获取用户草稿
export const getUserDrafts = (username, page) => {
  return request({ url: `/users/getusedrafts/?username=${username}&page=${page}`, method: 'GET' })
} 