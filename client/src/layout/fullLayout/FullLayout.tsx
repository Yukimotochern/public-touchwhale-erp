import React from 'react'
import styles from './FullLayout.module.css'
import { Outlet } from 'react-router-dom'

export const FullLayout = () => {
  return (
    <div className={styles['tw-full-layout']}>
      <div className={styles['tw-auth-left-panel']}>
        <div className={styles['tw-auth-left-panel-inner-set']}>
          <Outlet />
        </div>
      </div>
      <div className={styles['tw-auth-marketing-background']} />
    </div>
  )
}
