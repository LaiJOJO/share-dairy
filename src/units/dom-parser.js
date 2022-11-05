// 过滤富文本编辑器的标签
export default function(htmlStr){
  const doc = new DOMParser().parseFromString(htmlStr,"text/html")
  return doc.body.textContent
}