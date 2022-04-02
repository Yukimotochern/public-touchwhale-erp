import { Typography, Form, Button, Input, message, Row } from 'antd'
import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { forgetPassword } from '../../api/userActions'
import { useAbortController } from '../../hooks/useAbortController'
import useCountDown from 'react-countdown-hook'
import { useTranslation } from 'react-i18next'
const initialTime = 120 * 1000
const interval = 1000

export const ForgetPasswordPage = () => {
  const { t } = useTranslation()
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
          message.error(t('errors.google_use_password'))
          navigate('/signIn')
        })
        .onCustomCode(404, () => {
          message.error(t('errors.email_not_exist'))
          sendEmailForm.setFields([
            {
              name: 'email',
              errors: [t('errors.email_not_exist')],
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
      <Typography.Title level={2}>
        {t('forget_password_page.title')}
      </Typography.Title>
      {emailSent ? (
        <>
          <Row>
            <Typography.Text strong>
              {t('forget_password_page.email_sent', {
                email: sendEmailForm.getFieldValue('email'),
              })}
            </Typography.Text>
          </Row>
          <Row>
            <Typography.Text>
              {t('forget_password_page.not_reciving')}{' '}
              <Button
                type='link'
                htmlType='button'
                style={{
                  padding: '0px',
                }}
                onClick={onResent}
                disabled={timeLeft !== 0}
              >
                {t('common.resend')}
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
