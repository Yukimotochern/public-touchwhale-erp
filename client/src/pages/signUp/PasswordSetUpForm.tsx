import React from 'react'
import { Form, Button, Input } from 'antd'
import { UseStateForSignUpPageProps } from './SignUpPage'
import styles from './PasswordSetUpForm.module.css'
import { changePassword } from '../../api/userActions'
import { useDispatch } from 'react-redux'
import { getUserThunkAction } from '../../redux/auth/authSlice'
import { useTranslation } from 'react-i18next'

export const PasswordSetUpForm = ({
  signUpProcessState: { token, password, loading },
  setSignUpProcessState,
}: UseStateForSignUpPageProps) => {
  const { t } = useTranslation()
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
          label={t('profile.password')}
          rules={[
            {
              required: true,
              message: t('auth.required_password'),
            },
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
            disabled={loading}
            placeholder={t('auth.enter_password')}
          />
        </Form.Item>

        <Form.Item
          name='confirm'
          label={t('auth.confirm_password')}
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
            disabled={loading}
            placeholder={t('auth.enter_confirm_password')}
          />
        </Form.Item>
        <Form.Item>
          <Button
            className={styles['proceed-button']}
            type='primary'
            htmlType='submit'
            block
            loading={loading}
          >
            {t('auth.join_now')}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
