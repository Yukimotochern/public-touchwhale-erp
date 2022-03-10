import { JSONSchemaType } from 'ajv'
import ajv from '../../utils/ajv'
import { UserType } from './userTypes'
import { sendDataCreator } from '../../utils/customExpress'

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

  export namespace SignUp {
    const schema: JSONSchemaType<UserType.SignUpBody> = {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
      },
      required: ['email'],
      additionalProperties: false,
    }
    export const body = ajv.compile(schema)
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
