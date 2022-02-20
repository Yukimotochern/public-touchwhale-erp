import React from 'react'
import styles from './FullLayout.module.css'
import { Outlet } from 'react-router-dom'

export const FullLayout = () => {
  return (
    <>
      <Outlet />
    </>
  )
}
