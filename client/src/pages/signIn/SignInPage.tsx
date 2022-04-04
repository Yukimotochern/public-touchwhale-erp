import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Divider, Typography, notification } from 'antd'
import styles from './SignInPage.module.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { signIn } from '../../api/userActions'
import { useDispatch } from 'react-redux'
import { getUserThunkAction } from '../../redux/auth/authSlice'
import { useAbortController } from '../../hooks/useAbortController'
import { useTranslation } from 'react-i18next'

export const SignInPage = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { hash: message } = useLocation()
  const abortController = useAbortController()
  useEffect(() => {
    if (message) {
      notification.error({
        placement: 'topLeft',
        message: decodeURI(message).replace('#', ''),
        style: {
          position: 'fixed',
          left: '50%',
          transform: 'translate(-50%, 0%)',
        },
        duration: 6,
      })
    }
  }, [message])

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const onFinish = async () => {
    setLoading(true)
    try {
      await signIn(
        {
          email: form.getFieldValue('email'),
          password: form.getFieldValue('password'),
        },
        abortController
      )
        .onCustomCode(401, () => {
          form.setFields([
            { name: 'password', errors: [t('errors.invalid_credentials')] },
            { name: 'email', errors: [t('errors.invalid_credentials')] },
          ])
        })
        .onErrorsButCancel(() => {
          setLoading(false)
        }, true)
      setLoading(false)
      dispatch(getUserThunkAction())
    } catch (err) {
      setLoading(false)
    }
  }
  return (
    <>
      <Typography.Title level={2}>{t('auth.login_title')}</Typography.Title>
      <Button
        className={styles['google-button']}
        type='default'
        block
        icon={<img src='/google_logo.png' alt='Google Logo' />}
        disabled={loading}
        onClick={() => {
          window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/googleOAuth`
        }}
      >
        {t('auth.google_login_button')}
      </Button>
      <Divider plain>{t('common.or')}</Divider>
      <Form
        layout='vertical'
        form={form}
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          name='email'
          label={
            <Typography.Title style={{ margin: 0 }} level={5}>
              {t('auth.email_or_username')}
            </Typography.Title>
          }
          rules={[{ required: true, message: t('common.required_field') }]}
          // hasFeedback
        >
          <Input
            placeholder={t('auth.enter_email_or_username')}
            disabled={loading}
          />
        </Form.Item>
        <Form.Item
          name='password'
          label={
            <Typography.Title style={{ margin: 0 }} level={5}>
              {t('profile.password')}
            </Typography.Title>
          }
          rules={[
            {
              required: true,
              message: t('auth.required_password'),
            },
          ]}
        >
          <Input.Password
            disabled={loading}
            placeholder={t('auth.enter_password')}
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' block loading={loading}>
            {t('auth.login_button')}
          </Button>
        </Form.Item>
        <Form.Item>
          <Typography.Text>
            {t('auth.no_account')}{' '}
            <Button
              type='link'
              htmlType='button'
              style={{
                padding: '0px',
              }}
              disabled={loading}
              onClick={() => navigate('/signUp')}
            >
              {t('auth.sign_up')}
            </Button>
            {t('common.sentense_connect')}
            {t('auth.forget_your_password')}{' '}
            <Button
              type='link'
              htmlType='button'
              style={{
                padding: '0px',
              }}
              disabled={loading}
              onClick={() => navigate('/forgetPassword')}
            >
              {t('auth.reset_password_button')}
            </Button>
          </Typography.Text>
        </Form.Item>
      </Form>
    </>
  )
}
