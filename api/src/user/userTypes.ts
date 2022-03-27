import mongoose from 'mongoose'
import { MongooseStatics, MongooseStamps } from '../utils/mongoTypes'
import { PermissionGroupNames } from '../permissionTypes'

export interface Classifier {
  isOwner: boolean
  isActive: boolean
  provider: 'TouchWhale' | 'Google'
  owner?: string | mongoose.Types.ObjectId
}

export interface Identity {
  email?: string
  login_name?: string
}

export interface Secret {
  password?: string
}

export interface RolePermissions {
  role?: string | mongoose.Types.ObjectId
  permission_groups?: PermissionGroupNames[]
  role_type?: 'default' | 'custom'
}

export interface Editable {
  username?: string
  company?: string
  avatar?: string
}

export interface Token {
  forgetPasswordToken?: string
  forgetPasswordExpire?: Date | string
}

export interface MongooseMethods {
  matchPassword: (password: string) => Promise<boolean>
  getForgetPasswordToken: () => string
  getSignedJWTToken: () => string
}

export interface PlainUser
  extends Classifier,
    Identity,
    Editable,
    MongooseStamps,
    MongooseStatics,
    RolePermissions {}

export interface Mongoose
  extends Classifier,
    Identity,
    Secret,
    Editable,
    MongooseStamps,
    Token,
    MongooseMethods,
    MongooseStatics,
    RolePermissions {}
