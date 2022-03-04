import React from 'react'
import './PageWithHeader.css'
import styles from './PageWithHeader.module.css'
import {
  PageHeader as AntPageHeader,
  Tabs,
  Layout,
  PageHeaderProps,
  Dropdown,
  Menu,
  Typography,
} from 'antd'
import { PureRouteObjectWithLink } from '../../../AppRoutes'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../../redux/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toggle } from '../mainLayout.slice'
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons'
import Avatar from 'antd/lib/avatar/avatar'
import api from '../../../utils/api'
import { getRegularUser } from '../../../redux/auth/authSlice'

const { Content } = Layout

interface Props extends PageHeaderProps {
  title: string
}
const { TabPane } = Tabs
export const PageWithHeader: React.FC<Props> = ({
  children,
  title,
  ...rest
}) => {
  const dispatch = useDispatch()
  const siderOpen = useAppSelector((s) => s.layout.mainLayout.siderOpen)
  // First find the current first level route
  const curLocation = useAppSelector((s) => s.router.location)
  const auth = useAppSelector((s) => s.auth)
  let firstLevelRoute: string | undefined
  let secondLevelRoute: string | undefined
  if (curLocation) {
    let pathStrings = curLocation.pathname.split('/')
    if (pathStrings.length > 1) {
      firstLevelRoute = pathStrings[1]
    }
    if (pathStrings.length > 2) {
      secondLevelRoute = pathStrings[2]
    }
  }
  const navigate = useNavigate()
  const firstLevelMatch = useAppSelector((s) => s.routeLink).find(
    (route) => route.path === '/' + firstLevelRoute
  )
  let tabs: PureRouteObjectWithLink[] | undefined
  if (firstLevelMatch) {
    // has match
    let children = firstLevelMatch.children
    if (children) {
      if (children.length !== 0) {
        // non empty children -> render tabs
        tabs = children
      }
    }
  }
  const userMenu = (
    <Menu className='tw-page-with-header-user-menu '>
      <Menu.ItemGroup title={<div>Hi, {auth.user?.email}</div>}>
        <Menu.Item
          key='log_out'
          onClick={async () => {
            try {
              await api.get('/regularUser/signOut')
              dispatch(getRegularUser())
            } catch (err) {
              // refresh
              navigate(0)
            }
          }}
        >
          Log out
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  )
  // Then see if there are children route
  // If do, extract the subroutes and render Tabs accordingly
  return (
    <>
      <AntPageHeader
        {...rest}
        title={<h1>{title}</h1>}
        onBack={() => dispatch(toggle())}
        backIcon={
          siderOpen ? null : (
            <FontAwesomeIcon
              icon={faBars}
              className='trigger'
              transform={{ y: -1 }}
            />
          )
        }
        className='tw-page-with-header'
        footer={
          tabs ? (
            <Tabs
              size='middle'
              activeKey={secondLevelRoute}
              onTabClick={(key) => {
                navigate(key)
              }}
            >
              {tabs.map((tab) => (
                <TabPane tab={tab.text} key={tab.path} />
              ))}
            </Tabs>
          ) : undefined
        }
        extra={
          <div className='user-icon'>
            <Dropdown
              overlay={userMenu}
              trigger={['click']}
              className={styles['user-icon']}
            >
              <Avatar
                src={auth.user?.avatar}
                icon={
                  <FontAwesomeIcon
                    icon={faUser}
                    color='rgba(102, 101, 101, 0.849'
                    size='sm'
                  />
                }
              />
            </Dropdown>
          </div>
        }
      />
      <Content className='tw-page-with-header-content'>{children}</Content>
    </>
  )
}
