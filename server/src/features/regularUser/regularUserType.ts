export namespace RegularUserType {
  export interface Editable {
    // identity info
    email: string
    password: string
    // static info
    avatar?: string
    company_name?: string
    username?: string
  }

  export interface Generated {
    // generated status or type
    provider: 'TouchWhale' | 'Google'
    active: boolean
    createdAt: Date
    updatedAt: Date
    // generated token
    forgetPasswordToken?: string
    forgetPasswordExpire?: Date
    resetEmailToken?: string
    resetEmailExpire?: Date
  }

  export interface MongooseMethod {
    // procedure
    matchPassword: (password: string) => Promise<boolean>
    getForgetPasswordToken: () => string
    getSignedJWTToken: () => string
  }

  export interface Mongoose extends Editable, Generated, MongooseMethod {}

  export interface SignUpBody extends Pick<Editable, 'email'> {}

  export interface SignInBody extends Pick<Editable, 'email' | 'password'> {}

  export interface UpdateBody extends Omit<Editable, 'email' | 'password'> {}

  export interface ForgetPasswordBody extends Pick<Editable, 'email'> {}

  export interface ResetPasswordBody extends Pick<Editable, 'password'> {}
}

// Request

// Response

// Handler
