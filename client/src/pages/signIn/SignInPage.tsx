import React, { useState } from 'react'
import { Form, Input, Button, Divider, Typography, message } from 'antd'
import styles from './SignInPage.module.css'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { getRegularUser } from '../../redux/auth/authSlice'

export const SignInPage = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const onFinish = async () => {
    setLoading(true)
    try {
      await api.post('/regularUser/signIn', {
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
      <div className={styles['app-logo']}>
        <img alt='' src='/logo128.png' width='50' height='50' />{' '}
        <span>TWhale ERP</span>
      </div>
      <Typography.Title level={2}>Log in your account:</Typography.Title>
      <Button
        className={styles['google-button']}
        type='default'
        block
        icon={<img src='/google_logo.png' alt='Google Logo' />}
        disabled={loading}
        onClick={() => {
          window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/regularUser/googleOAuth`
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
          <Typography.Text
            style={{
              marginLeft: '10px',
            }}
          >
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
          </Typography.Text>
        </Form.Item>
      </Form>
    </>
  )
}
