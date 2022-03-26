import { Typography, Form, Button, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { resetPassword } from '../../api/userActions'
import { useAbortController } from '../../hooks/useAbortController'
import { Loading } from '../../components/loading/Loading'

export const ResetPasswordPage = () => {
  const abortController = useAbortController()

  // password thing
  const navigate = useNavigate()
  const location = useLocation()
  const firstToken = location.hash.replace('#', '')
  const [secondToken, setSecondToken] = useState('')
  const [sendingFirstToken, setSendingFirstToken] = useState(true)
  const [form] = Form.useForm()
  const [passwordFormLoading, setPasswordFormLoading] = React.useState(false)
  useEffect(() => {
    async function getSecondToken() {
      const notGetToken = () => {
        // didn't got token from server, try again latter
        setSendingFirstToken(false)
        message.error('Something went wrong. Try again latter.')
        navigate('/forgetPassword')
      }
      try {
        // loading
        setSendingFirstToken(true)
        const data = await resetPassword(
          {
            token: firstToken,
          },
          abortController
        ).onErrorsButCancel(notGetToken)
        // stop loading
        if (data.token) {
          setSecondToken(data.token)
          setSendingFirstToken(false)
        } else {
          notGetToken()
        }
      } catch (err) {}
    }
    if (firstToken) {
      getSecondToken()
    } else {
      message.error('Invalid reset password link.')
      navigate('/forgetPassword')
    }
  }, [firstToken, navigate, abortController])

  const onSetPassword = async () => {
    const password = form.getFieldValue('password')
    try {
      setPasswordFormLoading(true)
      await resetPassword(
        {
          token: secondToken,
          password,
        },
        abortController
      ).onErrorsButCancel(() => {
        message.error(
          'Something went wrong while setting new password. Please try again latter.'
        )
        setPasswordFormLoading(false)
      })
      setPasswordFormLoading(false)
      message.success(
        'The password has been reset succesfully. Please use the new password to login.'
      )
      navigate('/signIn')
    } catch (err) {}
  }

  return (
    <>
      <Typography.Title level={2}>Reset Your Password:</Typography.Title>
      {sendingFirstToken ? (
        <Loading />
      ) : (
        <Form
          layout='vertical'
          form={form}
          onFinish={onSetPassword}
          requiredMark={false}
        >
          <Form.Item
            name='password'
            label={
              <Typography.Title style={{ margin: 0 }} level={5}>
                New Password
              </Typography.Title>
            }
            rules={[
              { required: true, message: 'Please input your new password!' },
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
            <Input.Password
              placeholder='Please enter your new password.'
              disabled={passwordFormLoading}
            />
          </Form.Item>
          <Form.Item
            name='confirm'
            label={
              <Typography.Title style={{ margin: 0 }} level={5}>
                Confirm Password
              </Typography.Title>
            }
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
                    new Error(
                      'The two passwords that you entered do not match!'
                    )
                  )
                },
              }),
            ]}
          >
            <Input.Password disabled={passwordFormLoading} />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              loading={passwordFormLoading}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  )
}
