import React from 'react'
import { Row, Col, Empty, Typography, Space } from 'antd'
import { ProfileBlock } from './ProfileBlock'
import { useAppSelector } from '../../redux/hooks'

import { ChangePassword } from './ChangePassword'
import { AvatarUpload } from './AvatarUpload'
import { useTranslation } from 'react-i18next'

export const ProfilePage = () => {
  const { t } = useTranslation()
  const user = useAppSelector((s) => s.auth.user)
  if (user) {
    const { username, avatar, email, company, createdAt, provider } = user
    return (
      <>
        <Row gutter={8} style={{ marginTop: 10 }}>
          <Col>
            <AvatarUpload avatar={avatar} />
          </Col>
          <Col>
            <Row>
              <div
                style={{
                  display: 'inline-flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {username || t('profile.user')}
                </Typography.Title>{' '}
                <Typography.Text type='secondary' style={{ fontSize: '16px' }}>
                  {email}
                </Typography.Text>
              </div>
            </Row>
            <Row>
              <Typography.Text style={{ marginLeft: 5 }}>
                {t('profile.member_since', { date: createdAt })}
              </Typography.Text>
            </Row>
          </Col>
        </Row>
        <Row gutter={8} style={{ marginTop: 30 }}>
          <ProfileBlock
            initialValue={-1}
            fieldName='none'
            title='profile.sign_in_method'
            type='plain'
          >
            {provider === 'Google' ? (
              <Space align='baseline'>
                <img
                  src='/google_logo.png'
                  alt='Google Logo'
                  style={{ height: '18px', verticalAlign: 'sub' }}
                />
                <Typography.Title level={5}>Google</Typography.Title>
                <Typography.Text type='secondary'>{email}</Typography.Text>
              </Space>
            ) : null}
            {provider === 'TouchWhale' ? (
              <Space align='baseline'>
                <img
                  src='/logo128.png'
                  alt='G cvc f oogle Logo'
                  style={{
                    height: '20px',
                    position: 'relative',
                  }}
                />
                <Typography.Text strong>Touch Whale</Typography.Text>
                <Typography.Text type='secondary'>{email}</Typography.Text>
              </Space>
            ) : null}
          </ProfileBlock>
          <ProfileBlock
            initialValue={-1}
            fieldName='none'
            title='profile.account_type'
            type='plain'
          >
            TODO: Owner or Employee
          </ProfileBlock>
          <ProfileBlock
            initialValue={username}
            fieldName='username'
            title='profile.username'
            type='edit'
          />
          <ProfileBlock
            initialValue={company}
            fieldName='company'
            title='profile.company_name'
            type='edit'
          />
          <ProfileBlock
            initialValue={-1}
            fieldName='password'
            title='profile.password'
            type='plain'
          >
            <ChangePassword edittable={provider === 'TouchWhale'} />
          </ProfileBlock>
        </Row>
      </>
    )
  } else {
    return (
      <Empty
        description={t('errors.not_login')}
        style={{ width: '100%', height: '100%' }}
      />
    )
  }
}
