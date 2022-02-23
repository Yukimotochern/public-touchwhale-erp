import React from 'react'
import { Layout } from 'antd'
import { SideMenu } from './sideMenu/SideMenu'
import styles from './MainLayout.module.css'
import { Outlet } from 'react-router-dom'

interface Props {
  inner?: React.ReactNode
}

export const MainLayout = ({ inner }: Props) => {
  return (
    <div className={styles.full}>
      <Layout>
        <SideMenu />
        <Layout>{inner || <Outlet />}</Layout>
      </Layout>
    </div>
  )
}

//
