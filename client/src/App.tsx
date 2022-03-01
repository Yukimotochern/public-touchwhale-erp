import { useRoutes } from 'react-router-dom'
import './App.css'
import { appRoutes } from './AppRoutes'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import React, { useEffect } from 'react'
import { getRegularUser } from './redux/auth/authSlice'

library.add(fas)

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getRegularUser())
  }, [dispatch])
  return <>{useRoutes(appRoutes)}</>
}

export default App
