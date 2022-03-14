import { JSONSchemaType } from 'ajv'
import { RoleType } from './roleType'
import { TwPermissons } from '../../middlewares/permission/permissionType'
import {
  MongooseStaticsJSONSchema,
  MongooseStampsJSONSchema,
} from '../../utils/mongodb'
import { HandlerIO } from '../apiIO'

export namespace RoleIO {
  const plainRoleSchema: JSONSchemaType<RoleType.PlainRole> = {
    type: 'object',
    properties: {
      ...MongooseStaticsJSONSchema,
      ...MongooseStampsJSONSchema,
      owner: { type: 'string' },
      name: { type: 'string' },
      description: { type: 'string', nullable: true },
      permission_groups: {
        type: 'array',
        items: {
          type: 'string',
          enum: TwPermissons.permissionGroupNameSet,
        },
      },
    },
    required: ['name', 'permission_groups'],
    additionalProperties: false,
  }
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
}
