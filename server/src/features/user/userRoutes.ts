import express from 'express'
import passport from 'passport'
import {
  userOAuthCallback,
  userSignIn,
  userSignUp,
  userVerify,
  userSignOut,
  getUser,
  updateUser,
  userGetAvatarUploadUrl,
  deleteAvatar,
  changePassword,
  forgetPassword,
  resetPassword,
} from './userControllers'

// Middleware
import authMiddleware from '../../middlewares/authMiddleware'
import errorCatcher from '../../middlewares/errorCatcher'

const router = express.Router()

router.route('/signUp').post(errorCatcher(userSignUp))

router.route('/signUp/verify').post(errorCatcher(userVerify))

router.route('/signIn').post(errorCatcher(userSignIn))

router
  .route('/signUp/setPassword')
  .post(authMiddleware, errorCatcher(changePassword)) // Use changePassword to implement new user setPassword

router
  .route('/googleOAuth')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }))

router.route('/googleOAuth/callback').get(
  passport.authenticate('google', {
    failureRedirect:
      process.env.NODE_ENV === 'production'
        ? '/signIn'
        : `${process.env.FRONTEND_DEV_URL}signIN`,
  }), //failureRedirect need to be changed
  errorCatcher(userOAuthCallback)
)

router.route('/signOut').get(errorCatcher(userSignOut))

router
  .route('/')
  .get(authMiddleware, errorCatcher(getUser))
  .put(authMiddleware, errorCatcher(updateUser))

router
  .route('/avatar')
  .get(authMiddleware, errorCatcher(userGetAvatarUploadUrl))
  .delete(authMiddleware, errorCatcher(deleteAvatar))

router
  .route('/changePassword')
  .put(authMiddleware, errorCatcher(changePassword))

router
  .route('/forgetPassword')
  .post(errorCatcher(forgetPassword))
  .put(errorCatcher(resetPassword))

export default router
