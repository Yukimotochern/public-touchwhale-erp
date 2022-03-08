import { JSONSchemaType } from 'ajv'
import ajv from '../../utils/ajv'
import { UserType } from './userTypes'

// Sign Up
const signUpBodySchema: JSONSchemaType<UserType.SignUpBody> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
  },
  required: ['email'],
  additionalProperties: false,
}
export const signUpBodyValidator = ajv.compile(signUpBodySchema)

// Sign In
const signInBodySchema: JSONSchemaType<UserType.SignInBody> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', nullable: true },
    login_name: { type: 'string', format: 'email', nullable: true },
    password: { type: 'string' },
  },
  required: ['password'],
  additionalProperties: false,
}
export const signInBodyValidator = ajv.compile(signInBodySchema)
