import React from 'react'
import { Form, Button, Input, message } from 'antd'
import { UseStateForSignUpPageProps } from './SignUpPage'
import styles from './PasswordSetUpForm.module.css'
import api from '../../utils/api'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { getRegularUser } from '../../redux/auth/authSlice'

export const PasswordSetUpForm = ({
  signUpProcessState: { token, password, loading },
  setSignUpProcessState,
}: UseStateForSignUpPageProps) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const onFinish = async () => {
    setSignUpProcessState((state) => ({
      ...state,
      loading: true,
    }))
    try {
      await api.put('/user/changePassword', {
        currentPassword: password,
        newPassword: form.getFieldValue('password'),
        token,
      })
      dispatch(getRegularUser())
    } catch (err) {
      console.error(err)
      if (axios.isAxiosError(err)) {
        if (err.response?.data) {
          message.error(`Something is wrong: ${err.response.data.message}`)
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
    }
  }
  return (
    <>
      <Form
        layout='vertical'
        form={form}
        onFinish={onFinish}
        requiredMark={false}
        style={{
          marginTop: '2.5em',
        }}
      >
        <Form.Item
          name='password'
          label='Password'
          rules={[
            {
              required: true,
              message: 'Please input your password!',
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
          <Input.Password disabled={loading} />
        </Form.Item>

        <Form.Item
          name='confirm'
          label='Confirm Password'
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
                  new Error('The two passwords that you entered do not match!')
                )
              },
            }),
          ]}
        >
          <Input.Password disabled={loading} />
        </Form.Item>
        <Form.Item>
          <Button
            className={styles['proceed-button']}
            type='primary'
            htmlType='submit'
            block
            loading={loading}
          >
            Join NOW!
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
