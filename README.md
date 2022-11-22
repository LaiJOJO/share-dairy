##文件布局

## 相关包
  1. react-router-dom
  2. less -D
  3. react-quill // 富文本编辑器包
  4. axios
  5. query-string --- 解析search传参字符串
  6. moment -- 用于管理显示时间
  7. react-hook-form  -- 表单认证
  8. react-simple-verify  --  滑动验证包
  9. react-lazyload  --  实现懒加载，导入Lazyload直接包裹图片容器，原理是利用intersectionObserver配合useState设置是否可见状态进行展示
  10. react-avatar-editor -- 图片裁剪器

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
  e. 注册页面表单验证,添加验证码功能

## Navbar
  a. 包括logo图标，导航栏
  1. logout导航按钮 根据是否有本地存储的username决定是否显示，有username显示username
  2. 用户头像根据context传递的userImg进行判断是否显示 ;; 退出登录时需要根据currentUserName不存在隐藏头像框

## Footer
## Search
  1. 搜索界面空则不跳转
  
## Recommend
  a. 根据Single传递的props的cat属性进行相关推荐
  b. 根据返回的数据随机筛选三篇，少于三篇则不筛选

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
  c. 过滤html标签再输出文本内容
  d. 请求无该类文章时，会返回首页

## Write
  a. 收集title，file(图片),desc,cat
  b. 由详情页跳转编辑的携带state参数，将参数作为输入框默认值
  c. 根据有无state传参判断是创建还是更改
  d. 将进度的setState函数交给axios的进度函数去动态设置上传进度;;正则匹配图片格式,先处理图片提交检测，再提交图片端口返回的地址作为数据库图片数据
  e. 函数柯里化解决antd表单元素获取不到event参数的问题，阻止表单提交的默认刷新行为


## User界面
  1. 生命周期渲染完毕时请求用户信息,请求携带用户名

## ChangeUser修改密码用户名邮箱弹窗
  1. 使用一个state保存修改的信息，不需要视图更新，直接返回源对象即可
  2. 根据修改类型提取state内的信息保存到表单进行提交

## ChangeImg修改用户头像，使用editor剪裁配合滑动条实现裁剪文件上传
  1. 上传图片的base64字符串(即canvas变量)，数据库用text保存，img标签可以直接识别base64字符串进行图片展示
  2. 裁剪框优先展示base64资源，上传图片点击预览会将base64转换成blob连接嵌入预览图框

## 优化
  1. 暴露setState状态的set函数，在axios拦截器进行设置bool影响loading界面
  2. 分页器则上传页数和每页数量，由后台进行数据处理再传回一定数量和页面的数据
  3. 文章详情页面需要识别标签进行格式展示，因此设置标签属性dangerouslySetInnerHTML， 属性接收对象__html的值会插入到标签文本，<p dangerouslySetInnerHTML={{__html:post?.desc}}> ;; 其它页面展示部分，因此需要过滤标签
  4. 使用lazy函数配合import实现动态懒加载组件，使用Suspend设置加载的临时显示页面
  5. 图片透明化，加载完onload事件再添加非透明css，设置过渡时间
  6. 图片裁剪转化blob对象和base64时会存在跨域问题，导致toDataURL()转换成连接资源时报错，因此需要考虑到跨域问题，或者直接将上传的图片作为资源才能转换成canvas的连接资源
  7. 添加简易路由导航守卫，封装GuardRouter组件，根据传递的路由注册表routes进行useRoutes注册并返回；；app引用该守卫组件进行路由占位和展示，守卫组件利用useEffect配合守卫函数在组件挂载时进行路径判断，由于params参数会影响location的pathname属性，因此采用正则进行判断，同时进行页面登录权限认证