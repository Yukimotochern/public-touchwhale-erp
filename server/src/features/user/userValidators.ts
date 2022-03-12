import { JSONSchemaType } from 'ajv'
import ajv from '../../utils/ajv'
import { UserType } from './userTypes'
import { sendDataCreator } from '../../utils/customExpress'
import { MongooseStaticsJSONSchema } from '../../utils/mongodb'

export namespace UserValidator {
  // Template
  /*
   export namespace XXX {
    const bodySchema: JSONSchemaType<UserType.XXXBody> = {
      type: 'object',
      properties: {
      },
      required: [],
      additionalProperties: false,
    }
    export const body = ajv.compile(bodySchema)
    const dataSchema: JSONSchemaType<UserType.XXXData> = { type: '' }
    const data = ajv.compile(dataSchema)
    export const sendData = sendDataCreator<UserType.XXXData>(data)
  }
  */
  const plainUserSchema: JSONSchemaType<UserType.PlainUser> = {
    type: 'object',
    properties: {
      ...MongooseStaticsJSONSchema,
      isOwner: { type: 'boolean' },
      isActive: { type: 'boolean' },
      provider: { type: 'string', enum: ['Google', 'TouchWhale'] },
      email: { type: 'string', nullable: true },
      login_name: { type: 'string', nullable: true },
      username: { type: 'string', nullable: true },
      company: { type: 'string', nullable: true },
      avatar: { type: 'string', nullable: true },
      createdAt: {
        anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
      },
      updatedAt: {
        anyOf: [{ type: 'object', required: [] }, { type: 'string' }],
      },
    },
    required: ['isOwner', 'isActive', 'provider', 'createdAt', 'updatedAt'],
    additionalProperties: false,
  }
  const submitEmailSchema: JSONSchemaType<UserType.SubmitEmail> = {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
    additionalProperties: false,
  }

  export namespace SignUp {
    export const body = ajv.compile(submitEmailSchema)
    export const sendData = sendDataCreator<UserType.SignUpBody>(body)
  }
  export namespace Verify {
    // body to accept
    const bodySchema: JSONSchemaType<UserType.VerifyBody> = {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
      additionalProperties: false,
    }
    export const body = ajv.compile(bodySchema)
    // data to send back
    const dataSchema: JSONSchemaType<UserType.VerifyData> = { type: 'string' }
    const data = ajv.compile(dataSchema)
    export const sendData = sendDataCreator<UserType.VerifyData>(data)
  }

  export namespace SignIn {
    const bodySchema: JSONSchemaType<UserType.SignInBody> = {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', nullable: true },
        login_name: { type: 'string', format: 'email', nullable: true },
        password: { type: 'string' },
      },
      required: ['password'],
      additionalProperties: false,
    }
    export const body = ajv.compile(bodySchema)
  }

  export namespace GetUser {
    const data = ajv.compile(plainUserSchema)
    export const sendData = sendDataCreator<UserType.GetUserData>(data)
  }

  export namespace Update {
    const bodySchema: JSONSchemaType<UserType.UpdateBody> = {
      type: 'object',
      properties: {
        username: { type: 'string', nullable: true },
        company: { type: 'string', nullable: true },
        avatar: { type: 'string', nullable: true },
      },
      required: [],
      additionalProperties: false,
    }
    export const body = ajv.compile(bodySchema)
    const data = ajv.compile(plainUserSchema)
    export const sendData = sendDataCreator<UserType.UpdateData>(data)
  }

  export namespace GetAvatarUploadUrl {
    const dataSchema: JSONSchemaType<UserType.GetAvatarUploadUrlData> = {
      type: 'object',
      properties: {
        avatar: { type: 'string' },
        uploadUrl: { type: 'string' },
      },
      required: ['avatar', 'uploadUrl'],
      additionalProperties: false,
    }
    const data = ajv.compile(dataSchema)
    export const sendData =
      sendDataCreator<UserType.GetAvatarUploadUrlData>(data)
  }

  export namespace ChangePassword {
    const bodySchema: JSONSchemaType<UserType.ChangePasswordBody> = {
      type: 'object',
      properties: {
        currentPassword: { type: 'string', nullable: true },
        newPassword: { type: 'string' },
        token: { type: 'string', nullable: true },
      },
      required: ['newPassword'],
      additionalProperties: false,
    }
    export const body = ajv.compile(bodySchema)
  }

  export namespace ForgetPassword {
    export const body = ajv.compile(submitEmailSchema)
  }

  export namespace ResetPassword {
    const bodySchema: JSONSchemaType<UserType.ResetPasswordBody> = {
      type: 'object',
      properties: {
        token: { type: 'string' },
        password: { type: 'string', nullable: true },
      },
      required: ['token'],
      additionalProperties: false,
    }
    export const body = ajv.compile(bodySchema)
    const dataSchema: JSONSchemaType<UserType.ResetPasswordData> = {
      type: 'object',
      properties: {
        token: { type: 'string', nullable: true },
      },
    }
    const data = ajv.compile(dataSchema)
    export const sendData = sendDataCreator<UserType.ResetPasswordData>(data)
  }

  // Template
  /*
   export namespace XXX {
    const bodySchema: JSONSchemaType<UserType.XXXBody> = {
      type: 'object',
      properties: {
      },
      required: [],
      additionalProperties: false,
    }
    export const body = ajv.compile(bodySchema)
    const dataSchema: JSONSchemaType<UserType.XXXData> = { type: '' }
    const data = ajv.compile(dataSchema)
    export const sendData = sendDataCreator<UserType.XXXData>(data)
  }
  */
}
