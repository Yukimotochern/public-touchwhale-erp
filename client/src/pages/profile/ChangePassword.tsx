import { Button, Typography, Form, Input, message } from 'antd'
import React, { useState } from 'react'
import { changePassword } from '../../api/userActions'

interface ChangePasswordProp {
  edittable?: boolean
}

export const ChangePassword = ({ edittable }: ChangePasswordProp) => {
  const [form] = Form.useForm()
  const [state, setState] = useState({
    loading: false,
    edit: false,
  })
  const onFinish = async () => {
    setState((state) => ({ ...state, loading: true }))
    try {
      const currentPassword = form.getFieldValue('currentPassword')
      const newPassword = form.getFieldValue('newPassword')
      await changePassword({
        currentPassword,
        newPassword,
      })
      setState((state) => ({ ...state, loading: false, edit: false }))
      message.success('Password has been successfully changed.')
    } catch (err) {
      setState((state) => ({ ...state, loading: false }))
    }
  }
  if (!edittable) {
    return (
      <Typography.Text type='secondary' style={{ cursor: 'not-allowed' }}>
        User who signed up with Google account cannot set up a password.
      </Typography.Text>
    )
  } else {
    if (state.edit) {
      return (
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label='Current Password'
            name='currentPassword'
            rules={[
              {
                required: true,
                message: 'Please input your current password!',
              },
            ]}
            hasFeedback
          >
            <Input type='password' />
          </Form.Item>
          <Form.Item
            name='newPassword'
            label='New Password'
            rules={[
              {
                required: true,
                message: 'Please input your new password!',
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
            <Input type='password' />
          </Form.Item>
          <Form.Item
            name='confirmPassword'
            dependencies={['newPassword']}
            hasFeedback
            label='Confirm Password'
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!'
                    )
                  )
                },
              }),
            ]}
          >
            <Input type='password' />
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => {
                form.resetFields()
                setState((state) => ({ ...state, edit: false }))
              }}
              loading={state.loading}
            >
              Cancel
            </Button>
            <Button
              type='primary'
              style={{ marginLeft: '10px' }}
              htmlType='submit'
              loading={state.loading}
            >
              Change
            </Button>
          </Form.Item>
        </Form>
      )
    } else {
      return (
        <Button
          danger
          type='primary'
          size='small'
          onClick={() => {
            setState((state) => ({ ...state, edit: true }))
          }}
        >
          Change Password
        </Button>
      )
    }
  }
}
