import React from 'react'
import { Layout, Menu } from 'antd'
import './SideMenu.css'
import { NavLink, Link } from 'react-router-dom'
// import { LOCATION_CHANGE } from 'redux-first-history'

const { Sider } = Layout

export const SideMenu = () => {
  return (
    <Sider trigger={null}>
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

      <Menu theme='dark' mode='inline'>
        <Menu.Item key={1}>
          <NavLink to='/123'>123</NavLink>
        </Menu.Item>

        <Menu.Item key={2}>456</Menu.Item>
        <Menu.Item key={3}>789</Menu.Item>
      </Menu>
    </Sider>
  )
}
