import React from 'react'
import { PageHeader } from './pageHeader/PageHeader'
import { Layout } from 'antd'
import { SideMenu } from './sideMenu/SideMenu'
import styles from './MainLayout.module.css'
import { Outlet } from 'react-router-dom'

const { Content } = Layout

interface Props {
  inner?: React.ReactNode
}

export const MainLayout = ({ inner }: Props) => {
  console.log(inner)
  return (
    <div className={styles.full}>
      <Layout>
        <SideMenu />
        <Layout>
          <PageHeader />
          <Content>{inner || <Outlet />}</Content>
        </Layout>
      </Layout>
    </div>
  )
}
