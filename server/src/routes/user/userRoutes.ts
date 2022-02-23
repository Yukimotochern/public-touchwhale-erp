import express from 'express'
import {
	usersignup,
	userSignin,
	getUser,
	updateUser,
	resetpassword,
} from './userController'

// Middleware
// @Question
import authMiddleware from '../middleware/authMiddleware'

const router = express.Router()

router.route('/signup').post(usersignup)

router.route('/signin').post(userSignin)

router.route('/').get(getUser).put(updateUser)

router.route('/resetpassword').put(resetpassword)

export default router
