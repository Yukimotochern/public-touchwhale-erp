import { InstanceIdentity } from 'aws-sdk/clients/datapipeline'
import { GeneratedFraudsterId } from 'aws-sdk/clients/voiceid'

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
    createdAt: Date
    updatedAt: Date
  }

  export interface Token {
    forgetPasswordToken?: string
    forgetPasswordExpire?: Date
    forgetPasswordRecord: Date[]
  }

  export interface MongooseMethod {
    matchPassword: (password: string) => Promise<boolean>
    getForgetPasswordToken: () => string
    getSignedJWTToken: () => string
  }

  export interface Mongoose
    extends Editable,
      Classifier,
      Identity,
      Secret,
      MongooseMethod,
      Stamp,
      Token {}

  export interface SignUpBody extends Required<Pick<Identity, 'email'>> {}

  export interface SignInBody extends Identity, Required<Secret> {}

  export interface UpdateBody extends Editable {}

  export interface ForgetPasswordBody extends SignUpBody {}

  export interface ResetPasswordBody extends Secret {}
}
