import React from 'react'
import { Layout, Menu } from 'antd'
import './SideMenu.css'
import { NavLink, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../../redux/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toggle } from '../mainLayout.slice'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const { Sider } = Layout

export const SideMenu = () => {
  const dispatch = useDispatch()
  const siderOpen = useAppSelector((s) => s.layout.mainLayout.siderOpen)
  // Find active keys
  const routeLink = useAppSelector((s) => s.routeLink)
  const path = useAppSelector((s) => s.router.location?.pathname)
  let selectedKeys: string[]
  if (path) {
    selectedKeys = ['/' + path.split('/')[1]]
  } else {
    selectedKeys = []
  }
  return (
    <Sider
      trigger={null}
      collapsedWidth='0'
      collapsible
      className='main-layout-sider'
      collapsed={!siderOpen}
    >
      <div className='side-menu-top-bar'>
        <Link to='/' className='mynavIcon'>
          <img
            alt=''
            src='/logo128.png'
            width='32'
            height='32'
            className='app-logo'
          />{' '}
          <span>TWhale ERP</span>
        </Link>
        <FontAwesomeIcon
          icon={faBars}
          className='trigger'
          onClick={() => dispatch(toggle())}
        />
      </div>
      <Menu
        theme='dark'
        mode='inline'
        selectedKeys={selectedKeys}
        className='main-layout-menu'
      >
        {routeLink.map(({ path, text, icon, link }) => {
          return (
            <Menu.Item
              key={path}
              icon={
                <FontAwesomeIcon
                  icon={
                    icon || {
                      prefix: 'fas',
                      iconName: 'splotch',
                    }
                  }
                />
              }
            >
              <NavLink key={path} to={link.join('/')}>
                {() => <div>{text}</div>}
              </NavLink>
            </Menu.Item>
          )
        })}
      </Menu>
    </Sider>
  )
}
