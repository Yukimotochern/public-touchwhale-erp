import { useRoutes } from 'react-router-dom'
import './App.css'
import { appRoutes } from './AppRoutes'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { useCookies } from 'react-cookie'
import { useDispatch } from 'react-redux'
import React, { useEffect } from 'react'
import { getRegularUser } from './redux/auth/authSlice'

library.add(fas)

function App() {
  const [cookies] = useCookies(['token'])
  const dispatch = useDispatch()
  useEffect(() => {
    if (cookies) {
      dispatch(getRegularUser())
    }
  }, [cookies, dispatch])
  return <>{useRoutes(appRoutes)}</>
}

export default App
