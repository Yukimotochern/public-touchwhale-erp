import React from 'react'
import { useAppSelector } from '../../redux/hooks'
import { Navigate, Outlet } from 'react-router-dom'
import { AppLoading } from '../loading/AppLoading'

export const PrivateOutlet = () => {
  const auth = useAppSelector((s) => s.auth)
  return auth.loading ? (
    <AppLoading />
  ) : auth.user ? (
    <Outlet />
  ) : (
    <Navigate to='/signIn' />
  )
}
