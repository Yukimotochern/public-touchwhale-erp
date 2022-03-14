import { MongooseStatics, MongooseStamps } from '../../utils/mongodb'
import { TwPermissons } from '../../middlewares/permission/permissionType'
import mongoose from 'mongoose'

export namespace RoleType {
  export interface Editable {
    owner: string | mongoose.Types.ObjectId
    name: string
    description?: string
    permission_groups: TwPermissons.PermissionGroupNames[]
  }

  export interface PlainRole
    extends Editable,
      MongooseStamps,
      MongooseStatics {}
  export interface Mongoose extends Editable, MongooseStamps, MongooseStatics {}
}
