import React from 'react'
import { Layout, Menu } from 'antd'
import './SideMenu.css'
import { NavLink, Link } from 'react-router-dom'
import { useAppSelector } from '../../../redux/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const { Sider } = Layout

export const SideMenu = () => {
  // Find active keys
  const routeLink = useAppSelector((s) => s.routeLink)
  const path = useAppSelector((s) => s.router.location?.pathname)
  let selectedKeys
  if (path) {
    selectedKeys = ['/' + path.split('/')[1]]
  } else {
    selectedKeys = []
  }
  return (
    <Sider trigger={null} collapsedWidth='0' collapsible>
      <div className='side-menu-top-bar'>
        <Link to='/' className='mynavIcon'>
          <img
            alt=''
            src='/logo128.png'
            width='32'
            height='32'
            className='app-logo'
          />{' '}
          TWhale ERP
        </Link>
      </div>

      <Menu theme='dark' mode='inline' selectedKeys={selectedKeys}>
        {routeLink.map(({ path, text, icon }) => {
          // let iconLook = icon || { prefix: 'fas', iconName: 'rocket' }
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
              <NavLink key={path} to={path}>
                {() => <div>{text}</div>}
              </NavLink>
            </Menu.Item>
          )
        })}
      </Menu>
    </Sider>
  )
}
