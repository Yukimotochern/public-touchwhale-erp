import { JSONSchemaType } from 'ajv'
import ajvInstance from '../../utils/ajv'
import { RegularUserType } from '../../models/RegularUser'

// This type ensure that the data format between json schema here and mongoose schema are in sync. If not, type error will be thrown. Also, by excluding forgetPasswordToken and other fields, potential database injections that update the token via api call will not happen.
// by Yuki
interface RegualrUserEditableType
  extends Omit<
    RegularUserType,
    | 'createdAt'
    | 'updatedAt'
    | 'matchPassword'
    | 'getForgetPasswordToken'
    | 'forgetPasswordToken'
    | 'forgetPasswordExpire'
    | 'resetEmailToken'
    | 'resetEmailExpire'
    | 'getSignedJWTToken'
  > {}

// Bellow, the purpose of variable is more explicit. by Yuki
const signUpBodySchema: JSONSchemaType<RegualrUserEditableType> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
    company_name: { type: 'string', nullable: true },
    avatar: { type: 'string', nullable: true },
  },
  required: ['email', 'password'],
  additionalProperties: false,
}

const signUpBodyValidator = ajvInstance.compile(signUpBodySchema)

// const signUpBodyValidator =

// SignIn Validator
// If someone ever changes 'email' to 'Email' in mongoose schema, error will occur here, by Yuki
interface RegualrUserSignInBodyType
  extends Pick<RegualrUserEditableType, 'email' | 'password'> {}

const signInBodySchema: JSONSchemaType<RegualrUserSignInBodyType> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  additionalProperties: false,
}

const signInBodyValidator = ajvInstance.compile(signInBodySchema)

// Update User Validator
// 'avatar' needs another route implementing cloud storage, which will be done latter
// When updating email, the user should receive the reset-email-token sendding to the new email address.
// That is to ensure that the user does not have typo in the email and really own that email address. by Yuki
interface UpdateRegualrUserBodyType
  extends Omit<RegualrUserEditableType, 'email' | 'password' | 'avatar'> {}

const updateRegualrUserBodySchema: JSONSchemaType<UpdateRegualrUserBodyType> = {
  type: 'object',
  properties: {
    company_name: { type: 'string', nullable: true },
  },
  required: [],
  additionalProperties: false,
}

const updateRegualrUserBodyValidator = ajvInstance.compile(
  updateRegualrUserBodySchema
)

interface UpdateRegualrUserEmailBodyType
  extends Pick<RegualrUserEditableType, 'email'> {}

const updateRegualrUserEmailBodySchema: JSONSchemaType<UpdateRegualrUserEmailBodyType> =
  {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
    additionalProperties: false,
  }

const updateRegualrUserEmailBodyValidator = ajvInstance.compile(
  updateRegualrUserEmailBodySchema
)

// Change User Password Validator
interface ChangePasswordBodyType {
  currentPassword: string
  newPassword: string
}

const changePasswordBodySchema: JSONSchemaType<ChangePasswordBodyType> = {
  type: 'object',
  properties: {
    currentPassword: { type: 'string' },
    newPassword: { type: 'string' },
  },
  required: ['currentPassword', 'newPassword'],
  additionalProperties: false,
}

const changePasswordBodyValidator = ajvInstance.compile(
  changePasswordBodySchema
)

// User Forget Password Validator
interface ForgetPasswordBodyType
  extends Pick<RegualrUserEditableType, 'email'> {}

const forgetPasswordBodySchema: JSONSchemaType<ForgetPasswordBodyType> = {
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
interface ResetPasswordBodyType
  extends Pick<RegualrUserEditableType, 'password'> {}

const resetPasswordBodySchema: JSONSchemaType<ResetPasswordBodyType> = {
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
  updateRegualrUserBodyValidator,
  updateRegualrUserEmailBodyValidator,
  changePasswordBodyValidator,
  forgetPasswordBodyValidator,
  resetPasswordBodyValidator,
}
