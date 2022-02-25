import express from 'express'
import {
  regualrUserSignUp,
  regualrUserSignIn,
  regualrUserSignOut,
  getRegualrUser,
  updateRegualrUser,
  changePassword,
  forgetPassword,
  resetPassword,
} from './userController'

// Middleware
import authMiddleware from '../../middlewares/authMiddleware'

const router = express.Router()

router.route('/signUp').post(regualrUserSignUp)

router.route('/signIn').post(regualrUserSignIn)

router.route('/signOut').get(authMiddleware, regualrUserSignOut)

router
  .route('/')
  .get(authMiddleware, getRegualrUser)
  .put(authMiddleware, updateRegualrUser)

router.route('/changePassword').put(authMiddleware, changePassword)

router.route('/forgetPassword').post(forgetPassword)

router.route('/forgetPassword/:resetToken').put(resetPassword)

export default router
