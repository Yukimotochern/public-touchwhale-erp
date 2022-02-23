import express from 'express'
import {
	usersignup,
	userSignin,
	userSignout,
	getUser,
	updateUser,
	changepassword,
	forgetpassword,
	resetpassword,
} from './userController'

// Middleware
import authMiddleware from '../middleware/authMiddleware'
import validateMiddleware from '../middleware/validateMiddleware'

// Ajv Schema
import {
	signup_validate,
	signin_validate,
	updateuser_validate,
	changepassword_validate,
	forgetpassword_validate,
	resetpassword_validate,
} from '../ajv-schema/User'

const router = express.Router()

router.route('/signup').post(validateMiddleware(signup_validate), usersignup)

router.route('/signin').post(validateMiddleware(signin_validate), userSignin)

router.route('/signout').get(authMiddleware, userSignout)

router
	.route('/')
	.get(authMiddleware, getUser)
	.put([authMiddleware, validateMiddleware(updateuser_validate)], updateUser)

router
	.route('/changepassword')
	.put(
		[authMiddleware, validateMiddleware(changepassword_validate)],
		changepassword
	)

router
	.route('/forgetpassword')
	.post(validateMiddleware(forgetpassword_validate), forgetpassword)

router
	.route('/forgetpassword/:resettoken')
	.put(validateMiddleware(resetpassword_validate), resetpassword)

export default router
