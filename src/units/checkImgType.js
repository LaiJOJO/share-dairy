// 检测图片格式
export const checkImgType = function (fileName) {
  // 正则校验图片格式
  const suffix = `(|jpg|png|svg|jpeg)`
  let reg = new RegExp(`.*\\.${suffix}`)
  return reg.test(fileName)
}