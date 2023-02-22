import { lazy } from 'react'

// 懒加载路由
const Layout = lazy(() => import('../pages/Layout/Layout'))
const Home = lazy(() => import('../pages/Layout/children/Home'))
const Write = lazy(() => import('../pages/Layout/children/Write'))
const Single = lazy(() => import('../pages/Layout/children/Single'))
const Search = lazy(() => import('../pages/Layout/children/SearchRes'))

const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const FindPassword = lazy(()=>import ('../pages/FindPassword'))

const User = lazy(() => import('../pages/User/User'))
const Drafts = lazy(() => import('../pages/User/children/Drafts'))
const Publisheds = lazy(() => import('../pages/User/children/Publisheds'))
const Userinfo = lazy(() => import('../pages/User/children/Userinfo'))
const Collection = lazy(() => import('../pages/User/children/Collection'))

const DraftPreview = lazy(() => import('../pages/DraftPreview'))
const NotFound = lazy(() => import('../pages/NotFound'))

const CommentReply = lazy(() => import('../pages/CommentReply'))



let router = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'write',
        element: <Write />,
      },
      {
        path: 'post/:id',
        element: <Single />
      },
      {
        path: 'search',
        element: <Search />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/findpassword',
    element: <FindPassword />
  },
  {
    path: '/user',
    element: <User />,
    children: [
      {
        path: '',
        element: <Userinfo />,
      },
      {
        path: 'publisheds',
        element: <Publisheds />,
      },
      {
        path: 'drafts',
        element: <Drafts />,
      },
      {
        path: 'collection',
        element: <Collection />,
      },
    ]
  },
  {
    path: '/draft/:id',
    element: <DraftPreview />,
  },
  {
    path: '/comment/:id',
    element: <CommentReply />
  },
  {
    path: '/404',
    element: <NotFound />
  }
]

export default router