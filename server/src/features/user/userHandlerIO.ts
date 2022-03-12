import { JSONSchemaType } from 'ajv'
import { UserType } from './userTypes'
import { MongooseStaticsJSONSchema } from '../../utils/mongodb'
import { HandlerIO } from '../apiIO'

/*
  TEMPLATE HERE
  export class XXX extends HandlerIO {
    static bodyValidator = super.bodyValidatorCreator<UserType.XXXBody>()
    static sendData = super.sendDataCreator<UserType.XXXData>()
  }
*/

export namespace UserIO {
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

  export class SignUp extends HandlerIO {
    static bodyValidator = super.bodyValidatorCreator<UserType.SignUp.Body>(
      submitEmailSchema
    )
  }

  export class Verify extends HandlerIO {
    static bodyValidator = super.bodyValidatorCreator<UserType.Verify.Body>({
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
      additionalProperties: false,
    })
    static sendData = super.sendDataCreator<UserType.Verify.Data>({
      type: 'string',
    })
  }

  export class SignIn extends HandlerIO {
    static bodyValidator = super.bodyValidatorCreator<UserType.SignIn.Body>({
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', nullable: true },
        login_name: { type: 'string', format: 'email', nullable: true },
        password: { type: 'string' },
      },
      required: ['password'],
      additionalProperties: false,
    })
  }

  export class GetUser extends HandlerIO {
    static sendData = super.sendDataCreator<UserType.GetUser.Data>(
      plainUserSchema
    )
  }

  export class Update extends HandlerIO {
    static bodyValidator = super.bodyValidatorCreator<UserType.Update.Body>({
      type: 'object',
      properties: {
        username: { type: 'string', nullable: true },
        company: { type: 'string', nullable: true },
        avatar: { type: 'string', nullable: true },
      },
      required: [],
      additionalProperties: false,
    })
    static sendData = super.sendDataCreator<UserType.Update.Data>(
      plainUserSchema
    )
  }

  export class GetAvatarUploadUrl extends HandlerIO {
    static sendData = super.sendDataCreator<UserType.GetAvatarUploadUrl.Data>({
      type: 'object',
      properties: {
        avatar: { type: 'string' },
        uploadUrl: { type: 'string' },
      },
      required: ['avatar', 'uploadUrl'],
      additionalProperties: false,
    })
  }

  export class ChangePassword extends HandlerIO {
    static bodyValidator =
      super.bodyValidatorCreator<UserType.ChangePassword.Body>({
        type: 'object',
        properties: {
          currentPassword: { type: 'string', nullable: true },
          newPassword: { type: 'string' },
          token: { type: 'string', nullable: true },
        },
        required: ['newPassword'],
        additionalProperties: false,
      })
  }

  export class ForgetPassword extends HandlerIO {
    static bodyValidator =
      super.bodyValidatorCreator<UserType.ForgetPassword.Body>(
        submitEmailSchema
      )
  }

  export class ResetPassword extends HandlerIO {
    static bodyValidator =
      super.bodyValidatorCreator<UserType.ResetPassword.Body>({
        type: 'object',
        properties: {
          token: { type: 'string' },
          password: { type: 'string', nullable: true },
        },
        required: ['token'],
        additionalProperties: false,
      })
    static sendData = super.sendDataCreator<UserType.ResetPassword.Data>({
      type: 'object',
      properties: {
        token: { type: 'string', nullable: true },
      },
    })
  }
}
