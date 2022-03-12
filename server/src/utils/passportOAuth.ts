import GoogleStrategy, { Profile } from 'passport-google-oauth20'
import express, { NextFunction } from 'express'

export interface RequestWithGoogleProfile extends express.Request {
  user?: Profile
}
export interface GoogleAuthCallbackHandler {
  (
    req: RequestWithGoogleProfile,
    res: express.Response,
    next: NextFunction
  ): void | Promise<void>
}

const passportOAuth = (passport: any) => {
  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: `${
          process.env.NODE_ENV === 'development'
            ? process.env.BACKEND_DEV_URL
            : process.env.BACKEND_PROD_URL
        }/api/v1/user/googleOAuth/callback`,
      },
      async function (accessToken, refreshToken, profile, cb) {
        cb(null, profile)
      }
    )
  )
}

export default passportOAuth
