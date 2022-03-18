import React, { useEffect, useCallback } from 'react'
import styles from './VerifyEmailForm.module.css'
import { Form, Button, Typography, message } from 'antd'
import VerificationInput from '../../components/VerificationInput/VerificationInput'
import { UseStateForSignUpPageProps } from './SignUpPage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// count down
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import useCountDown from 'react-countdown-hook'
import api from '../../api/api'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
const initialTime = 30 * 1000
const interval = 1000

export const VerifyEmailForm = ({
  signUpProcessState: { email },
  setSignUpProcessState,
}: UseStateForSignUpPageProps) => {
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
      await api.post('/user/signUp', {
        email,
      })
      setSignUpProcessState((state) => ({
        ...state,
        loading: false,
      }))
    } catch (err: any) {
      console.error(err)
      if (axios.isAxiosError(err)) {
        if (err.response?.data) {
          // error with response
          switch (err.response?.data?.error?.message) {
            default:
              message.error(`Something is wrong: ${err.message}`)
              break
          }
        } else {
          // error without response
          switch (err.message) {
            case 'Network Error':
              message.error('Please check your internet connection.')
              break
            default:
              message.error(`Something is wrong: ${err.message}`)
              break
          }
        }
      } else {
        message.error(`Unknown error: ${err}`)
      }
      setSignUpProcessState((state) => ({
        ...state,
        loading: false,
      }))
    }
  }
  const onFinish = async () => {
    setSignUpProcessState((state) => ({
      ...state,
      loading: true,
    }))
    try {
      const password = form.getFieldValue('verify')
      const { data } = await api.post('/user/signUp/verify', {
        email,
        password,
      })
      // try to decode token
      let token: any
      try {
        token = jwt_decode(data.token)
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
        token: data.token,
        password,
      }))
    } catch (err) {
      console.error(err)
      if (axios.isAxiosError(err)) {
        if (err.response?.data) {
          // error with response
          switch (err.response?.data?.error?.message) {
            case 'Invalid credentials.':
              form.setFields([
                { name: 'verify', errors: ['Incorrect verification code'] },
              ])
              message.error('Incorrect verification code')
              break
            default:
              message.error(`Something is wrong: ${err.message}`)
              break
          }
        } else {
          // error without response
          switch (err.message) {
            case 'Invalid credentials.':
              form.setFields([
                { name: 'verify', errors: ['Incorrect verification code'] },
              ])
              message.error('Incorrect verification code')
              break
            case 'Network Error':
              message.error('Please check your internet connection.')
              break
            default:
              message.error(`Something is wrong: ${err.message}`)
              break
          }
        }
      } else {
        message.error(`Unknown error: ${err}`)
      }

      setSignUpProcessState((state) => ({
        ...state,
        loading: false,
      }))
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
