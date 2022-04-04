import React, { useEffect, useCallback } from 'react'
import styles from './VerifyEmailForm.module.css'
import { Form, Button, Typography, message } from 'antd'
import VerificationInput from '../../components/VerificationInput/VerificationInput'
import { UseStateForSignUpPageProps } from './SignUpPage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// count down
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import useCountDown from 'react-countdown-hook'
import { verify, signUp } from '../../api/userActions'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { isErrorButApiError, notApiError } from 'api/dist/utils/errorTypeGuards'
import { useAbortController } from '../../hooks/useAbortController'
import { useTranslation } from 'react-i18next'

const initialTime = 120 * 1000
const interval = 1000

export const VerifyEmailForm = ({
  signUpProcessState: { email },
  setSignUpProcessState,
}: UseStateForSignUpPageProps) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const abortController = useAbortController()

  // resend count down
  const [timeLeft, { start }] = useCountDown(initialTime, interval)
  const restart = useCallback(() => {
    start()
  }, [start])
  useEffect(() => {
    start()
  }, [start])

  const [form] = Form.useForm()
  const onResend = async () => {
    setSignUpProcessState((state) => ({
      ...state,
      loading: true,
    }))
    restart()
    try {
      await signUp(email, abortController).onErrorsButCancel(() => {
        setSignUpProcessState((state) => ({
          ...state,
          loading: false,
        }))
      })
      setSignUpProcessState((state) => ({
        ...state,
        loading: false,
      }))
    } catch {}
  }
  const onFinish = async () => {
    setSignUpProcessState((state) => ({
      ...state,
      loading: true,
    }))
    const onInvalidCredential = () => {
      form.setFields([
        { name: 'verify', errors: [t('errors.invalid_verification')] },
      ])
      message.error(t('errors.invalid_verification'))
      setSignUpProcessState((state) => ({
        ...state,
        loading: false,
      }))
    }
    try {
      const password = form.getFieldValue('verify')

      const tokenStr = await verify(
        {
          email,
          password,
        },
        abortController
      )
        .onCustomCode(401, onInvalidCredential)
        .onCustomCode(409, () => {
          message.error(t('errors.email_taken'))
          navigate('/signIn')
        })
        .onErrorsButCancel(() => {
          setSignUpProcessState((state) => ({
            ...state,
            loading: false,
          }))
        })
      // try to decode token
      let token: any
      try {
        token = jwt_decode(tokenStr)
        if (!token.id) {
          throw new Error(t('errors.invalid_verification'))
        }
      } catch (err) {
        console.error(err)
        throw new Error(t('errors.invalid_verification'))
      }
      setSignUpProcessState((state) => ({
        ...state,
        stage: 'password',
        loading: false,
        token: tokenStr,
        password,
      }))
    } catch (err) {
      if (isErrorButApiError(err) && err.message === 'Invalid credentials.') {
        onInvalidCredential()
      } else if (notApiError(err)) {
        setSignUpProcessState((state) => ({
          ...state,
          loading: false,
        }))
      }
    }
  }
  return (
    <>
      <Button
        className={styles['bottom-back']}
        type='link'
        onClick={() =>
          setSignUpProcessState((state) => ({
            ...state,
            stage: 'email',
          }))
        }
        icon={
          <FontAwesomeIcon
            style={{ marginRight: '13px' }}
            icon={faArrowLeft}
            className={styles['trigger']}
            transform={{ y: 1.4 }}
          />
        }
        size='large'
      >
        {t('common.back')}
      </Button>
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
          name='verify'
          label={
            <Typography.Title level={5}>
              {t('auth.verification_code')}
            </Typography.Title>
          }
          rules={[
            { required: true, message: t('auth.require_verification_code') },
            { min: 6, message: t('errors.verification_code_length') },
          ]}
          // validateTrigger='onSubmit'
        >
          <VerificationInput />
        </Form.Item>
        <Form.Item>
          <Typography.Text>{t('auth.verification_code_sent')}</Typography.Text>
          <div style={{ marginLeft: 12 }}>
            <strong>{email}.</strong>
          </div>
          <Typography.Text>
            {t('auth.not_receive_code')}{' '}
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
                paddingLeft: '5px',
              }}
              disabled={timeLeft !== 0}
              onClick={onResend}
            >
              {t('common.resend')}
            </Button>
            {timeLeft !== 0 && !i18n.language.includes('zh')
              ? t('auth.resend_time_left', {
                  count: Math.ceil(timeLeft / 1000),
                })
              : null}
          </Typography.Text>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' block>
            {t('common.next')}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
