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
        clientID:
          '854772499634-6dpb25lhg30eh5b77f83pq3uufgjau0q.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: `${
          process.env.NODE_ENV === 'development'
            ? process.env.BACKEND_DEV_URL
            : process.env.BACKEND_PROD_URL
        }/api/v1/regularUser/googleOAuth/callback`,
      },
      async function (accessToken, refreshToken, profile, cb) {
        cb(null, profile)
      }
    )
  )
}

export default passportOAuth
