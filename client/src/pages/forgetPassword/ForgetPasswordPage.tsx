import { Typography, Form, Button, Input, message, Row } from 'antd'
import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { forgetPassword } from '../../api/userActions'
import { useAbortController } from '../../hooks/useAbortController'
import useCountDown from 'react-countdown-hook'
const initialTime = 120 * 1000
const interval = 1000

export const ForgetPasswordPage = () => {
  // resend count down
  const [timeLeft, { start }] = useCountDown(initialTime, interval)
  const restart = useCallback(() => {
    start()
  }, [start])

  const abortController = useAbortController()
  const navigate = useNavigate()
  // email thing
  const [sendEmailForm] = Form.useForm()
  const [emailFormLoading, setEmailFormLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const onSendEmail = async () => {
    try {
      setEmailFormLoading(true)
      const email = sendEmailForm.getFieldValue('email')
      await forgetPassword(email, abortController)
        .onCustomCode(409, () => {
          message.error(
            'You have been using the Google login. Please use google to login. Please use that method.'
          )
          navigate('/signIn')
        })
        .onCustomCode(404, () => {
          message.error('There is no user with that email.')
          sendEmailForm.setFields([
            {
              name: 'email',
              errors: ['There is no user with that email.'],
            },
          ])
          setEmailFormLoading(false)
        })
        .onErrorsButCancel(() => {
          setEmailFormLoading(false)
        })
      setEmailFormLoading(false)
      setEmailSent(true)
      restart()
    } catch (error) {}
  }
  const onResent = () => setEmailSent(false)

  return (
    <>
      <Typography.Title level={2}>Reset Your Password:</Typography.Title>
      {emailSent ? (
        <>
          <Row>
            <Typography.Text strong>
              An email has been sent to {sendEmailForm.getFieldValue('email')}.
              Please click the link attached to reset your password.
            </Typography.Text>
          </Row>
          <Row>
            <Typography.Text>
              Don't receive the email ?{' '}
              <Button
                type='link'
                htmlType='button'
                style={{
                  padding: '0px',
                }}
                onClick={onResent}
                disabled={timeLeft !== 0}
              >
                Resend
              </Button>
              {timeLeft !== 0
                ? ` in ${timeLeft / 1000} second${timeLeft !== 1 ? 's' : ''}.`
                : null}
            </Typography.Text>
          </Row>
        </>
      ) : (
        <Form
          layout='vertical'
          form={sendEmailForm}
          onFinish={onSendEmail}
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
              {
                type: 'email',
                message:
                  'Not a valid email. If your logged in with username, please contact your business owner to reset password for you.',
              },
            ]}
            tooltip='Please enter the email address that you registered with.'
          >
            <Input
              placeholder='Please enter an email address.'
              disabled={emailFormLoading}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              loading={emailFormLoading}
            >
              Next
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
                disabled={emailFormLoading}
                onClick={() => navigate('/signUp')}
              >
                Sign Up
              </Button>
            </Typography.Text>
          </Form.Item>
        </Form>
      )}
    </>
  )
}
