import React from 'react'
import { Form, Input, Button, Divider, Typography } from 'antd'
import styles from './EmailEnterForm.module.css'
import { UseStateForSignUpPageProps } from './SignUpPage'
import { signUp } from 'api/dist/user/userApi'
import { useNavigate } from 'react-router-dom'

export const EmailEnterForm = ({
  signUpProcessState,
  setSignUpProcessState,
}: UseStateForSignUpPageProps) => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const onFinish = async () => {
    const email = form.getFieldValue('email')
    setSignUpProcessState((state) => ({
      ...state,
      loading: true,
      email,
    }))

    try {
      await signUp(email)
      setSignUpProcessState((state) => ({
        ...state,
        email,
        stage: 'verify',
        loading: false,
      }))
    } catch (err: any) {
      setSignUpProcessState((state) => ({
        ...state,
        loading: false,
      }))
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
        Sign up with Google
      </Button>
      <Divider plain>or</Divider>
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
              Email Address
            </Typography.Title>
          }
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Not a valid email' },
          ]}
          tooltip='This will be used as the username when you log in.'
        >
          <Input
            placeholder='Please enter an email address.'
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
            Next
          </Button>
        </Form.Item>
        <Form.Item>
          <Typography.Text
            style={{
              marginLeft: '10px',
            }}
          >
            Already have an account ?{' '}
            <Button
              type='link'
              htmlType='button'
              style={{
                padding: '0px',
              }}
              disabled={signUpProcessState.loading}
              onClick={() => navigate('/signIn')}
            >
              Log In
            </Button>
          </Typography.Text>
        </Form.Item>
      </Form>
    </>
  )
}
