import * as UserType from '../user/userTypes'
import { plainUserSchema } from '../user/userApi'
import { Editable, PlainRole } from './roleTypes'
import { api } from '../api'
import { JSONSchemaType } from 'ajv'
import {
  PermissionGroupNames,
  permissionGroupNameSet,
} from '../permissionTypes'
import {
  MongooseStaticsJSONSchema,
  MongooseStampsJSONSchema,
} from '../utils/mongoTypes'

const classifierFields = {
  owner: { type: 'string' },
} as const
const editableFields = {
  name: { type: 'string' },
  description: { type: 'string', nullable: true },
  permission_groups: {
    type: 'array',
    items: {
      type: 'string',
      enum: permissionGroupNameSet,
    },
  },
} as const

const plainRoleSchema: JSONSchemaType<PlainRole> = {
  type: 'object',
  properties: {
    ...MongooseStaticsJSONSchema,
    ...MongooseStampsJSONSchema,
    ...editableFields,
    ...classifierFields,
  },
  required: ['name', 'permission_groups'],
  additionalProperties: false,
} as const

export namespace GetRoles {
  export const API = new api<any, PlainRole[]>({
    dataSchema: {
      type: 'array',
      items: {
        ...plainRoleSchema,
      },
    },
  })
}

export namespace GetRole {
  export const API = new api<any, PlainRole>({
    dataSchema: plainRoleSchema,
  })
}

export namespace CreateRole {
  export type Body = Editable
  export type Data = PlainRole
  export const API = new api<Body, Data>({
    bodySchema: {
      type: 'object',
      properties: {
        ...editableFields,
      },
      required: ['name', 'permission_groups'],
      additionalProperties: false,
    },
    dataSchema: plainRoleSchema,
  })
}

export namespace UpdateRole {
  export interface Body {
    shouldCascade: boolean
    updates: Partial<Editable>
  }
  export interface Data {
    isUpdateDone: boolean
    updatedRole?: PlainRole
    userAffected?: {
      user: UserType.PlainUser
      shouldAdd: PermissionGroupNames[]
      shouldRemove: PermissionGroupNames[]
    }[]
  }
  export const API = new api<Body, Data>({
    bodySchema: {
      type: 'object',
      properties: {
        shouldCascade: { type: 'boolean' },
        updates: {
          type: 'object',
          properties: {
            name: { type: 'string', nullable: true },
            description: { type: 'string', nullable: true },
            permission_groups: {
              type: 'array',
              items: {
                type: 'string',
                enum: permissionGroupNameSet,
              },
              nullable: true,
            },
          },
          additionalProperties: false,
        },
      },
      required: ['shouldCascade', 'updates'],
    },
    dataSchema: {
      type: 'object',
      properties: {
        isUpdateDone: { type: 'boolean' },
        updatedRole: { ...plainRoleSchema, nullable: true },
        userAffected: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              user: plainUserSchema,
              shouldAdd: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: permissionGroupNameSet,
                },
              },
              shouldRemove: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: permissionGroupNameSet,
                },
              },
            },
            required: ['shouldAdd', 'shouldRemove', 'user'],
            additionalProperties: false,
          },
          nullable: true,
        },
      },
      required: ['isUpdateDone'],
      additionalProperties: false,
    },
  })
}

export namespace DeleteRole {
  export interface Data {
    deleted: boolean
    deletedRole?: PlainRole
    usersOfThisRole?: UserType.PlainUser[]
  }
  export const API = new api<any, Data>({
    dataSchema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean' },
        deletedRole: { ...plainRoleSchema, nullable: true },
        usersOfThisRole: {
          type: 'array',
          items: plainUserSchema,
          nullable: true,
        },
      },
      required: ['deleted'],
    },
  })
}
