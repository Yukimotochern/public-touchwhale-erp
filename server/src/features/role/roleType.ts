import { MongooseStatics, MongooseStamps } from '../../utils/mongodb'
import { TwPermissons } from '../../middlewares/permission/permissionType'
import mongoose from 'mongoose'
import { UserType } from '../user/userTypes'

export namespace RoleType {
  export interface Classifier {
    owner: string | mongoose.Types.ObjectId
  }
  export interface Editable {
    name: string
    description?: string
    permission_groups: TwPermissons.PermissionGroupNames[]
  }

  export interface PlainRole
    extends Editable,
      MongooseStamps,
      MongooseStatics,
      Classifier {}
  export interface Mongoose
    extends Editable,
      MongooseStamps,
      MongooseStatics,
      Classifier {}

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
        shouldAdd: TwPermissons.PermissionGroupNames[]
        shouldRemove: TwPermissons.PermissionGroupNames[]
      }[]
    }
  }

  export namespace DeleteRole {
    export interface Data {
      deleted: boolean
      deletedRole?: PlainRole
      usersOfThisRole?: UserType.PlainUser[]
    }
  }
}
