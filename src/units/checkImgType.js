// 检测图片格式
export const checkImgType = function (fileName) {
  // 正则校验图片格式
  const suffix = `(jpg|png|svg|jpeg)`
  let reg = new RegExp(`.*\\.${suffix}`)
  return reg.test(fileName)
}

// 校验是否base64
export const checkImgBase64 = function (filename) {
  // eslint-disable-next-line
  let reg = RegExp(/data:image\/.*;base64,/)
  return reg.test(filename)
}