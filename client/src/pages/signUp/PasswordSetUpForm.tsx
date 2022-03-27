import React from 'react'
import { Form, Button, Input } from 'antd'
import { UseStateForSignUpPageProps } from './SignUpPage'
import styles from './PasswordSetUpForm.module.css'
import { changePassword } from '../../api/userActions'
import { useDispatch } from 'react-redux'
import { getUserThunkAction } from '../../redux/auth/authSlice'

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
      await changePassword({
        currentPassword: password,
        newPassword: form.getFieldValue('password'),
        token,
      })
      dispatch(getUserThunkAction())
    } catch {}
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
