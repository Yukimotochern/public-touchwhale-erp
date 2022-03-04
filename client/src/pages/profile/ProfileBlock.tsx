import React, { useState } from 'react'
import { Button, Form, Input, Row, Col } from 'antd'
interface ProfileBlockProps {
  fieldName: string
  type: 'display' | 'edit' | 'password'
  initialValue: any
}

export const ProfileBlock: React.FC<ProfileBlockProps> = ({
  fieldName,
  initialValue,
  type,
  children,
}) => {
  const [form] = Form.useForm()
  const [value, setValue] = useState(initialValue)
  const onFinish = () => {
    console.log(form.isFieldsTouched(['12', '23'], true))
  }
  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={8}>
      {/* Title */}
      {/* Display Children */}
      {type === 'display' ? (
        <>
          {children}
          {/* Submit Changes */}
          <Form>
            <Form.Item></Form.Item>
          </Form>
        </>
      ) : null}
      {type === 'edit' ? (
        <Form>
          <Form.Item name={fieldName}></Form.Item>
        </Form>
      ) : null}
    </Col>
  )
}
