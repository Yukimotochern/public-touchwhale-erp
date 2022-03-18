import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Divider, Typography, notification } from 'antd'
import styles from './SignInPage.module.css'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../api/api'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { getRegularUser } from '../../redux/auth/authSlice'

export const SignInPage = () => {
  const [form] = Form.useForm()
  const { hash: message } = useLocation()
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
      await api.post('/user/signIn', {
        email: form.getFieldValue('email'),
        password: form.getFieldValue('password'),
      })
      setLoading(false)
      dispatch(getRegularUser())
    } catch (err) {
      setLoading(false)
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.error?.message === 'Invalid credentials.') {
          form.setFields([
            { name: 'password', errors: ['Incorrect email or password.'] },
            { name: 'email', errors: ['Incorrect email or password.'] },
          ])
        }
      }
    }
  }
  return (
    <>
      <Typography.Title level={2}>Log in your account:</Typography.Title>
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
        Log in with Google
      </Button>
      <Divider plain>or</Divider>
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
              Email Address or Username
            </Typography.Title>
          }
          rules={[{ required: true, message: 'This field is required' }]}
          tooltip='Please enter the registered email address or username'
          hasFeedback
        >
          <Input
            placeholder='Enter email address or username.'
            disabled={loading}
          />
        </Form.Item>
        <Form.Item
          name='password'
          label={
            <Typography.Title style={{ margin: 0 }} level={5}>
              Password
            </Typography.Title>
          }
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password
            disabled={loading}
            placeholder='Enter your password'
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' block loading={loading}>
            Log In
          </Button>
        </Form.Item>
        <Form.Item>
          <Typography.Text>
            Don't have an account ?{' '}
            <Button
              type='link'
              htmlType='button'
              style={{
                padding: '0px',
              }}
              disabled={loading}
              onClick={() => navigate('/signUp')}
            >
              Sign Up
            </Button>
            . Forget your password ?{' '}
            <Button
              type='link'
              htmlType='button'
              style={{
                padding: '0px',
              }}
              disabled={loading}
              onClick={() => navigate('/forgetPassword')}
            >
              Reset Password
            </Button>
          </Typography.Text>
        </Form.Item>
      </Form>
    </>
  )
}
