import { JSONSchemaType } from 'ajv'
import {
	Identity,
	Secret,
	Mongoose,
	Editable,
	PlainUser,
	RolePermissions,
} from './userTypes'
import { api } from '../api'
import {
	MongooseStaticsJSONSchema,
	MongooseStampsJSONSchema,
} from '../utils/mongoTypes'
import { permissionGroupNameSet } from '../permissionTypes'
import { NavigateFunction } from 'react-router'

export interface SubmitEmail extends Required<Pick<Identity, 'email'>> {}

const submitEmailSchema: JSONSchemaType<SubmitEmail> = {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email' },
	},
	required: ['email'],
	additionalProperties: false,
} as const

const permissionFields = {
	role: { type: 'string', nullable: true },
	permission_groups: {
		type: 'array',
		items: {
			type: 'string',
			enum: permissionGroupNameSet,
		},
		nullable: true,
	},
	role_type: {
		type: 'string',
		enum: ['default', 'custom'],
		nullable: true,
	},
} as const

export const plainUserSchema: JSONSchemaType<PlainUser> = {
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

export namespace SignUp {
	export type Body = SubmitEmail
	export const API = new api<Body, any>({
		bodySchema: submitEmailSchema,
	})
}

export namespace Verify {
	// types
	export interface Body
		extends Required<Pick<Identity, 'email'>>,
			Required<Secret> {}
	export type Data = ReturnType<Mongoose['getSignedJWTToken']>
	// api
	export const API = new api<Body, Data>({
		bodySchema: {
			type: 'object',
			properties: {
				email: { type: 'string', format: 'email' },
				password: { type: 'string' },
			},
			required: ['email', 'password'],
			additionalProperties: false,
		},
		dataSchema: { type: 'string' },
	})
}

export namespace SignIn {
	export interface Body extends Identity, Required<Secret> {}
	export const API = new api<Body, any>({
		bodySchema: {
			type: 'object',
			properties: {
				email: { type: 'string', format: 'email', nullable: true },
				login_name: { type: 'string', nullable: true },
				password: { type: 'string' },
			},
			required: ['password'],
			additionalProperties: false,
		},
	})
}

export namespace Update {
	export type Body = Editable
	export type Data = PlainUser
	export const API = new api<Body, Data>({
		bodySchema: {
			type: 'object',
			properties: {
				username: { type: 'string', nullable: true },
				company: { type: 'string', nullable: true },
				avatar: { type: 'string', nullable: true },
			},
			required: [],
			additionalProperties: false,
		},
		dataSchema: plainUserSchema,
	})
}

export namespace GetUser {
	export type Data = PlainUser
	export const API = new api<any, Data>({
		dataSchema: plainUserSchema,
	})
}

export namespace GetAvatarUploadUrl {
	export interface Data extends Required<Pick<Editable, 'avatar'>> {
		uploadUrl: string
	}
	export const API = new api<any, Data>({
		dataSchema: {
			type: 'object',
			properties: {
				avatar: { type: 'string' },
				uploadUrl: { type: 'string' },
			},
			required: ['avatar', 'uploadUrl'],
			additionalProperties: false,
		},
	})
}

export namespace ChangePassword {
	export interface Body {
		currentPassword?: string
		newPassword: string
		token?: string
	}
	export const API = new api<Body, any>({
		bodySchema: {
			type: 'object',
			properties: {
				currentPassword: { type: 'string', nullable: true },
				newPassword: { type: 'string' },
				token: { type: 'string', nullable: true },
			},
			required: ['newPassword'],
			additionalProperties: false,
		},
	})
}

export namespace ForgetPassword {
	export interface Body extends SubmitEmail {}
	export const API = new api<Body, any>({
		bodySchema: submitEmailSchema,
	})
}

export namespace ResetPassword {
	export interface Body extends Partial<Secret> {
		token: string
	}
	export interface Data {
		token?: string
	}
	export const API = new api<Body, Data>({
		bodySchema: {
			type: 'object',
			properties: {
				token: { type: 'string' },
				password: { type: 'string', nullable: true },
			},
			required: ['token'],
			additionalProperties: false,
		},
		dataSchema: {
			type: 'object',
			properties: {
				token: { type: 'string', nullable: true },
			},
		},
	})
}

export namespace GetWorkers {
	export type Data = PlainUser[]
	export const API = new api<any, Data>({
		dataSchema: {
			type: 'array',
			items: plainUserSchema,
		},
	})
}

export namespace GetWorker {
	export interface Data extends PlainUser {}
	export const API = new api<any, Data>({
		dataSchema: plainUserSchema,
	})
}

export namespace CreateWorker {
	export interface Body
		extends Required<Pick<Identity, 'login_name'>>,
			Required<Secret>,
			Required<RolePermissions> {}
	export interface Data extends PlainUser {}
	export const API = new api<Body, Data>({
		bodySchema: {
			type: 'object',
			properties: {
				login_name: { type: 'string' },
				password: { type: 'string' },
				...permissionFields,
			},
			required: ['login_name', 'password', 'role_type', 'permission_groups'],
			additionalProperties: false,
		},
		dataSchema: plainUserSchema,
	})
}
export namespace UpdateWorker {
	export interface Body extends Secret, RolePermissions {}
	export interface Data extends PlainUser {}
	export const API = new api<Body, Data>({
		bodySchema: {
			type: 'object',
			properties: {
				password: { type: 'string', nullable: true },
				...permissionFields,
			},
			additionalProperties: false,
		},
		dataSchema: plainUserSchema,
	})
}
export namespace DeleteWorker {
	export interface Data extends PlainUser {}
	export const API = new api<any, Data>({
		dataSchema: plainUserSchema,
	})
}
