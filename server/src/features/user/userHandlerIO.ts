import { JSONSchemaType } from 'ajv'
import { UserType } from './userTypes'
import {
	MongooseStaticsJSONSchema,
	MongooseStampsJSONSchema,
} from '../../utils/mongodb'
import { HandlerIO } from '../apiIO'
import { TwPermissons } from '../../middlewares/permission/permissionType'
import { User } from 'aws-sdk/clients/budgets'

/*
  TEMPLATE HERE
  export class XXX extends HandlerIO {
    static bodyValidator = super.bodyValidatorCreator<yyyType.XXXBody>({<bodySchema>})
    static sendData = super.sendDataCreator<yyyType.XXXData>({dataSchema})
  }
*/

export namespace UserIO {
	const permissionFields = {
		role: { type: 'string', nullable: true },
		permission_groups: {
			type: 'array',
			items: {
				type: 'string',
				enum: TwPermissons.permissionGroupNameSet,
			},
			nullable: true,
		},
		role_type: {
			type: 'string',
			enum: ['default', 'custom'],
			nullable: true,
		},
	} as const
	export const plainUserSchema: JSONSchemaType<UserType.PlainUser> = {
		type: 'object',
		properties: {
			...MongooseStaticsJSONSchema,
			...MongooseStampsJSONSchema,
			isOwner: { type: 'boolean' },
			owner: { type: 'string', nullable: true },
			isActive: { type: 'boolean' },
			provider: { type: 'string', enum: ['Google', 'TouchWhale'] },
			email: { type: 'string', nullable: true, format: 'email' },
			login_name: { type: 'string', nullable: true },
			username: { type: 'string', nullable: true },
			company: { type: 'string', nullable: true },
			avatar: { type: 'string', nullable: true },
			...permissionFields,
		},
		required: ['isOwner', 'isActive', 'provider', 'createdAt', 'updatedAt'],
		additionalProperties: false,
	} as const
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

	export class GetWorkers extends HandlerIO {
		static sendData = super.sendDataCreator<UserType.GetWorkers.Data>({
			type: 'array',
			items: plainUserSchema,
		})
	}

	export class GetWorker extends HandlerIO {
		static sendData = super.sendDataCreator<UserType.GetWorker.Data>(
			plainUserSchema
		)
	}

	export class CreateWorker extends HandlerIO {
		static bodyValidator =
			super.bodyValidatorCreator<UserType.CreateWorker.Body>({
				type: 'object',
				properties: {
					login_name: { type: 'string' },
					password: { type: 'string' },
					...permissionFields,
				},
				required: ['login_name', 'password', 'role_type', 'permission_groups'],
				additionalProperties: false,
			})
		static sendData = super.sendDataCreator<UserType.GetWorker.Data>(
			plainUserSchema
		)
	}

	export class UpdateWorker extends HandlerIO {
		static bodyValidator =
			super.bodyValidatorCreator<UserType.UpdateWorker.Body>({
				type: 'object',
				properties: {
					password: { type: 'string', nullable: true },
					...permissionFields,
				},
				additionalProperties: false,
			})
		static sendData = super.sendDataCreator<UserType.UpdateWorker.Data>(
			plainUserSchema
		)
	}

	export class DeleteWorker extends HandlerIO {
		static sendData = super.sendDataCreator<UserType.DeleteWorker.Data>(
			plainUserSchema
		)
	}
}
