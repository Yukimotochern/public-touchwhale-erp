import express from 'express'
import passport from 'passport'
import {
  regularUserSignUp,
  regularUserVerify,
  regularUserSignIn,
  regularUserSignOut,
  getRegularUser,
  updateRegularUser,
  getAvatarUploadUrl,
  deleteAvatar,
  changePassword,
  forgetPassword,
  resetPassword,
  OAuthCallback,
} from './userController'

// Middleware
import authMiddleware from '../../middlewares/authMiddleware'
import errorCatcher from '../../middlewares/errorCatcher'

const router = express.Router()

router.route('/signUp').post(errorCatcher(regularUserSignUp))

router.route('/signUp/verify').post(errorCatcher(regularUserVerify)) // Use signIn to implement new user verification

router
  .route('/signUp/setPassword')
  .post(authMiddleware, errorCatcher(changePassword)) // Use changePassword to implement new user setPassword

router
  .route('/googleOAuth')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }))

router.route('/googleOAuth/callback').get(
  passport.authenticate('google', { failureRedirect: '/signIn' }), //failureRedirect need to be changed
  errorCatcher(OAuthCallback)
)

router.route('/signIn').post(errorCatcher(regularUserSignIn))

router.route('/signOut').get(authMiddleware, errorCatcher(regularUserSignOut))

router
  .route('/')
  .get(authMiddleware, errorCatcher(getRegularUser))
  .put(authMiddleware, errorCatcher(updateRegularUser))

router
  .route('/avatar')
  .get(authMiddleware, errorCatcher(getAvatarUploadUrl))
  .delete(authMiddleware, errorCatcher(deleteAvatar))

router
  .route('/changePassword')
  .put(authMiddleware, errorCatcher(changePassword))

router.route('/forgetPassword').post(errorCatcher(forgetPassword))

router.route('/forgetPassword/:resetToken').put(errorCatcher(resetPassword))

export default router
