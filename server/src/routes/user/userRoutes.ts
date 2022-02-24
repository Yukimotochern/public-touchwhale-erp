import express from 'express'
import {
  userSignUp,
  userSignIn,
  userSignout,
  getUser,
  updateUser,
  changepassword,
  forgetpassword,
  resetpassword,
} from './userController'

// Middleware
import authMiddleware from '../../middleware/authMiddleware'

const router = express.Router()

router.route('/signup').post(userSignUp)

router.route('/signin').post(userSignIn)

router.route('/signout').get(authMiddleware, userSignout)

router.route('/').get(authMiddleware, getUser).put(authMiddleware, updateUser)

router.route('/changepassword').put(authMiddleware, changepassword)

router.route('/forgetpassword').post(forgetpassword)

router.route('/forgetpassword/:resettoken').put(resetpassword)

export default router
