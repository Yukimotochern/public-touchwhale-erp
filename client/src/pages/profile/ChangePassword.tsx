import { Button, Typography, Form, Input, message } from 'antd'
import React, { useState } from 'react'
import { changePassword } from '../../api/userActions'
import { useAbortController } from '../../hooks/useAbortController'
import { useTranslation } from 'react-i18next'

interface ChangePasswordProp {
  edittable?: boolean
}

export const ChangePassword = ({ edittable }: ChangePasswordProp) => {
  const { t } = useTranslation()
  const abortController = useAbortController()
  const [form] = Form.useForm()
  const [state, setState] = useState({
    loading: false,
    edit: false,
  })
  const onFinish = async () => {
    setState((state) => ({ ...state, loading: true }))
    try {
      const currentPassword = form.getFieldValue('currentPassword')
      const newPassword = form.getFieldValue('newPassword')
      await changePassword(
        {
          currentPassword,
          newPassword,
        },
        abortController
      )
        .onCustomCode(400, () => {
          form.setFields([
            {
              name: 'currentPassword',
              errors: [t('errors.invalid_password')],
            },
          ])
        })
        .onErrorsButCancelAndAuth(() => {
          setState((state) => ({ ...state, loading: false }))
        })
      setState((state) => ({ ...state, loading: false, edit: false }))
      message.success(t('auth.password_change_success'))
    } catch {}
  }
  if (!edittable) {
    return (
      <Typography.Text type='secondary' style={{ cursor: 'not-allowed' }}>
        {t('auth.google_no_password_info')}
      </Typography.Text>
    )
  } else {
    if (state.edit) {
      return (
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label={t('auth.current_password')}
            name='currentPassword'
            rules={[
              {
                required: true,
                message: t('auth.require_current_password'),
              },
            ]}
            hasFeedback
          >
            <Input type='password' />
          </Form.Item>
          <Form.Item
            name='newPassword'
            label={t('auth.new_password')}
            rules={[
              {
                required: true,
                message: t('auth.require_new_password'),
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
            <Input type='password' />
          </Form.Item>
          <Form.Item
            name='confirmPassword'
            dependencies={['newPassword']}
            hasFeedback
            label={t('auth.confirm_password')}
            rules={[
              {
                required: true,
                message: t('auth.require_confirm_password'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error(t('auth.password_mismatch')))
                },
              }),
            ]}
          >
            <Input type='password' />
          </Form.Item>
          <Form.Item>
            <Button
              onClick={() => {
                form.resetFields()
                setState((state) => ({ ...state, edit: false }))
              }}
              loading={state.loading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type='primary'
              style={{ marginLeft: '10px' }}
              htmlType='submit'
              loading={state.loading}
            >
              {t('common.change')}
            </Button>
          </Form.Item>
        </Form>
      )
    } else {
      return (
        <Button
          danger
          type='primary'
          size='small'
          onClick={() => {
            setState((state) => ({ ...state, edit: true }))
          }}
        >
          {t('auth.change_password')}
        </Button>
      )
    }
  }
}
