import React from 'react'
import { Form, Input, Button, Divider, Typography } from 'antd'
import styles from './EmailEnterForm.module.css'
import { UseStateForSignUpPageProps } from './SignUpPage'
import { signUp } from '../../api/userActions'
import { useNavigate } from 'react-router-dom'
import { useAbortController } from '../../hooks/useAbortController'
import { useTranslation } from 'react-i18next'

export const EmailEnterForm = ({
  signUpProcessState,
  setSignUpProcessState,
}: UseStateForSignUpPageProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const abortController = useAbortController()
  const onFinish = async () => {
    const email = form.getFieldValue('email')
    setSignUpProcessState((state) => ({
      ...state,
      loading: true,
      email,
    }))
    try {
      await signUp(email, abortController)
        .onCustomCode(409, () => {
          form.setFields([
            {
              name: 'email',
              errors: [t('errors.email_taken')],
            },
          ])
        })
        .onErrorsButCancel(() => {
          setSignUpProcessState((state) => ({
            ...state,
            loading: false,
          }))
        }, true)
      setSignUpProcessState((state) => ({
        ...state,
        email,
        stage: 'verify',
        loading: false,
      }))
    } catch {
      // catch non api error
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
        onClick={() => {
          window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/user/googleOAuth`
        }}
      >
        {t('auth.google_signup_button')}
      </Button>
      <Divider plain>{t('common.or')}</Divider>
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
              {t('auth.email_address')}
            </Typography.Title>
          }
          rules={[
            { required: true, message: t('auth.enter_email') },
            { type: 'email', message: t('auth.sign_up_invalid_email') },
          ]}
          tooltip={t('auth.email_tooltip')}
        >
          <Input
            placeholder={t('auth.enter_email_sign_up')}
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
            {t('common.next')}
          </Button>
        </Form.Item>
        <Form.Item>
          <Typography.Text
            style={{
              marginLeft: '10px',
            }}
          >
            {t('auth.have_account')}{' '}
            <Button
              type='link'
              htmlType='button'
              style={{
                padding: '0px',
              }}
              disabled={signUpProcessState.loading}
              onClick={() => navigate('/signIn')}
            >
              {t('auth.login_button')}
            </Button>
          </Typography.Text>
        </Form.Item>
      </Form>
    </>
  )
}
