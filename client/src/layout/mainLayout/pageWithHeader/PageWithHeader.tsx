import React from 'react'
import styles from './PageWithHeader.module.css'
import {
  PageHeader as AntPageHeader,
  Tabs,
  Layout,
  PageHeaderProps,
  Dropdown,
  Menu,
} from 'antd'
import { RouteLink } from '../../../routes/appLink'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../../redux/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toggle } from '../mainLayout.slice'
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons'
import Avatar from 'antd/lib/avatar/avatar'
import { signOut } from '../../../api/userActions'
import { authSlice } from '../../../redux/auth/authSlice'
import { useAbortController } from '../../../hooks/useAbortController'
import cln from 'classnames'

const { Content } = Layout

interface Props extends PageHeaderProps {
  title: string
  xScroll?: boolean
  yScroll?: boolean
}
const { TabPane } = Tabs
export const PageWithHeader: React.FC<Props> = ({
  children,
  title,
  xScroll,
  yScroll,
  ...rest
}) => {
  const abortController = useAbortController()
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
    (route) => route.path === firstLevelRoute
  )
  let tabs: RouteLink[] | undefined
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
  const onSignOut = async () => {
    try {
      await signOut(abortController)
      dispatch(authSlice.actions.signOut())
    } catch (err) {
      // refresh
      navigate(0)
    }
  }
  const userMenu = (
    <Menu className={styles['tw-page-with-header-user-menu']}>
      <Menu.ItemGroup title={<div>Hi, {auth.user?.email}</div>}>
        <Menu.Item key='log_out' onClick={onSignOut}>
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
              className={styles.trigger}
              transform={{ y: -1 }}
            />
          )
        }
        className={styles['tw-page-with-header']}
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
          <div className={styles['user-icon']}>
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
                    // size='2x'
                  />
                }
                size='default'
              />
            </Dropdown>
          </div>
        }
      />
      <Content
        className={cln(styles['tw-page-with-header-content'], {
          [styles['x-scroll']]: xScroll,
          [styles['y-scroll']]: yScroll,
        })}
      >
        {children}
      </Content>
    </>
  )
}
