import router from './router/routes'
import { Spin, ConfigProvider } from 'antd';
import './index.css'
import 'moment/locale/zh-cn'
import { useState } from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import GuardRouter from './components/GuardRouter';
import FloatButton from './components/FloatButton';

function App() {
  const [isLoading, setLoading] = useState(false)
  setLoad = setLoading
  return (
    <ConfigProvider locale={zhCN}>
      <Spin tip="加载中..." size="large" spinning={isLoading}>
        <div className='app'>
          <div className='container'>
            <FloatButton />
            {GuardRouter(router)}
          </div>
        </div>
      </Spin>
    </ConfigProvider>
  )
}
export let setLoad = null
export default App;
