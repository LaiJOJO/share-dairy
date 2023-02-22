// 敏感词库

export const sensitiveWordsParser = function (str) {
  let reg = /(fuck|傻逼|弱智)/g
  return str.replace(reg, '**')
}

export const checkSensitiveWords = function(str) {
  let reg = /^(.*(fuck|傻逼|弱智).*)$/
  return reg.test(str)
}