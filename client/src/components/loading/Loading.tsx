import React from 'react'
import { Spin } from 'antd'
import styles from './Loading.module.css'

export const Loading = () => <Spin size='large' className={styles['spin']} />
