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

const router = express.Router()

router.route('/signUp').post(regularUserSignUp)

router.route('/signIn').post(regularUserSignIn)

router.route('/signOut').get(authMiddleware, regularUserSignOut)

router
	.route('/')
	.get(authMiddleware, getRegularUser)
	.put(authMiddleware, updateRegularUser)

router.route('/changePassword').put(authMiddleware, changePassword)

router.route('/forgetPassword').post(forgetPassword)

router.route('/forgetPassword/:resetToken').put(resetPassword)

export default router
