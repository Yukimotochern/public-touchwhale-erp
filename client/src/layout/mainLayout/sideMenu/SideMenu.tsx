import React from 'react'
import { Layout, Menu } from 'antd'
import './SideMenu.css'
import { NavLink, Link } from 'react-router-dom'
import { useAppSelector } from '../../../redux/hooks'

const { Sider } = Layout

export const SideMenu = () => {
  const routeLink = useAppSelector((s) => s.routeLink)
  const path = useAppSelector((s) => s.router.location?.pathname)
  let selectedKeys
  if (path) {
    console.log(path.split('/'))
    selectedKeys = ['/' + path.split('/')[1]]
  } else {
    selectedKeys = []
  }
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

      <Menu theme='dark' mode='inline' selectedKeys={selectedKeys}>
        {routeLink.map(({ path, text }) => (
          <Menu.Item key={path}>
            <NavLink to={path}>{text}</NavLink>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  )
}
