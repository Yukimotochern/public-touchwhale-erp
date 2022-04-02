import React from 'react'
import { Layout, Menu } from 'antd'
import styles from './SideMenu.module.css'
import { NavLink, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../../../redux/hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toggle } from '../mainLayout.slice'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const { Sider } = Layout

export const SideMenu = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const siderOpen = useAppSelector((s) => s.layout.mainLayout.siderOpen)
  // Find active keys
  const routeLink = useAppSelector((s) => s.routeLink)
  const path = useAppSelector((s) => s.router.location?.pathname)
  let selectedKeys: string[]
  if (path) {
    selectedKeys = [path.split('/')[1]]
  } else {
    selectedKeys = []
  }
  return (
    <Sider
      trigger={null}
      collapsedWidth='0'
      collapsible
      className={styles['main-layout-sider']}
      collapsed={!siderOpen}
      width={225}
    >
      <div className={styles['side-menu-top-bar']}>
        <Link to='/' className={styles['mynavIcon']}>
          <img
            alt=''
            src='/logo128.png'
            width='35'
            height='35'
            className={styles['app-logo']}
          />{' '}
          <span>TWhale {t('appIconText')}</span>
        </Link>
        <FontAwesomeIcon
          icon={faBars}
          className={styles['trigger']}
          onClick={() => dispatch(toggle())}
          transform={{ y: -1 }}
        />
      </div>
      <Menu
        theme='dark'
        mode='inline'
        selectedKeys={selectedKeys}
        className={styles['main-layout-menu']}
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
                {() => <div>{text ? t(text) : t('mainLink.unnamed')}</div>}
              </NavLink>
            </Menu.Item>
          )
        })}
      </Menu>
    </Sider>
  )
}
