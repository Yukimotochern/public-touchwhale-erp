import React from 'react'
import { PageHeader as AntPageHeader, Tabs } from 'antd'

// interface Props {}
const { TabPane } = Tabs
export const PageHeader = () => {
  return (
    <AntPageHeader
      title='TabbedHeader'
      footer={
        <Tabs size='small' defaultActiveKey='1'>
          <TabPane tab='Details' key='1' />
          <TabPane tab='Rule' key='2' />
        </Tabs>
      }
    />
  )
}
