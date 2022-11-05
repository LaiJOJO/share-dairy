import Layout from '../pages/Layout/Layout'
import Home from '../pages/Layout/children/Home'
import Login from '../pages/Login'
import Write from '../pages/Layout/children/Write'

import Single from '../pages/Layout/children/Single'
import Register from '../pages/Register'
// import { Navigate } from 'react-router-dom'
let router = [
  /* {
    path: '/',
    element: <Navigate to="/layout"></Navigate>
  }, */
  {
    path: '/',
    element: <Layout />,
    children: [
      /* {
        path: '',
        element: <Navigate to="home"></Navigate>
      }, */
      {
        path:'',
        element:<Home/>
      },
      {
        path: 'write',
        element: <Write />
      },
      {
        path: 'post/:id',
        element: <Single />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }, 
  {
    path: 'register',
    element: <Register />
  }
]

export default router