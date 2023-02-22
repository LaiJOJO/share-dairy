

## 相关包
  1. react-router-dom
  2. less -D
  3. react-quill // 富文本编辑器包
    a. quill-image-drop-module // 点击图标进行图片上传
    b. quill-image-resize-module //图片大小拉伸
    c. quill-image-drop-and-paste // 图片拖曳和复制base64转文件流进行上传
  4. axios
  5. query-string --- 解析search传参字符串
  6. moment -- 用于管理显示时间
  7. react-hook-form  -- 表单认证
  8. react-simple-verify  --  滑动验证包
  9. react-lazyload  --  实现懒加载，导入Lazyload直接包裹图片容器，原理是利用intersectionObserver配合useState设置元素节点和视口重合度进行判断是否可见状态并进行展示
  10. react-avatar-editor -- 图片裁剪器 

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

## Single文章详情
  a. 根据params参数获取指定id的post文章
  b. 发起删除操作,注意当本地存储的currentUsername和文章的postUsername相同才显示删除键
  c. 过滤html标签再输出文本内容
  d. 请求无该类文章时，会返回首页

## Write创建 && 更新页面
  a. 收集title，file(图片),desc,cat
  b. 由详情页跳转编辑的携带state参数，将参数作为输入框默认值
  c. 根据有无state传参判断是创建还是更改
  d. 将进度的setState函数交给axios的进度函数去动态设置上传进度;;正则匹配图片格式,先处理图片提交检测，再提交图片端口返回的地址作为数据库图片数据
  e. 函数柯里化解决antd表单元素获取不到event参数的问题，阻止表单提交的默认刷新行为
  f. quill富文本编辑器将上传图片的操作改成自定义函数上传到服务器仓库，创建input框模拟点击file事件，配合quill-image-resize-module插件实现图片大小调整;
  g. 支持拖曳上传图片，复制时根据内容将base64格式的图片进行上传和替换
  ps : 导入quill-image-resize-module需要配置webpack,导入时直接导入,其它同官网
    import ImageResize from 'quill-image-resize-module' :
    1. loader补充 ：{
          test: /\.js$/,
          exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
          loader: 'babel-loader'
        },
    2. plugin补充 ：new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js',
      }),


## User界面
  1. 生命周期渲染完毕时请求用户信息,请求携带用户名
  2. 发布文章界面、草稿界面、收藏界面 ；；修改界面包括如下 ：

  a.  ChangeUser修改密码用户名邮箱弹窗
    1. 使用一个state保存修改的信息，不需要视图更新，直接返回源对象即可
    2. 根据修改类型提取state内的信息保存到表单进行提交

  b. ChangeImg修改用户头像，使用editor剪裁配合滑动条实现裁剪文件上传
    1. 上传图片的base64字符串(即canvas变量)，数据库用text保存，img标签可以直接识别base64字符串进行图片展示
    2. 裁剪框优先展示base64资源，上传图片点击预览会将base64转换成blob连接嵌入预览图框

## collection 收藏页面
  1. 点赞收藏功能再在single页面进行操作
  2. 请求的收藏列表点击跳转详情页

## comment 评论区组件
  1. 评论文字需要过滤多个换行符号,用正则匹配并替换成一个换行符
  2. 点击评论或阅读评论详情进入详情页面(回复页面)
  3. 筛选最新的回复作为简要评论回复
  4. 删除按钮根据登录的用户名决定是否展示,文章发布者和评论回复者才能看到

## CommentReply 评论回复页面
  1. 点击评论更新state状态的被回复人id和用户名
  2. 单纯评论则默认上传0
  3. 获取回复评论并根据是否有用户名信息进行不同格式展示,

## FloatButton组件
  1. 根据视口进行定位
  2. 平滑滚动到指定元素区域 ：
    a. 获取id为comment的元素，获取其距离body顶部的距离offsetTop ;;没有该元素则不做操作
    b. 使用window.scrollTo的平滑滚动实现滚动到评论栏

## 优化
  1. 暴露setState状态的set函数，在axios拦截器进行设置bool影响loading界面
  2. 分页器则上传页数和每页数量，由后台进行数据处理再传回一定数量和页面的数据
  3. 文章详情页面需要识别标签进行格式展示，因此设置标签属性dangerouslySetInnerHTML， 属性接收对象__html的值会插入到标签文本，<p dangerouslySetInnerHTML={{__html:post?.desc}}> ;; 其它页面展示部分，因此需要过滤标签
  4. 使用lazy函数配合import实现动态懒加载组件，使用Suspend设置加载的临时显示页面
  5. 图片透明化，加载完onload事件再添加非透明css，设置过渡时间,优化图片渐变加载过渡效果
  6. 图片裁剪转化blob对象和base64时会存在跨域问题，导致toDataURL()转换成连接资源时报错，因此需要考虑到跨域问题，或者直接将上传的图片作为资源才能转换成canvas的连接资源
  7. 添加简易路由导航守卫，封装GuardRouter组件，根据传递的路由注册表routes进行useRoutes注册并返回；；app引用该守卫组件进行路由占位和展示，守卫组件利用useEffect配合守卫函数在组件挂载时进行路径判断，由于params参数会影响location的pathname属性，因此采用正则进行判断，同时进行页面登录权限认证
  8. 过期登录的cookie导致清空localStorage可以直接执行logout操作 ;;
  9. 添加 padding-left:calc(100vw - 100%) 滚动条宽度 解决遮罩时滚动条消失闪动问题
  10. 新增图片预览功能，通过监听desc的点击事件且判断是否为img标签进行图片预览显示
  11. write界面的富文本编辑器让.ql-container进行scroll设置，内部的editor进行visible设置，这样才能控制外部容器container进行滚动，进而让图片缩放框滚动；；否则缩放框和editor处于兄弟节点关系，不会随着editor进行overflow的滚动
  12. 简单适配rem，简单适应600px以下屏幕
  13. 滚动时隐藏resize的缩放框，增强体验；优化quill的滚动容器，修复富文本编辑器滚动条回顶bug