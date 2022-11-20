import router from './router/routes'
import { useRoutes } from 'react-router-dom'
import { Spin, ConfigProvider } from 'antd';
import './index.css'
import 'moment/locale/zh-cn'
import { useState } from 'react';
import zhCN from 'antd/es/locale/zh_CN';

function App() {
  const [isLoading, setLoading] = useState(false)
  setLoad = setLoading
  const element = useRoutes(router)
  return (
    <ConfigProvider locale={zhCN}>
      <Spin tip="加载中..." size="large" spinning={isLoading}>
        <div className='app'>
          <div className='container'>
            {element}
          </div>
        </div>
      </Spin>
    </ConfigProvider>
  )
}
export let setLoad = null
export default App;
