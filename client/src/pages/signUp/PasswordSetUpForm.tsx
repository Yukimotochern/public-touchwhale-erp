import React from 'react'
import { Form, Button, Input } from 'antd'
import { UseStateForSignUpPageProps } from './SignUpPage'
import styles from './PasswordSetUpForm.module.css'

export const PasswordSetUpForm = ({
  signUpProcessState,
  setSignUpProcessState,
}: UseStateForSignUpPageProps) => {
  const [form] = Form.useForm()
  const onFinish = () => {
    setSignUpProcessState((state) => ({
      ...state,
      stage: 'password',
    }))
  }
  return (
    <>
      <Form
        layout='vertical'
        form={form}
        onFinish={onFinish}
        requiredMark={false}
        style={{
          marginTop: '0.4em',
        }}
      >
        <Form.Item
          name='password'
          label='Password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
            {
              min: 8,
              message: 'Password should be between 8 and 60 characters.',
            },
            {
              max: 60,
              message: 'Password should be between 8 and 60 characters.',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name='confirm'
          label='Confirm Password'
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                )
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            className={styles['proceed-button']}
            type='primary'
            htmlType='submit'
            block
          >
            Join NOW!
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
