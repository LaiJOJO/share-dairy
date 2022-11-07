import router from './router/routes'
import { useRoutes } from 'react-router-dom'
import { Spin } from 'antd';
import './index.css'
import { useState } from 'react';

function App() {
  const [isLoading,setLoading] = useState(false)
  setLoad = setLoading
  const element = useRoutes(router)
  return (
    <Spin tip="加载中..." size="large" spinning={isLoading}>
      <div className='app'>
        <div className='container'>
          {element}
        </div>
      </div>
    </Spin>
  )
}
export let setLoad = null
export default App;
