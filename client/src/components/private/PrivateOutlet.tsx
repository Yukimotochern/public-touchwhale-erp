import React, { useEffect } from 'react'
import { useAppSelector } from '../../redux/hooks'
import { Navigate, Outlet } from 'react-router-dom'
import { AppLoading } from '../../pages/loading/AppLoading'
import { useDispatch } from 'react-redux'
import { getUserThunkAction } from '../../redux/auth/authSlice'

export const PrivateOutlet = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getUserThunkAction())
  }, [dispatch])
  const auth = useAppSelector((s) => s.auth)
  return auth.loading ? (
    <AppLoading />
  ) : auth.user ? (
    <Outlet />
  ) : (
    <Navigate to='/signIn' />
  )
}
