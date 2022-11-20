// 检测图片格式
export const checkImgType = function (fileName) {
  // 正则校验图片格式
  const suffix = `(bmp|jpg|png|tif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp|jpeg)`
  let reg = new RegExp(`.*\\.${suffix}`)
  return reg.test(fileName)
}