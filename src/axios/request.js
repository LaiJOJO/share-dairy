import request from './axios.js'

export const postRegister = (value) => {
  return request({ url: '/auth/register', method: 'POST', data: value })
}

export const postLogin = (value) => {
  return request({ url: '/auth/login', method: 'POST', data: value })
}

export const postLogout = ()=>{
  return request({url:'/auth/logout',method:'POST'})
}

export const getPosts = (cat)=>{
  return request({url:`/posts/getposts/?cat=${cat}`,method:'GET'})
}

export const getPost = (postId)=>{
  return request({url:`/posts/getpost/${postId}`,method:'GET'})
}

export const deletePost = (postId)=>{
  return request({url:`/posts/deletepost/${postId}`,method:'DELETE'})
}

export const uploadPost = (newData)=>{
  return request({url:`/posts/uploadpost`,method:'Post',data:newData})
}

export const addPost = (fromData)=>{
  return request({url:`/posts/addpost`,method:'Post',data:fromData})
}

export const updatePost = (fromData,id)=>{
  return request({url:`/posts/updatepost/${id}`,method:'PUT',data:fromData})
}