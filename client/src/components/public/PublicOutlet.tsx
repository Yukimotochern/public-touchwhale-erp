import React from 'react'
import { useAppSelector } from '../../redux/hooks'
import { Navigate, Outlet } from 'react-router-dom'

export const PublicOutlet = () => {
  const user = useAppSelector((s) => s.auth.user)
  return user ? <Navigate to='/' /> : <Outlet />
}
