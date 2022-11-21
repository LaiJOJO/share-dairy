import { lazy } from 'react'

// 懒加载路由
const Layout = lazy(() => import('../pages/Layout/Layout'))
const Home = lazy(() => import('../pages/Layout/children/Home'))
const Write = lazy(() => import('../pages/Layout/children/Write'))
const Single = lazy(() => import('../pages/Layout/children/Single'))
const Search = lazy(() => import('../pages/Layout/children/SearchRes'))

const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))

const User = lazy(() => import('../pages/User/User'))
const Drafts = lazy(() => import('../pages/User/children/Drafts'))
const Publisheds = lazy(() => import('../pages/User/children/Publisheds'))
const Userinfo = lazy(() => import('../pages/User/children/Userinfo'))

const DraftPreview = lazy(() => import('../pages/DraftPreview'))



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
        element: <Write />
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
    path: '/user',
    element: <User />,
    children: [
      {
        path: '',
        element: <Userinfo />
      },
      {
        path: 'publisheds',
        element: <Publisheds />
      },
      {
        path: 'drafts',
        element: <Drafts />
      },
    ]
  }, {
    path: '/draft/:id',
    element: <DraftPreview />
  }
]

export default router