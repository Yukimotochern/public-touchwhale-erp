import React from 'react'
import styles from './FullLayout.module.css'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const FullLayout = () => {
  const { t } = useTranslation()
  return (
    <div className={styles['tw-full-layout']}>
      <div className={styles['tw-auth-left-panel']}>
        <div className={styles['tw-auth-left-panel-inner-set']}>
          <>
            <div className={styles['tw-app-logo']}>
              <img alt='' src='/logo128.png' width='50' height='50' />{' '}
              <span>TWhale {t('appIconText')}</span>
            </div>
            <Outlet />
          </>
        </div>
      </div>
      <div className={styles['tw-auth-marketing-background']} />
    </div>
  )
}
