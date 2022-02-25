import { RequestHandler, Response } from 'express'
import { PrivateRequestHandler } from '../../middlewares/authMiddleware'
import crypto from 'crypto'

import { sendEmail } from '../../utils/sendEmail'
import { avjErrorWrapper } from '../../utils/ajv'
import ErrorResponse, { TWError } from '../../utils/errorResponse'

import {
	signInBodyValidator,
	signUpBodyValidator,
	updateRegularUserBodyValidator,
	changePasswordBodyValidator,
	forgetPasswordBodyValidator,
	resetPasswordBodyValidator,
} from './userValidate'

import RegularUserModel from '../../models/RegularUser'

// @route    POST api/v1/regularuser/signUp
// @desc     Signup regularuser
// @access   Public
// RequestHandler is an easier way to set types, by Yuki
export const regularUserSignUp: RequestHandler = async (req, res, next) => {
	if (signUpBodyValidator(req.body)) {
		const { email } = req.body
		let user = await RegularUserModel.findOne({ email })
		if (user) {
			return next(new ErrorResponse('User already exists.', 409))
		}
		// Since req.body has been strictly validate by ajv, we can plug it into query, by Yuki
		user = new RegularUserModel(req.body)

		await user.save()

		// Return to avoid potentially latter execution, by Yuki
		return sendTokenResponse(user, 200, res)
	} else {
		return next(avjErrorWrapper(signUpBodyValidator.errors))
	}
}

// @route    POST api/v1/regularuser/signIn
// @desc     Sign regularuser in
// @access   Public
export const regularUserSignIn: RequestHandler = async (req, res, next) => {
	if (signInBodyValidator(req.body)) {
		const { email, password } = req.body
		const user = await RegularUserModel.findOne({ email }).select('+password')
		if (!user) {
			return next(new ErrorResponse('Invalid credentials.', 401))
		}
		const isMatch = await user.matchPassword(password)
		if (!isMatch) {
			return next(new ErrorResponse('Invalid credentials.', 401))
		}
		return sendTokenResponse(user, 200, res)
	} else {
		return next(avjErrorWrapper(signInBodyValidator.errors))
	}
}

// @route    GET api/v1/regularuser/signOut
// @desc     Sign regularuser out
// @access   Private
export const regularUserSignOut: PrivateRequestHandler = async (
	req,
	res,
	next
) => {
	// Using Clear Cookie seems to be a cleaner way
	res.clearCookie('token', {
		httpOnly: true,
	})

	res.status(200).json({
		data: {},
	})
}

// @route    GET api/v1/regularuser/
// @desc     Get regularuser infomation
// @access   Private

export const getRegularUser: PrivateRequestHandler = async (req, res, next) => {
	// Since this is a private route, the req should have contained the user object.
	if (req.user) {
		const user = await RegularUserModel.findById(req.user.id)
		if (user) {
			res.status(200).json({
				data: user,
			})
		}
	} else {
		return next(new ErrorResponse('Server Error'))
	}
}

// @route    PUT api/v1/regularuser/
// @desc     Update regularuser infomation
// @access   Private
export const updateRegularUser: PrivateRequestHandler = async (
	req,
	res,
	next
) => {
	if (updateRegularUserBodyValidator(req.body)) {
		const { company_name } = req.body
		const fieldsToUpdate = {
			company_name,
		}
		// When updating email, the user should receive the reset-email-token sendding to the new email address.
		// That is to ensure that the user does not have typo in the email and really own that email address. by Yuki
		if (req.user) {
			const user = await RegularUserModel.findByIdAndUpdate(
				req.user.id,
				fieldsToUpdate,
				{
					new: true,
					runValidators: true,
				}
			)
			res.status(200).json({
				data: user,
			})
		} else {
			return next(new ErrorResponse('Server Error'))
		}
	} else {
		return next(avjErrorWrapper(updateRegularUserBodyValidator.errors))
	}
}

// @route    PUT api/v1/regularuser/changePassword
// @desc     Update password
// @access   Private
export const changePassword: PrivateRequestHandler = async (req, res, next) => {
	if (changePasswordBodyValidator(req.body) && req.user) {
		if (req.user) {
			const user = await RegularUserModel.findById(req.user.id).select(
				'+password'
			)
			if (user) {
				if (!(await user.matchPassword(req.body.currentPassword))) {
					return next(new ErrorResponse('Password is incorrect.', 400))
				}
				user.password = req.body.newPassword
				await user.save()
				return sendTokenResponse(user, 200, res)
			}
		}
		return next(new ErrorResponse('Server Error'))
	} else {
		return next(avjErrorWrapper(changePasswordBodyValidator.errors))
	}
}

// @route    POST api/v1/regularuser/forgetPassword
// @desc     Forget password
// @access   Public
export const forgetPassword: RequestHandler = async (req, res, next) => {
	if (forgetPasswordBodyValidator(req.body)) {
		const user = await RegularUserModel.findOne({ email: req.body.email })
		if (!user) {
			return next(new ErrorResponse('There is no user with that email.', 404))
		}
		const token = user.getForgetPasswordToken()
		await user.save({ validateBeforeSave: false })
		// Create url
		const resetUrl = `${req.protocol}://${req.get(
			'host'
		)}/api/v1/user/forgetpassword/${token}`
		const message = `Make a PUT request to: \n ${resetUrl}`
		try {
			await sendEmail({
				to: user.email,
				subject: 'Password reset token',
				message,
			})

			res.status(200).json({ data: 'Email sent.' })
		} catch (err: any) {
			console.log(err)
			user.forgetPasswordToken = undefined
			user.forgetPasswordExpire = undefined

			await user.save({ validateBeforeSave: false })
			return next(new ErrorResponse('Email could not be sent.', 500, err))
		}
	} else {
		return next(avjErrorWrapper(forgetPasswordBodyValidator.errors))
	}
}

// @desc        Reset password
// @route       PUT /api/v1/regularuser/forgetPassword/:resetToken
// @access      Public
export const resetPassword: RequestHandler = async (req, res, next) => {
	if (resetPasswordBodyValidator(req.body)) {
		const forgetPasswordToken = crypto
			.createHash('sha256')
			.update(req.params.resetToken)
			.digest('hex')

		const user = await RegularUserModel.findOne({
			forgetPasswordToken,
			forgetPasswordExpire: { $gt: Date.now() },
		})

		if (!user) {
			return next(new ErrorResponse('Invalid token.', 400))
		}

		user.password = req.body.password
		user.forgetPasswordToken = undefined
		user.forgetPasswordExpire = undefined
		await user.save()

		res.status(200).json({ data: 'Your password has been set.' })
	} else {
		return next(avjErrorWrapper(resetPasswordBodyValidator.errors))
	}
}

// Helper function
const sendTokenResponse = (
	user: any,
	statusCode: number,
	res: Response
): any => {
	const token = user.getSignedJWTToken()

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000
		), //Expires in 1 hr
		httpOnly: true,
	}

	res.status(statusCode).cookie('token', token, options).json({ token })
}
