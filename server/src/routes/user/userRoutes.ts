import express from 'express'
import {
  userSignUp,
  userSignIn,
  userSignOut,
  getUser,
  updateUser,
  changePassword,
  forgetPassword,
  resetPassword,
} from './userController'

// Middleware
import authMiddleware from '../../middlewares/authMiddleware'

const router = express.Router()

router.route('/signUp').post(userSignUp)

router.route('/signIn').post(userSignIn)

router.route('/signOut').get(authMiddleware, userSignOut)

router.route('/').get(authMiddleware, getUser).put(authMiddleware, updateUser)

router.route('/changePassword').put(authMiddleware, changePassword)

router.route('/forgetPassword').post(forgetPassword)

router.route('/forgetPassword/:resetToken').put(resetPassword)

export default router
