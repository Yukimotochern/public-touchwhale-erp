import React from 'react'
import { Form, Input, Button, Divider, Typography, message } from 'antd'
import styles from './EmailEnterForm.module.css'
import { UseStateForSignUpPageProps } from './SignUpPage'
import api from '../../utils/api'
import axios from 'axios'

export const EmailEnterForm = ({
  signUpProcessState,
  setSignUpProcessState,
}: UseStateForSignUpPageProps) => {
  const [form] = Form.useForm()
  const onFinish = async () => {
    setSignUpProcessState((state) => ({
      ...state,
      loading: true,
    }))
    try {
      const email = form.getFieldValue('email')
      await api.post('/regularUser/signUp', {
        email,
      })
      setSignUpProcessState((state) => ({
        ...state,
        email,
        stage: 'verify',
        loading: false,
      }))
    } catch (err: any) {
      console.error(err)
      if (axios.isAxiosError(err)) {
        if (err.response?.data) {
          // error with response
          switch (err.response?.data?.error?.message) {
            case 'Email has been taken.':
              form.setFields([
                { name: 'email', errors: ['Email has been taken.'] },
              ])
              message.error('Email has been taken.')
              break
            default:
              message.error(`Something is wrong: ${err.message}`)
              break
          }
        } else {
          // error without response
          switch (err.message) {
            case 'Network Error':
              message.error('Please check your internet connection.')
              break
            default:
              message.error(`Something is wrong: ${err.message}`)
              break
          }
        }
      } else {
        message.error(`Unknown error: ${err}`)
      }
      setSignUpProcessState((state) => ({
        ...state,
        loading: false,
      }))
    }
  }
  return (
    <>
      <Button
        className={styles['google-button']}
        type='default'
        block
        icon={<img src='/google_logo.png' alt='Google Logo' />}
        disabled={signUpProcessState.loading}
      >
        Sign up with Google
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
              Email Address
            </Typography.Title>
          }
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Not a valid email' },
          ]}
          tooltip='This will be used as the username when you log in.'
        >
          <Input
            placeholder='Please enter an email address.'
            disabled={signUpProcessState.loading}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            block
            loading={signUpProcessState.loading}
          >
            Next
          </Button>
        </Form.Item>
        <Form.Item>
          <Typography.Text
            style={{
              marginLeft: '10px',
            }}
          >
            Already have an account ?{' '}
            <Button
              type='link'
              htmlType='button'
              style={{
                padding: '0px',
              }}
              disabled={signUpProcessState.loading}
            >
              Log In
            </Button>
          </Typography.Text>
        </Form.Item>
      </Form>
    </>
  )
}
