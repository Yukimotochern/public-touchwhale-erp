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

const initialTime = 120 * 1000
const interval = 1000

export const VerifyEmailForm = ({
  signUpProcessState: { email },
  setSignUpProcessState,
}: UseStateForSignUpPageProps) => {
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
        { name: 'verify', errors: ['Incorrect verification code'] },
      ])
      message.error('Incorrect credentials.')
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
          message.error('Email has been registered. Please login.')
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
          throw new Error('Invalid credentials.')
        }
      } catch (err) {
        console.error(err)
        throw new Error('Invalid credentials.')
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
            className='trigger'
            transform={{ y: 1.4 }}
          />
        }
        size='large'
      >
        Back
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
            <Typography.Title level={5}>Verification Code</Typography.Title>
          }
          rules={[
            { required: true, message: 'Please enter the verification code.' },
            { min: 6, message: 'Please enter the verification code.' },
          ]}
          // validateTrigger='onSubmit'
        >
          <VerificationInput />
        </Form.Item>
        <Form.Item>
          <Typography.Text>The code has been sent to:</Typography.Text>
          <div style={{ marginLeft: 12 }}>
            <strong>{email}.</strong>
          </div>
          <Typography.Text>
            Didn't receive the code?
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
              Resend
            </Button>
            {timeLeft !== 0
              ? ` in ${timeLeft / 1000} second${timeLeft !== 1 ? 's' : ''}.`
              : null}
          </Typography.Text>
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' block>
            Next
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
