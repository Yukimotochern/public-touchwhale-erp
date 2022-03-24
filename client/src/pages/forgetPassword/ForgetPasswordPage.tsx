import { Typography, Form, Button, Input } from 'antd'
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { forgetPassword } from '../../api/userActions'

export const ForgetPassword = () => {
  const navigate = useNavigate()
  const { forgetPasswordToken } = useParams<'forgetPasswordToken'>()

  // email thing
  const [sendEmailForm] = Form.useForm()
  const [emailFormLoading, setEmailFormLoading] = React.useState(false)
  const onSendEmail = async () => {
    try {
      setEmailFormLoading(true)
      const email = sendEmailForm.getFieldValue('email')
      await forgetPassword(email)

      setEmailFormLoading(false)
    } catch (error) {
      setEmailFormLoading(false)
    }
  }

  // password thing
  const [setPasswordForm] = Form.useForm()
  const [passwordFormLoading, setPasswordFormLoading] = React.useState(false)
  const onSetPassword = async () => {}

  return (
    <>
      <Typography.Title level={2}>Reset Your Password:</Typography.Title>
      {forgetPasswordToken ? (
        <>Set up new password</>
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
              { type: 'email', message: 'Not a valid email' },
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
