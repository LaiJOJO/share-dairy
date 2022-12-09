// 返回blob对象
export const base64ToBlob = async function (base64) {
  const canvas = await fetch(base64)
  const blob = await canvas.blob()
  return blob
}
// 返回blob对象生成的url
export const blobToUrl = function (blob) {
  const imgUrl = window.URL.createObjectURL(blob)
  return imgUrl
}
// base64转文档流

export const convertBase64UrlToBlob = function dataURLtoFile(dataurl, filename='quill.jpg') {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}