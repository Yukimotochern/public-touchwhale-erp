import { Typography, Form, Button, Input, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { resetPassword } from '../../api/userActions'
import { useAbortController } from '../../hooks/useAbortController'
import { Loading } from '../../components/loading/Loading'
import { useTranslation } from 'react-i18next'

export const ResetPasswordPage = () => {
  const { t } = useTranslation()
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
        message.error(t('errors.unknown'))
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
        )
          .onCustomCode(401, () => {
            message.error(t('errors.invalid_reset_password_link'))
            navigate('/forgetPassword')
          })
          .onErrorsButCancel(notGetToken)
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
      message.error(t('errors.invalid_reset_password_link'))
      navigate('/forgetPassword')
    }
  }, [firstToken, navigate, abortController, t])

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
      )
        .onCustomCode(401, () => {
          message.error(t('errors.invalid_reset_password_link'))
          navigate('/forgetPassword')
        })
        .onErrorsButCancel(() => {
          message.error(t('errors.unknown_error_when_reset_password'))
          navigate('/forgetPassword')
        })
      setPasswordFormLoading(false)
      message.success(t('auth.reset_password_success'))
      navigate('/signIn')
    } catch (err) {}
  }

  return (
    <>
      <Typography.Title level={2}>
        {t('auth.reset_password_title')}
      </Typography.Title>
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
                {t('auth.new_password')}
              </Typography.Title>
            }
            rules={[
              { required: true, message: t('auth.require_new_password') },
              {
                min: 8,
                message: t('auth.password_length'),
              },
              {
                max: 60,
                message: t('auth.password_length'),
              },
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder={t('auth.enter_new_password')}
              disabled={passwordFormLoading}
            />
          </Form.Item>
          <Form.Item
            name='confirm'
            label={
              <Typography.Title style={{ margin: 0 }} level={5}>
                {t('auth.confirm_password')}
              </Typography.Title>
            }
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: t('auth.require_confirm_password'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error(t('auth.password_mismatch')))
                },
              }),
            ]}
          >
            <Input.Password
              disabled={passwordFormLoading}
              placeholder={t('auth.enter_confirm_new_password')}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              loading={passwordFormLoading}
            >
              {t('auth.reset_password_button')}
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  )
}
