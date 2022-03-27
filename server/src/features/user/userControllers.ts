import { RequestHandler, Response } from 'express'
import crypto from 'crypto'
import { sendEmail } from '../../utils/sendEmail'
import { avjErrorWrapper } from '../../utils/ajv'
import CustomError from '../../utils/CustomError'
import UserModel from './userModel'
import {
	forgetPasswordMessage,
	sixDigitsMessage,
} from '../../utils/emailMessage'
import { uploadImage, deleteImage } from '../../utils/AWS/b2'
import { UserIO } from './userHandlerIO'
import { UserType } from './userTypes'
import { HandlerIO } from '../apiIO'
// import { api } from 'api/dist/api'

const {
	SignUp,
	Verify,
	SignIn,
	GetUser,
	Update,
	GetAvatarUploadUrl,
	ChangePassword,
	ForgetPassword,
	ResetPassword,
	GetWorker,
	GetWorkers,
	CreateWorker,
	DeleteWorker,
	UpdateWorker,
} = UserIO

const UserAvatarKeyPrifix = 'UserAvatar'

// @route    POST api/v1/user/signUp
// @desc     Sign user up
// @access   Public
export const userSignUp: RequestHandler = async (req, res, next) => {
	if (SignUp.bodyValidator(req.body)) {
		const { email } = req.body
		let user = await UserModel.findOne({ email })
		const sixDigits = Math.floor(100000 + Math.random() * 900000).toString()
		if (user) {
			if (user.isActive) {
				// User already register and has been activated
				return next(new CustomError('User already exists.', 409))
			} else {
				// User already register but is not activated
				user.password = sixDigits
			}
		} else {
			user = new UserModel({
				email,
				password: sixDigits,
				provider: 'TouchWhale',
				isOwner: true,
				isActive: false,
			})
		}
		await user.save({ validateBeforeSave: false })
		const message = sixDigitsMessage({ sixDigits })
		await sendEmail({
			to: email,
			subject: 'Your verificatiom code',
			message: message,
		})
		return SignUp.send(res, 200, {
			message: `Verification code has been send to ${email}`,
		})
	}
	next(avjErrorWrapper(SignUp.bodyValidator.errors))
}

// @route    POST api/v1/user/signUp/verify
// @desc     Verify user email
// @access   Public
export const userVerify: RequestHandler = async (req, res, next) => {
	if (Verify.bodyValidator(req.body)) {
		const { email, password } = req.body
		const user = await UserModel.findOne({ email }).select('+password')
		if (!user || user.isActive) {
			return next(new CustomError('User email is invalid.', 401))
		}
		const isMatch = await user.matchPassword(password)
		if (!isMatch) {
			return next(new CustomError('Invalid credentials.', 401))
		}

		return Verify.sendData(res, user.getSignedJWTToken())
	}
	next(avjErrorWrapper(Verify.bodyValidator.errors))
}

// @route    POST api/v1/user/signIn
// @desc     Sign user in
// @access   Public
export const userSignIn: RequestHandler = async (req, res, next) => {
	if (SignIn.bodyValidator(req.body)) {
		const { email, login_name, password } = req.body
		if (!email && !login_name) {
			return next(new CustomError('Without Identity.', 400))
		}
		let user = await UserModel.findOne({ login_name, email }).select(
			'+password'
		)
		if (!user) {
			return next(new CustomError('Invalid credentials.', 401))
		}
		if (!user.isActive) {
			return next(
				new CustomError(
					'Your have not completed the sign up process. Please sign up again.',
					400
				)
			)
		}

		const isMatch = await user.matchPassword(password)
		if (!isMatch) {
			if (user.provider === 'Google') {
				return next(
					new CustomError(
						'You were registered with Google. Please try that login method.',
						401
					)
				)
			}
			return next(new CustomError('Invalid credentials.', 401))
		}
		return sendTokenResponse(user, 200, res)
	}
	next(avjErrorWrapper(SignIn.bodyValidator.errors))
}

// @route    GET api/v1/user/googleOAuth/callback
// @desc     Call back function for Google OAuth
// @access   Public
export const userOAuthCallback: RequestHandler = async (req, res, next) => {
	let redirectHome = process.env.BACKEND_PROD_URL
	if (process.env.NODE_ENV === 'development') {
		redirectHome = `${process.env.FRONTEND_DEV_URL}`
	}
	try {
		if (req.user) {
			const profile = req.user._json
			const email = profile.email
			if (!email) {
				throw new CustomError(
					'Unable to obtain the required information(email) from Google.'
				)
			}
			let user = await UserModel.findOne({ email })
			if (!user) {
				user = new UserModel({
					isActive: true,
					isOwner: true,
					email: profile?.email,
					password: crypto.randomBytes(10).toString('hex'),
					avatar: profile?.picture,
					provider: 'Google',
					username: profile?.name,
					active: true,
				})

				await user.save()
			} else {
				if (user.provider !== 'Google') {
					user.provider = 'Google'
					await user.save()
				}
			}
			setToken(user, res)
			return res.redirect(redirectHome)
		} else {
			throw new CustomError('Did not obtain information from Google.')
		}
	} catch (err) {
		// Error redirect to /signIn with message
		let message = 'Something went wrong.'
		if (err instanceof CustomError) {
			message = err.message
		}
		message = encodeURI(
			`${message} Please try again latter or use the password login method.`
		)
		let signInPath = `${redirectHome}/signIn#${message}`
		return res.redirect(signInPath)
	}
}

// @route    GET api/v1/user/signOut
// @desc     Sign user out
// @access   Public
export const userSignOut: RequestHandler = async (req, res, next) => {
	res.clearCookie('token', {
		path: '/',
		domain:
			process.env.NODE_ENV === 'development'
				? process.env.DEV_DOMAIN
				: process.env.PROD_DOMAIN,
		httpOnly: true,
	})
	res.clearCookie('token', {
		path: '/',
		domain: '127.0.0.1',
		httpOnly: true,
	})
	res.end()
}

// @route    GET api/v1/user/
// @desc     Get user infomation
// @access   Private
export const getUser: RequestHandler = async (req, res, next) => {
	if (req.userJWT) {
		const user = await UserModel.findById(req.userJWT.id)
		if (user) {
			return GetUser.sendData(res, user)
		} else {
			return next(new CustomError('Server Error'))
		}
	} else {
		return next(new CustomError('Server Error'))
	}
}

// @route    PUT api/v1/user/
// @desc     Update user infomation
// @access   Private
export const updateUser: RequestHandler = async (req, res, next) => {
	if (Update.bodyValidator(req.body)) {
		if (req.userJWT) {
			const user = await UserModel.findByIdAndUpdate(req.userJWT.id, req.body, {
				new: true,
				runValidators: true,
			})
			if (user) {
				return Update.sendData(res, user)
			}
			return next(new CustomError('Server Error'))
		} else {
			return next(new CustomError('Server Error'))
		}
	} else {
		return next(avjErrorWrapper(Update.bodyValidator.errors))
	}
}

// @route    GET api/v1/user/avatar
// @desc     Get B2 url for frontend to make a put request
// @access   Private
export const userGetAvatarUploadUrl: RequestHandler = async (
	req,
	res,
	next
) => {
	if (req.userJWT?.id) {
		const { id } = req.userJWT
		const user = await UserModel.findById(id)
		if (!user) {
			return next(new CustomError('Server Error.'))
		}
		const { Key, url } = await uploadImage(UserAvatarKeyPrifix, id)
		let avatar = `https://tw-user-data.s3.us-west-000.backblazeb2.com/${Key}`
		user.avatar = avatar
		await user.save()
		return GetAvatarUploadUrl.sendData(res, { uploadUrl: url, avatar })
	}
	return next(new CustomError('Server Error', 500))
}

// @route    DELETE api/v1/user/avatar
// @desc     DELET User Avatar
// @access   Private
export const deleteAvatar: RequestHandler = async (req, res, next) => {
	if (req.userJWT?.id) {
		const { id } = req.userJWT
		const user = await UserModel.findById(id)
		if (!user) {
			return next(new CustomError('Server Error.'))
		}
		await deleteImage(UserAvatarKeyPrifix, id)
		user.avatar = undefined
		await user.save()
		return HandlerIO.send(res, 200, { message: 'Avatar deleted.' })
	}
	return next(new CustomError('Server Error', 500))
}

// @route    PUT api/v1/user/changePassword
// @desc     Update password
// @access   Private
export const changePassword: RequestHandler = async (req, res, next) => {
	if (ChangePassword.bodyValidator(req.body) && req.userJWT) {
		const user = await UserModel.findById(req.userJWT.id).select('+password')
		if (user && user.isActive && req.body.currentPassword) {
			if (!(await user.matchPassword(req.body.currentPassword))) {
				return next(new CustomError('Invalid credential.', 400))
			}
			user.password = req.body.newPassword
			await user.save()
			return sendTokenResponse(user, 200, res)
		} else if (user && !user.isActive) {
			user.password = req.body.newPassword
			user.isActive = true
			await user.save()
			return sendTokenResponse(user, 200, res)
		}
		return next(new CustomError('Server Error'))
	} else {
		return next(avjErrorWrapper(ChangePassword.bodyValidator.errors))
	}
}

// @route    POST api/v1/user/forgetPassword
// @desc     Forget password
// @access   Public
export const forgetPassword: RequestHandler = async (req, res, next) => {
	if (ForgetPassword.bodyValidator(req.body)) {
		const user = await UserModel.findOne({ email: req.body.email })
		if (!user) {
			return next(new CustomError('There is no user with that email.', 404))
		}
		const token = user.getForgetPasswordToken()
		await user.save({ validateBeforeSave: false })
		// Create url
		const option = {
			protocol: req.protocol,
			host: req.get('host'),
			token,
		}
		const message = forgetPasswordMessage(option)
		try {
			await sendEmail({
				to: req.body.email,
				subject: 'Password reset token',
				message,
			})
			ForgetPassword.send(res, 200, { message: 'Email sent' })
		} catch (err: any) {
			console.error(err)
			user.forgetPasswordToken = undefined
			user.forgetPasswordExpire = undefined

			await user.save({ validateBeforeSave: false })
			return next(new CustomError('Email could not be sent.', 500, err))
		}
	} else {
		return next(avjErrorWrapper(ForgetPassword.bodyValidator.errors))
	}
}

// @desc        Reset password
// @route       PUT /api/v1/user/forgetPassword
// @access      Public
export const resetPassword: RequestHandler = async (req, res, next) => {
	if (ResetPassword.bodyValidator(req.body)) {
		// case 1: body only provide token
		// 1. validate the token
		// 2. reset a new token and return
		// case 2: body provide both token and new password
		// 1. validate the token
		// 2. reset the password
		const forgetPasswordToken = crypto
			.createHash('sha256')
			.update(req.body.token)
			.digest('hex')

		const user = await UserModel.findOne({
			forgetPasswordToken,
			forgetPasswordExpire: { $gt: Date.now() },
		})

		if (!user) {
			return next(new CustomError('Invalid token.', 400))
		}
		if (req.body.password) {
			user.password = req.body.password
			user.forgetPasswordToken = undefined
			user.forgetPasswordExpire = undefined
			await user.save()
			return ResetPassword.sendData(
				res,
				{},
				{ message: 'Your password has been set.' }
			)
		} else {
			const token = user.getForgetPasswordToken()
			await user.save({ validateBeforeSave: false })
			return ResetPassword.sendData(
				res,
				{ token },
				{ message: 'Please use this new token to reset the password.' }
			)
		}
	} else {
		return next(avjErrorWrapper(ResetPassword.bodyValidator.errors))
	}
}

// @route    GET api/v1/user/workers
// @desc     Get all workers
// @access   Private
export const getWorkers: RequestHandler = async (req, res, next) => {
	if (req.userJWT) {
		const workers = await UserModel.find({
			owner: req.userJWT.owner,
			isOwner: false,
		})
		GetWorkers.sendData(res, workers)
	}
	return next(new CustomError('Internal Server Error'))
}

// @route    GET api/v1/user/workers/:id
// @desc     Get worker
// @access   Private
export const getWorker: RequestHandler = async (req, res, next) => {
	if (req.userJWT) {
		const worker = await UserModel.findOne({
			owner: req.userJWT.owner,
			isOwner: false,
			_id: req.params.id,
		})
		if (worker) {
			GetWorker.sendData(res, worker)
		}
		next(new CustomError('Worker not found.'))
	}
	return next(new CustomError('Internal Server Error'))
}

// @route    POST api/v1/user/workers/
// @desc     Get worker
// @access   Private
export const createWorker: RequestHandler = async (req, res, next) => {
	if (CreateWorker.bodyValidator(req.body)) {
		if (req.userJWT) {
			const worker = await UserModel.create(req.body)
			CreateWorker.sendData(res, worker)
		}
		return next(new CustomError('Internal Server Error'))
	}
	return next(avjErrorWrapper(CreateWorker.bodyValidator.errors))
}

// @route    PUT api/v1/user/workers/:id
// @desc     Update a worker
// @access   Private
export const updateWorker: RequestHandler = async (req, res, next) => {
	if (UpdateWorker.bodyValidator(req.body)) {
		if (req.userJWT) {
			// TODO make sure the permission group obeys the tree like structure
			const worker = await UserModel.findOneAndUpdate(
				{
					owner: req.userJWT.owner,
					_id: req.params.id,
				},
				req.body,
				{ runValidators: true, new: true }
			)
			if (worker) {
				return UpdateWorker.sendData(res, worker)
			}
			return next(
				new CustomError(
					'The worker does not exist or you do not have the correct access permission.',
					400
				)
			)
		}
		return next(new CustomError('Internal Server Error'))
	}
	return next(avjErrorWrapper(UpdateWorker.bodyValidator.errors))
}

// @route    DELETE api/v1/user/workers/:id
// @desc     Delete a worker
// @access   Private
export const deleteWorker: RequestHandler = async (req, res, next) => {
	if (req.userJWT) {
		let idToDelete = req.params.id
		if (req.params.id === idToDelete) {
			return next(new CustomError('Your cannot delete yourself.'))
		}
		const worker = await UserModel.findOne({
			owner: req.userJWT.owner,
			_id: idToDelete,
		})
		if (worker) {
			await worker.delete()
			DeleteWorker.sendData(res, worker, {
				message: 'The user in the data is successfully deleted.',
			})
		}
		return next(
			new CustomError(
				'Worker not found or you may not have the correct access right.'
			)
		)
	}
	return next(new CustomError('Internal Server Error'))
}

/*
// @route    POST api/v1/user/
// @desc     
// @access   Public
export const userXXX: RequestHandler = async (req, res, next) => {
  if (XXX.bodyValidator(req.body)) {
    // return send(res, {})
    // or
    // return XXX.sendData(res, {})
  }
  next(avjErrorWrapper(XXX.bodyValidator.errors))
}
*/

// Helper functions
const setToken = (user: UserType.Mongoose, res: Response): any => {
	const token = user.getSignedJWTToken()
	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000 * 24
		), //Expires in days
		httpOnly: true,
	}

	res.cookie('token', token, options)
	return token
}

const sendTokenResponse = (
	user: UserType.Mongoose,
	statusCode: number,
	res: Response
): void => {
	const token = setToken(user, res)
	if (process.env.NODE_ENV === 'test') {
		return HandlerIO.send(res, statusCode, token)
	}
	return HandlerIO.send(res, statusCode)
}
