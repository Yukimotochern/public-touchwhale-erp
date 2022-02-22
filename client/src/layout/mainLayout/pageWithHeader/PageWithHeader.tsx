import React from 'react'
import './PageWithHeader.css'
import {
  PageHeader as AntPageHeader,
  Tabs,
  Layout,
  PageHeaderProps,
} from 'antd'
import { useAppSelector } from '../../../redux/hooks'

const { Content } = Layout

interface Props extends PageHeaderProps {}
const { TabPane } = Tabs
export const PageWithHeader: React.FC<Props> = ({ children, ...rest }) => {
  // First see whether there is subroutes
  // If do, extract the subroutes and render Tabs accordingly
  return (
    <>
      <AntPageHeader
        {...rest}
        className='tw-page-with-header'
        footer={
          <Tabs size='small' defaultActiveKey='1'>
            <TabPane tab='Details' key='1' />
            <TabPane tab='Rule' key='2' />
          </Tabs>
        }
      />
      <Content className='tw-page-with-header-content'>{children}</Content>
    </>
  )
}
