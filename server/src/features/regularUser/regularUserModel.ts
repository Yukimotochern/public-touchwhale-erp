import mongoose from 'mongoose'
import bcrtpt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import crypto from 'crypto'
import { RegularUserType } from './regularUserType'

const RegularUserSchema = new mongoose.Schema<RegularUserType.Mongoose>(
  {
    email: {
      type: String,
      unique: true,
      sparse: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email.',
      ],
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    company_name: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    provider: { type: String, enum: ['TouchWhale', 'Google'], required: true },
    active: { type: Boolean, required: true, default: false },
    avatar: {
      type: String,
    },
    forgetPasswordToken: { type: String, select: false },
    forgetPasswordExpire: { type: Date, select: false },
    resetEmailToken: { type: String, select: false },
    resetEmailExpire: { type: Date, select: false },
  },
  // Automatically adding and modifying createdAt and updatedAt by Yuki
  { timestamps: true }
)

RegularUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrtpt.genSalt(10)
  this.password = await bcrtpt.hash(this.password, salt)
})

RegularUserSchema.methods.getSignedJWTToken = function (): string {
  return jwt.sign({ id: this._id }, process.env.JWTSECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

RegularUserSchema.methods.matchPassword = async function (
  enteredPassword: string
) {
  return await bcrtpt.compare(enteredPassword, this.password)
}

RegularUserSchema.methods.getForgetPasswordToken = function () {
  const token = crypto.randomBytes(20).toString('hex')

  // Set hash token
  this.forgetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

  // Expire in 10 mins
  this.forgetPasswordExpire = Date.now() + 60 * 60 * 1000

  return token
}

RegularUserSchema.methods.getResetEmailToken = function () {
  const token = crypto.randomBytes(20).toString('hex')

  // Set hash token
  this.resetEmailToken = crypto.createHash('sha256').update(token).digest('hex')

  // Expire in 10 mins
  this.resetEmailExpire =
    Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000 * 24

  return token
}

const RegularUserModel = mongoose.model<RegularUserType.Mongoose>(
  'regular_user',
  RegularUserSchema
)

export default RegularUserModel
