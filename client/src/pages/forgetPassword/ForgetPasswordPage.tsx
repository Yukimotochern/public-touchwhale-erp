import { Typography, Form, Button, Input, message, Row } from 'antd'
import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { forgetPassword } from '../../api/userActions'
import { useAbortController } from '../../hooks/useAbortController'
import useCountDown from 'react-countdown-hook'
import { useTranslation } from 'react-i18next'
import i18n from '../../utils/i18n'
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
        {t('auth.reset_password_title')}
      </Typography.Title>
      {emailSent ? (
        <>
          <Row>
            <Typography.Text strong>
              {t('auth.email_sent', {
                email: sendEmailForm.getFieldValue('email'),
              })}
            </Typography.Text>
          </Row>
          <Row>
            <Typography.Text>
              {t('auth.not_reciving')}{' '}
              {timeLeft !== 0 && i18n.language.includes('zh')
                ? t('auth.resend_time_left', {
                    count: Math.ceil(timeLeft / 1000),
                  })
                : null}
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
              {timeLeft !== 0 && !i18n.language.includes('zh')
                ? t('auth.resend_time_left', {
                    count: Math.ceil(timeLeft / 1000),
                  })
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
                {t('auth.email_address')}
              </Typography.Title>
            }
            rules={[
              { required: true, message: t('errors.email_required') },
              {
                type: 'email',
                message: t('errors.invalid_email'),
              },
            ]}
            tooltip={t('auth.enter_email')}
          >
            <Input
              placeholder={t('auth.enter_email_short')}
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
              {t('common.next')}
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
                disabled={emailFormLoading}
                onClick={() => navigate('/signUp')}
              >
                {t('auth.sign_up')}
              </Button>
            </Typography.Text>
          </Form.Item>
        </Form>
      )}
    </>
  )
}
