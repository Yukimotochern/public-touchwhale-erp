import mongoose, { Schema } from 'mongoose'
import bcrtpt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { UserType } from './userTypes'
import { AuthJWT } from '../../middlewares/authMiddleware'
import CustomError from '../../utils/CustomError'
import { TwPermissons } from '../../middlewares/permission/permissionType'

const UserSchema = new mongoose.Schema<UserType.Mongoose>(
  {
    // Classifier
    isOwner: {
      type: Boolean,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    provider: {
      type: String,
      enum: ['TouchWhale', 'Google'],
      required: true,
    },
    // Identity
    email: {
      type: String,
      unique: true,
      sparse: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email.',
      ],
    },
    login_name: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^[^@]+$/, "Login name should not contains the '@' sign."],
    },
    // Permission
    role: {
      type: Schema.Types.ObjectId,
      ref: 'role',
    },
    permission_groups: {
      type: [
        {
          type: String,
          enum: TwPermissons.permissionGroupNameSet,
        },
      ],
    },
    role_type: {
      type: String,
      enum: ['default', 'custom'],
    },
    // Secret
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    // Editable
    username: {
      type: String,
    },
    company: {
      type: String,
    },
    avatar: {
      type: String,
    },
    // Token
    forgetPasswordToken: { type: String, select: false },
    forgetPasswordExpire: { type: Date, select: false },
  },
  { timestamps: true }
)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrtpt.genSalt(10)
  this.password = await bcrtpt.hash(this.password, salt)
})

UserSchema.methods.getSignedJWTToken = function (): string {
  if (!this.isOwner && !this.owner) {
    throw new CustomError('Unattached User.')
  }

  const token: Omit<AuthJWT, 'iat' | 'exp'> = {
    id: this._id,
    isOwner: this.isOwner,
    owner: this.isOwner ? this._id : this.owner,
  }

  return jwt.sign(token, process.env.JWTSECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrtpt.compare(enteredPassword, this.password)
}

UserSchema.methods.getForgetPasswordToken = function () {
  const token = crypto.randomBytes(20).toString('hex') + String(this.email)

  // Set hash token
  this.forgetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  // Expire in 1 hour
  this.forgetPasswordExpire = Date.now() + 60 * 60 * 1000

  return token
}

const UserModel = mongoose.model<UserType.Mongoose>('user', UserSchema)

export default UserModel
