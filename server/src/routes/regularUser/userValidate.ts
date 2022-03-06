import { JSONSchemaType } from 'ajv'
import ajvInstance from '../../utils/ajv'
import { RegularUserType } from '../../models/RegularUser'

// This type ensure that the data format between json schema here and mongoose schema are in sync. If not, type error will be thrown. Also, by excluding forgetPasswordToken and other fields, potential database injections that update the token via api call will not happen.
// by Yuki
interface RegularUserEditableType
  extends Omit<
    RegularUserType,
    | 'createdAt'
    | 'updatedAt'
    | 'matchPassword'
    | 'provider'
    | 'active'
    | 'getForgetPasswordToken'
    | 'forgetPasswordToken'
    | 'forgetPasswordExpire'
    | 'resetEmailToken'
    | 'resetEmailExpire'
    | 'getSignedJWTToken'
  > {}

interface RegularUserSignUpBodyType
  extends Pick<RegularUserEditableType, 'email'> {}

// Bellow, the purpose of variable is more explicit. by Yuki
const signUpBodySchema: JSONSchemaType<RegularUserSignUpBodyType> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
  },
  required: ['email'],
  additionalProperties: false,
}

const signUpBodyValidator = ajvInstance.compile(signUpBodySchema)

// const signUpBodyValidator =

// SignIn Validator
// If someone ever changes 'email' to 'Email' in mongoose schema, error will occur here, by Yuki
interface RegularUserSignInBodyType
  extends Pick<RegularUserEditableType, 'email' | 'password'> {}

const signInBodySchema: JSONSchemaType<RegularUserSignInBodyType> = {
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
interface UpdateRegularUserBodyType
  extends Omit<RegularUserEditableType, 'email' | 'password'> {}

const updateRegularUserBodySchema: JSONSchemaType<UpdateRegularUserBodyType> = {
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

interface UpdateRegularUserEmailBodyType
  extends Pick<RegularUserEditableType, 'email'> {}

const updateRegularUserEmailBodySchema: JSONSchemaType<UpdateRegularUserEmailBodyType> =
  {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
    additionalProperties: false,
  }

const updateRegularUserEmailBodyValidator = ajvInstance.compile(
  updateRegularUserEmailBodySchema
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

// User Forget Password Validator
interface ForgetPasswordBodyType
  extends Pick<RegularUserEditableType, 'email'> {}

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
  extends Pick<RegularUserEditableType, 'password'> {}

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
  updateRegularUserBodyValidator,
  updateRegularUserEmailBodyValidator,
  changePasswordBodyValidator,
  forgetPasswordBodyValidator,
  resetPasswordBodyValidator,
}
