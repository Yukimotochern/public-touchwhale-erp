import mongoose, { Schema } from 'mongoose'
import * as RoleType from 'api/dist/role/roleTypes'
import { permissionGroupNameSet } from 'api/dist/permissionTypes'

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
          enum: permissionGroupNameSet,
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
