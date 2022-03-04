import React from 'react'
import { Row, Col, Empty, Typography, Space } from 'antd'
import { ProfileBlock } from './ProfileBlock'
import { useAppSelector } from '../../redux/hooks'
import Avatar from 'antd/lib/avatar/avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { ChangePassword } from './ChangePassword'
import { AvatarUpload } from './AvatarUpload'

export const ProfilePage = () => {
  const user = useAppSelector((s) => s.auth.user)
  if (user) {
    const { username, avatar, email, company_name, createdAt, provider } = user
    return (
      <>
        <Row gutter={8} style={{ marginTop: 10 }}>
          <Col>
            <Avatar
              size={50}
              src={avatar}
              icon={
                <FontAwesomeIcon
                  icon={faUser}
                  color='rgba(102, 101, 101, 0.849'
                />
              }
            />
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
                  {username || 'User'}
                </Typography.Title>{' '}
                <Typography.Text type='secondary' style={{ fontSize: '16px' }}>
                  {email}
                </Typography.Text>
              </div>
            </Row>
            <Row>
              <Typography.Text style={{ marginLeft: 5 }}>
                Member since {moment(createdAt, 'YYYYMMDD').format('ll')}
              </Typography.Text>
            </Row>
          </Col>
        </Row>
        <Row gutter={8} style={{ marginTop: 30 }}>
          <ProfileBlock
            initialValue={-1}
            fieldName='none'
            title='Sign In Method'
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
                    // top: '50%',
                    // left: '5px',
                    // transform: 'translate(-50%, -50%)',
                  }}
                />
                <Typography.Text strong>Touch Whale</Typography.Text>
                <Typography.Text type='secondary'>{email}</Typography.Text>
              </Space>
            ) : null}
          </ProfileBlock>

          <ProfileBlock
            initialValue={username}
            fieldName='username'
            title='Username'
            type='edit'
          />
          <ProfileBlock
            initialValue={company_name}
            fieldName='company_name'
            title='Company Name'
            type='edit'
          />
          <ProfileBlock
            initialValue={-1}
            fieldName='password'
            title='Password'
            type='plain'
          >
            <ChangePassword edittable={provider === 'TouchWhale'} />
          </ProfileBlock>
          <ProfileBlock
            initialValue={-1}
            fieldName='avatar'
            title='Avatar'
            type='plain'
          >
            <AvatarUpload />
          </ProfileBlock>
        </Row>
      </>
    )
  } else {
    return (
      <Empty
        description='It seems like you are not logging in.'
        style={{ width: '100%', height: '100%' }}
      />
    )
  }
}
