import React from 'react'
import { PageHeader } from './pageHeader/PageHeader'
import { Layout } from 'antd'
import { SideMenu } from './sideMenu/SideMenu'
import styles from './MainLayout.module.css'
import { Outlet } from 'react-router-dom'

const { Content } = Layout

interface Props {
  tabbed: boolean
}

export const MainLayout: React.FC<Props> = ({ tabbed, children }) => {
  return (
    <div className={styles.full}>
      <Layout>
        <SideMenu />
        <Layout>
          <PageHeader tabbed={tabbed} />
          <Content>{children || <Outlet />}</Content>
        </Layout>
      </Layout>
    </div>
  )
}
