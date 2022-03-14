import mongoose, { Schema } from 'mongoose'
import { RoleType } from './roleType'
import { TwPermissons } from '../../middlewares/permission/permissionType'

const RoleSchema = new Schema<RoleType.Mongoose>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    permission_groups: {
      type: [
        {
          type: String,
          enum: TwPermissons.permissionGroupNameSet,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const RoleModel = mongoose.model<RoleType.Mongoose>('role', RoleSchema)

export default RoleModel
