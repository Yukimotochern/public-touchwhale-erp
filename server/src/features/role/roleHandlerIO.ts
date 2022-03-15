import { JSONSchemaType } from 'ajv'
import { RoleType } from './roleType'
import { TwPermissons } from '../../middlewares/permission/permissionType'
import {
  MongooseStaticsJSONSchema,
  MongooseStampsJSONSchema,
} from '../../utils/mongodb'
import { HandlerIO } from '../apiIO'
import { UserIO } from '../user/userHandlerIO'

export namespace RoleIO {
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
        enum: TwPermissons.permissionGroupNameSet,
      },
    },
  } as const

  const plainRoleSchema: JSONSchemaType<RoleType.PlainRole> = {
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

  export class GetRoles extends HandlerIO {
    static sendData = super.sendDataCreator<RoleType.PlainRole[]>({
      type: 'array',
      items: {
        ...plainRoleSchema,
      },
    })
  }

  export class GetRole extends HandlerIO {
    static sendData = super.sendDataCreator<RoleType.PlainRole>(plainRoleSchema)
  }

  export class CreateRole extends HandlerIO {
    static bodyValidator = super.bodyValidatorCreator<RoleType.Editable>({
      type: 'object',
      properties: {
        ...editableFields,
      },
      required: ['name', 'permission_groups'],
      additionalProperties: false,
    })
    static sendData = super.sendDataCreator<RoleType.PlainRole>(plainRoleSchema)
  }

  export class UpdateRole extends HandlerIO {
    static bodyValidator = super.bodyValidatorCreator<RoleType.UpdateRole.Body>(
      {
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
                  enum: TwPermissons.permissionGroupNameSet,
                },
                nullable: true,
              },
            },
            additionalProperties: false,
          },
        },
        required: ['shouldCascade', 'updates'],
      }
    )
    static sendData = super.sendDataCreator<RoleType.UpdateRole.Data>({
      type: 'object',
      properties: {
        isUpdateDone: { type: 'boolean' },
        updatedRole: { ...plainRoleSchema, nullable: true },
        userAffected: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              user: UserIO.plainUserSchema,
              shouldAdd: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: TwPermissons.permissionGroupNameSet,
                },
              },
              shouldRemove: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: TwPermissons.permissionGroupNameSet,
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
    })
  }

  export class DeleteRole extends HandlerIO {
    static sendData = super.sendDataCreator<RoleType.DeleteRole.Data>({
      type: 'object',
      properties: {
        deleted: { type: 'boolean' },
        deletedRole: { ...plainRoleSchema, nullable: true },
        usersOfThisRole: {
          type: 'array',
          items: UserIO.plainUserSchema,
          nullable: true,
        },
      },
      required: ['deleted'],
    })
  }
}
