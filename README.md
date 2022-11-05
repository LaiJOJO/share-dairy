##文件布局

## 相关包
  1. react-router-dom
  2. less -D
  3. react-quill // 富文本编辑器包
  4. axios
  5. query-string --- 解析search传参字符串
  6. moment -- 用于管理显示时间

## 1. 创建SPA路由,创建路由注册表
    a. <Fragment>代替组件的包裹容器
    b. <Navigate>重定向
    c. 使用一个less文件样式

## LOGIN and REGISTER
  a. 采用flex布局
  b. 注册页面监听输入框变化onChange事件，更新state状态
  c. 创建state收集错误状态，用于判断错误信息并显示在页面上
  {/* 有错误信息就显示 */}
        {err && <p>{err}</p>}
  d. 使用context来进行token的数据共享,配合useContext使用，监听状态当前currentUsername变化来保存到localStorage

## Navbar
  a. 包括logo图标，导航栏
  1. logout导航按钮 根据是否有本地存储的username决定是否显示，有username显示username

## Footer
## Recommend
  a. 根据Single传递的props的cat属性进行相关推荐

## Home
  a. p和h1 标签放文本换行设置:
  p,h1{
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
  }
  1. 文章根据浏览器url的query参数的cat类型进行文章请求,使用useState的hook进行保存
  2. 过滤富文本编辑器的标签

## Single
  a. 根据params参数获取指定id的post文章
  b. 发起删除操作,注意当本地存储的currentUsername和文章的postUsername相同才显示删除键
  c. 过滤标签再输出

## Write
  a. 收集title，file(图片),desc,cat
  b. 由详情页跳转编辑的携带state参数，将参数作为输入框默认值
  c. 根据有无state传参判断是创建还是更改
  