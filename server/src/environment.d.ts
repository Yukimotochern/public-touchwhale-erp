// define the type for process.env
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production' | 'test'
			MONGO_URI: string
			MONGO_URI_TEST: string
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
			BACKEND_DEV_URL: string
			BACKEND_PROD_URL: string
			FRONTEND_DEV_URL: string
			GOOGLE_OAUTH_CLIENT_ID: string
			GOOGLE_OAUTH_CLIENT_SECRET: string
			DEV_DOMAIN: string
			PROD_DOMAIN: string
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
