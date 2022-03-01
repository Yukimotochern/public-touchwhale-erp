import React, { useState } from 'react'
import { Typography } from 'antd'
import styles from './SignUpPage.module.css'
import { EmailEnterForm } from './EmailEnterForm'
import { VerifyEmailForm } from './VerifyEmailForm'
import { PasswordSetUpForm } from './PasswordSetUpForm'

export interface SignUpProcess {
  stage: 'email' | 'verify' | 'password'
  loading: boolean
  email: string
  token: string
  password: string
}

export interface SetSignUpProcess
  extends React.Dispatch<React.SetStateAction<SignUpProcess>> {}

export interface UseStateForSignUpPageProps {
  signUpProcessState: SignUpProcess
  setSignUpProcessState: SetSignUpProcess
}

const initialSignUpState: SignUpProcess = {
  stage: 'email',
  loading: false,
  email: '',
  token: '',
  password: '',
}

export const SignUpPage = () => {
  const [signUpProcessState, setSignUpProcessState] =
    useState<SignUpProcess>(initialSignUpState)

  let signUpFormView: React.ReactElement
  switch (signUpProcessState.stage) {
    case 'email':
      signUpFormView = (
        <EmailEnterForm
          setSignUpProcessState={setSignUpProcessState}
          signUpProcessState={signUpProcessState}
        />
      )
      break
    case 'verify':
      signUpFormView = (
        <VerifyEmailForm
          setSignUpProcessState={setSignUpProcessState}
          signUpProcessState={signUpProcessState}
        />
      )
      break
    case 'password':
      signUpFormView = (
        <PasswordSetUpForm
          setSignUpProcessState={setSignUpProcessState}
          signUpProcessState={signUpProcessState}
        />
      )
      break
  }
  return (
    <>
      <div className={styles['app-logo']}>
        <img alt='' src='/logo128.png' width='50' height='50' />{' '}
        <span>TWhale ERP</span>
      </div>
      <Typography.Title level={2}>Create your account:</Typography.Title>
      {signUpFormView}
    </>
  )
}
