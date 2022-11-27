// 正则匹配路由注册表，因为带params参数的需要解析
export const checkPath = (path) => {
  // eslint-disable-next-line
  let routes = (`^((\/)|(\/write)|(\/post\/[0-9]*)|(\/search\/)|(\/login)|(\/register)|(\/user(\/publisheds|\/|\/drafts|\/collection){0,1})|(\/draft\/[0-9]*)|(\/404))$`)
  let reg = new RegExp(routes)
  return reg.test(path)
}

// write页面需要登录权限
export const checkAuth = (path)=>{
  // eslint-disable-next-line
  let auth = (`^(\/write)$`)
  let regAuth = new RegExp(auth)
  return regAuth.test(path)
}