import React from 'react'
import styles from './FullLayout.module.css'
import { Outlet } from 'react-router-dom'

export const FullLayout = () => {
  return (
    <div className={styles['tw-full-layout']}>
      <div className={styles['tw-auth-left-panel']}>
        <div className={styles['tw-auth-left-panel-inner-set']}>
          <>
            <div className={styles['tw-app-logo']}>
              <img alt='' src='/logo128.png' width='50' height='50' />{' '}
              <span>TWhale ERP</span>
            </div>
            <Outlet />
          </>
        </div>
      </div>
      <div className={styles['tw-auth-marketing-background']} />
    </div>
  )
}
