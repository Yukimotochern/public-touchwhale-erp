import { useRoutes } from 'react-router-dom'
import './App.css'
import { appRoutes } from './routes/AppRoutes'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

library.add(fas)

function App() {
  return <>{useRoutes(appRoutes)}</>
}

export default App
