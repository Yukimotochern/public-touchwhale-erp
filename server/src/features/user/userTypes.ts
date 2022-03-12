import { MongooseStatics } from '../../utils/mongodb'
export namespace UserType {
  export interface Classifier {
    isOwner: boolean
    isActive: boolean
    provider: 'TouchWhale' | 'Google'
  }

  export interface Identity {
    email?: string
    login_name?: string
  }

  export interface Secret {
    password?: string
  }

  export interface Editable {
    username?: string
    company?: string
    avatar?: string
  }

  export interface Stamp {
    createdAt: Date | string
    updatedAt: Date | string
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
      Stamp,
      MongooseStatics {}

  export interface Mongoose
    extends Classifier,
      Identity,
      Secret,
      Editable,
      Stamp,
      Token,
      MongooseMethods,
      MongooseStatics {}

  export interface SubmitEmail extends Required<Pick<Identity, 'email'>> {}

  export interface SignUpBody extends SubmitEmail {}

  export interface VerifyBody
    extends Required<Pick<Identity, 'email'>>,
      Required<Secret> {}
  export type VerifyData = ReturnType<Mongoose['getSignedJWTToken']>

  export interface SignInBody extends Identity, Required<Secret> {}

  export interface UpdateBody extends Editable {}
  export interface UpdateData extends PlainUser {}

  export interface GetUserData extends PlainUser {}

  export interface GetAvatarUploadUrlData
    extends Required<Pick<Editable, 'avatar'>> {
    uploadUrl: string
  }

  export interface ChangePasswordBody {
    currentPassword?: string
    newPassword: string
    token?: string
  }

  export interface ForgetPasswordBody extends SubmitEmail {}

  export interface ResetPasswordBody extends Partial<Secret> {
    token: string
  }
  export interface ResetPasswordData {
    token?: string
  }
}
