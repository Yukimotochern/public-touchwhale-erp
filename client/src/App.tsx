import { useRoutes } from 'react-router-dom'
import './App.css'
import { appRoutes } from './AppRoutes'

function App() {
  return <>{useRoutes(appRoutes)}</>
}

export default App
