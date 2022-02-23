import { JSONSchemaType } from 'ajv'
import ajvInstance from './ajv-instance'

// Signup Validator
interface UserSignup {
	company_name: string
	email: string
	password: string
	avatar: string
}

const signup_schema: JSONSchemaType<UserSignup> = {
	type: 'object',
	properties: {
		company_name: { type: 'string' },
		email: { type: 'string', format: 'email' },
		password: { type: 'string' },
		avatar: { type: 'string' },
	},
	required: ['email', 'password'],
	additionalProperties: false,
}

const signup_validate = ajvInstance.compile(signup_schema)

// Signin Validator
interface UserSignin {
	email: string
	password: string
}

const signin_schema: JSONSchemaType<UserSignin> = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email' },
		password: { type: 'string' },
	},
	required: ['email', 'password'],
	additionalProperties: false,
}

const signin_validate = ajvInstance.compile(signin_schema)

// Update user Validator
interface UpdateUser {
	company_name: string
	email: string
}

const updateuser_schema: JSONSchemaType<UpdateUser> = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email' },
		company_name: { type: 'string' },
	},
	required: [],
	additionalProperties: false,
}

const updateuser_validate = ajvInstance.compile(updateuser_schema)

// Change user password Validator
interface ChangePassword {
	currentPassword: string
	newPassword: string
}

const changepassword_schema: JSONSchemaType<ChangePassword> = {
	type: 'object',
	properties: {
		currentPassword: { type: 'string' },
		newPassword: { type: 'string' },
	},
	required: ['currentPassword', 'newPassword'],
	additionalProperties: false,
}

const changepassword_validate = ajvInstance.compile(changepassword_schema)

// User forget password Validator
interface ForgetPassword {
	email: string
}

const forgetpassword_schema: JSONSchemaType<ForgetPassword> = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email' },
	},
	required: ['email'],
	additionalProperties: false,
}

const forgetpassword_validate = ajvInstance.compile(forgetpassword_schema)

// User reset password Validator
interface ResetPassword {
	password: string
}

const resetpassword_schema: JSONSchemaType<ResetPassword> = {
	type: 'object',
	properties: {
		password: { type: 'string' },
	},
	required: ['password'],
	additionalProperties: false,
}

const resetpassword_validate = ajvInstance.compile(resetpassword_schema)

export {
	signin_validate,
	signup_validate,
	updateuser_validate,
	changepassword_validate,
	forgetpassword_validate,
	resetpassword_validate,
}
