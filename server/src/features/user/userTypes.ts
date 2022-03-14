import { MongooseStatics } from '../../utils/mongodb'
import mongoose from 'mongoose'

export namespace UserType {
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

  export namespace SignUp {
    export interface Body extends SubmitEmail {}
  }

  export namespace Verify {
    export interface Body
      extends Required<Pick<Identity, 'email'>>,
        Required<Secret> {}
    export type Data = ReturnType<Mongoose['getSignedJWTToken']>
  }

  export namespace SignIn {
    export interface Body extends Identity, Required<Secret> {}
  }

  export namespace Update {
    export interface Body extends Editable {}
    export interface Data extends PlainUser {}
  }

  export namespace GetUser {
    export interface Data extends PlainUser {}
  }

  export namespace GetAvatarUploadUrl {
    export interface Data extends Required<Pick<Editable, 'avatar'>> {
      uploadUrl: string
    }
  }

  export namespace ChangePassword {
    export interface Body {
      currentPassword?: string
      newPassword: string
      token?: string
    }
  }

  export namespace ForgetPassword {
    export interface Body extends SubmitEmail {}
  }

  export namespace ResetPassword {
    export interface Body extends Partial<Secret> {
      token: string
    }
    export interface Data {
      token?: string
    }
  }
}
