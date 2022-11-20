// 返回blob对象
export const base64ToBlob =async function (base64) {
  const canvas = await fetch(base64)
  const blob = await canvas.blob()
  return blob
}
// 返回blob对象生成的url
export const blobToUrl = function(blob){
  const imgUrl = window.URL.createObjectURL(blob)
  return imgUrl
}