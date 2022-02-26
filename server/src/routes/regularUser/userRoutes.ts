import express from 'express'
import {
  regularUserSignUp,
  regularUserSignIn,
  regularUserSignOut,
  getRegularUser,
  updateRegularUser,
  changePassword,
  forgetPassword,
  resetPassword,
} from './userController'

// Middleware
import authMiddleware from '../../middlewares/authMiddleware'
import errorCatcher from '../../middlewares/errorCatcher'

const router = express.Router()

router.route('/signUp').post(errorCatcher(regularUserSignUp))

router.route('/signIn').post(errorCatcher(regularUserSignIn))

router.route('/signOut').get(authMiddleware, errorCatcher(regularUserSignOut))

router
  .route('/')
  .get(authMiddleware, errorCatcher(getRegularUser))
  .put(authMiddleware, updateRegularUser)

router
  .route('/changePassword')
  .put(authMiddleware, errorCatcher(changePassword))

router.route('/forgetPassword').post(errorCatcher(forgetPassword))

router.route('/forgetPassword/:resetToken').put(errorCatcher(resetPassword))

export default router
