import React from 'react'
import { Spin } from 'antd'
import styles from './AppLoading.module.css'

export const AppLoading = () => {
  return (
    <div>
      <Spin size='large' className={styles['spin']} />
    </div>
  )
}
