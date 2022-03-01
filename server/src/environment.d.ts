// define the type for process.env
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      MONGO_URI: string
      SERVER_PORT: string
      JWTSECRET: string
      JWT_COOKIE_EXPIRE: number
      SMTP_PASSWORD: string
      SMTP_USERNAME: string
      SMTP_HOST: string
      SMTP_PORT: string
      FROM_NAME: string
      FROM_EMAIL: string
      B2_KEY_ID: string
      B2_SECRET_KEY: string
      APP_URL_DEV: string
      APP_URL_PROD: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
