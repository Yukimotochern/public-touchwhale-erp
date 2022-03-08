import { JSONSchemaType } from 'ajv'
import ajvInstance from '../../utils/ajv'
import { RegularUserType } from './regularUserType'

const signUpBodySchema: JSONSchemaType<RegularUserType.SignUpBody> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
  },
  required: ['email'],
  additionalProperties: false,
}

const signUpBodyValidator = ajvInstance.compile(signUpBodySchema)

const signInBodySchema: JSONSchemaType<RegularUserType.SignInBody> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  additionalProperties: false,
}

const signInBodyValidator = ajvInstance.compile(signInBodySchema)

const updateRegularUserBodySchema: JSONSchemaType<RegularUserType.UpdateBody> =
  {
    type: 'object',
    properties: {
      company_name: { type: 'string', nullable: true },
      username: { type: 'string', nullable: true },
      avatar: { type: 'string', nullable: true },
    },
    required: [],
    additionalProperties: false,
  }

const updateRegularUserBodyValidator = ajvInstance.compile(
  updateRegularUserBodySchema
)

// Change User Password Validator
interface ChangePasswordBodyType {
  currentPassword: string
  newPassword: string
  token?: string
}

const changePasswordBodySchema: JSONSchemaType<ChangePasswordBodyType> = {
  type: 'object',
  properties: {
    currentPassword: { type: 'string' },
    newPassword: { type: 'string' },
    token: { type: 'string', nullable: true },
  },
  required: ['newPassword'],
  additionalProperties: false,
}

const changePasswordBodyValidator = ajvInstance.compile(
  changePasswordBodySchema
)

const forgetPasswordBodySchema: JSONSchemaType<RegularUserType.ForgetPasswordBody> =
  {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
    additionalProperties: false,
  }

const forgetPasswordBodyValidator = ajvInstance.compile(
  forgetPasswordBodySchema
)

// User reset password Validator
const resetPasswordBodySchema: JSONSchemaType<RegularUserType.ResetPasswordBody> =
  {
    type: 'object',
    properties: {
      password: { type: 'string' },
    },
    required: ['password'],
    additionalProperties: false,
  }

const resetPasswordBodyValidator = ajvInstance.compile(resetPasswordBodySchema)

export {
  signInBodyValidator,
  signUpBodyValidator,
  updateRegularUserBodyValidator,
  changePasswordBodyValidator,
  forgetPasswordBodyValidator,
  resetPasswordBodyValidator,
}
