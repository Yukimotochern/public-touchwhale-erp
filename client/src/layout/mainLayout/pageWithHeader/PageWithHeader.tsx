import React from 'react'
import './PageWithHeader.css'
import {
  PageHeader as AntPageHeader,
  Tabs,
  Layout,
  PageHeaderProps,
} from 'antd'
import { PureRouteObjectWithLink } from '../../../AppRoutes'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../../redux/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toggle } from '../mainLayout.slice'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const { Content } = Layout

interface Props extends PageHeaderProps {}
const { TabPane } = Tabs
export const PageWithHeader: React.FC<Props> = ({ children, ...rest }) => {
  const dispatch = useDispatch()
  const siderOpen = useAppSelector((s) => s.layout.mainLayout.siderOpen)
  // First find the current first level route
  const location = useAppSelector((s) => s.router.location)
  let firstLevelRoute: string | undefined
  let secondLevelRoute: string | undefined
  if (location) {
    let pathStrings = location.pathname.split('/')
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
  // Then see if there are children route
  // If do, extract the subroutes and render Tabs accordingly
  return (
    <>
      <AntPageHeader
        {...rest}
        onBack={() => dispatch(toggle())}
        backIcon={
          siderOpen ? null : (
            <FontAwesomeIcon icon={faBars} className='trigger' />
          )
        }
        className='tw-page-with-header'
        footer={
          tabs ? (
            <Tabs
              size='small'
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
      />
      <Content className='tw-page-with-header-content'>{children}</Content>
    </>
  )
}
