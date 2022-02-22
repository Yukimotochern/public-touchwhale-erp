import { useRoutes } from 'react-router-dom'
import './App.css'
import { appRoutes } from './AppRoutes'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

function App() {
  return <>{useRoutes(appRoutes)}</>
}

export default App
