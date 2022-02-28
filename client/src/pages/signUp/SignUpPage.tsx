import React, { useState } from 'react'
import { Form, Input, Button, Divider, Typography } from 'antd'
import styles from './SignUpPage.module.css'

interface SignUpStage {}

export const SignUpPage = () => {
  const [signUpStage, setSignUpStage] = useState()
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log(values)
  }

  const onFill = () => {
    form.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    })
  }
  return (
    <>
      <div className={styles['app-logo']}>
        <img alt='' src='/logo128.png' width='50' height='50' />{' '}
        <span>TWhale ERP</span>
      </div>
      <Typography.Title level={2}>Create your account:</Typography.Title>
      <Button
        className={styles['google-button']}
        type='default'
        block
        icon={<img src='/google_logo.png' alt='Google Logo' />}
      >
        Sign up with Google
      </Button>
      <Divider plain>or</Divider>
      <Form
        layout='vertical'
        form={form}
        name='control-hooks'
        onFinish={onFinish}
      >
        <Form.Item
          name='email'
          label={<Typography.Title level={5}>Email Address</Typography.Title>}
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Not a valid email' },
          ]}
        >
          <Input placeholder='Please enter email address' />
        </Form.Item>
        <Form.Item>
          <Button
            className={styles['proceed-button']}
            type='primary'
            htmlType='submit'
            block
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
              onClick={onFill}
              style={{
                padding: '0px',
              }}
            >
              Log In
            </Button>
          </Typography.Text>
        </Form.Item>
      </Form>
    </>
  )
}
