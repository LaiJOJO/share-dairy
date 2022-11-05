import router from './router/routes'
import { useRoutes } from 'react-router-dom'
import './index.css'

function App() {
  const element = useRoutes(router)
  return (
    <div className='app'>
      <div className='container'>
        {element}
      </div>
    </div>
  )
}

export default App;
