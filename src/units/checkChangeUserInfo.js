export const checkUsername = function (username) {
  let reg = new RegExp(`^[a-zA-Z0-9_-]{4,16}$`)
  return reg.test(username)
}

// eslint-disable-next-line
export const checkPassword = function (password) {
  // eslint-disable-next-line
  let reg = new RegExp(`^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$`)
  return reg.test(password)
}

export const checkEmail = function (email) {
  // eslint-disable-next-line
  let reg = new RegExp(`^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$`)
  return reg.test(email)
}

export const checkRequired = function (info) {
  return info.length <= 0
}