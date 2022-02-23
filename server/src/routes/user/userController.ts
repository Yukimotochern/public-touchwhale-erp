import { Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

import UserModel from '../../model/User'

// @route    POST api/user/signup
// @desc     Signup user
// @access   Public
export const usersignup = async (req: Request, res: Response) => {
	const { email, company_name, password } = req.body

	try {
		let user = await UserModel.findOne({ email })

		if (user) {
			return res.status(200).json({ error: 'User already exists.' })
		}

		// @TODO: avatar load

		user = new UserModel({
			company_name,
			email,
			password,
		})

		await user.save()

		sendTokenResponse(user, 200, res)
	} catch (err) {
		console.log(err)
		res.status(500).send('Server error.')
	}
}

// @route    POST api/user/signin
// @desc     Signin user
// @access   Public
export const userSignin = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res
				.status(400)
				.json({ error: 'Please provide an email and password. ' })
		}

		const user = await UserModel.findOne({ email }).select('+password')

		if (!user) {
			return res.status(400).json({ error: 'Invalid credentials.' })
		}

		const isMatch = await user.matchPassword(password)

		if (!isMatch) {
			return res.status(400).json({ error: 'Invalid credentials.' })
		}

		sendTokenResponse(user, 200, res)
	} catch (err) {
		console.log(err)
		res.status(500).send('Server error.')
	}
}

// @route    GET api/user/logout
// @desc     Signout user
// @access   Private
export const userSignout = async (req: Request, res: Response) => {
	try {
		res.cookie('token', 'none', {
			expires: new Date(Date.now() + 10 * 1000),
			httpOnly: true,
		})

		res.status(200).json({
			data: {},
		})
	} catch (err) {
		console.log(err)
		res.status(500).send('Server error.')
	}
}

// @route    GET api/user/
// @desc     Get user infomation
// @access   Private
export const getUser = async (req: Request, res: Response) => {
	try {
		const cookie = req.cookies.token
		if (!cookie) {
			return res.status(401).send('Something wrong.')
		}
		const { id } = jwt.decode(cookie)! as JwtPayload
		const user = await UserModel.findById(id)

		res.status(200).json({
			data: user,
		})
	} catch (err) {
		console.log(err)
		res.status(500).send('Server error.')
	}
}

// @route    PUT api/user/
// @desc     Update user infomation
// @access   Private
export const updateUser = async (req: Request, res: Response) => {
	try {
		const { company_name, email, password } = req.body
		const fieldsToUpdate = {
			company_name,
			email,
		}

		const cookie = req.cookies.token
		if (!cookie) {
			return res.status(401).send('Something wrong.')
		}
		const { id } = jwt.decode(cookie)! as JwtPayload

		const user = await UserModel.findByIdAndUpdate(id, fieldsToUpdate, {
			new: true,
			runValidators: true,
		})

		res.status(200).json({
			data: user,
		})
	} catch (err) {
		console.log(err)
		res.status(500).send('Server error.')
	}
}

// @route    PUT api/user/resetpassword
// @desc     Update password
// @access   Private
export const resetpassword = async (req: Request, res: Response) => {
	try {
		const cookie = req.cookies.token
		if (!cookie) {
			return res.status(401).send('Something wrong.')
		}
		const { id } = jwt.decode(cookie)! as JwtPayload
		const user = await UserModel.findById(id).select('+password')

		if (!user) {
			return res.status(500).send('Server error.')
		}

		if (!(await user?.matchPassword(req.body.currentPassword))) {
			return res.status(400).json({ error: 'Password is incorrect.' })
		}

		user.password = req.body.newPassword
		await user.save()

		sendTokenResponse(user, 200, res)
	} catch (err) {
		console.log(err)
		res.status(500).send('Server error.')
	}
}

// @route    PUT api/user/forgetpassword
// @desc     Forget password
// @access   Public
export const forgetpassword = async (req: Request, res: Response) => {
	const user = await UserModel.findOne({ email: req.body.email })

	if (!user) {
		return res
			.status(404)
			.json({ error: 'There is no user with that email.' })
	}

	const token = user.getForgetPasswordToken()
	console.log(token)

	await user.save({ validateBeforeSave: false })

	// Create url
	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/user/forgetpassword/${token}`

	const message = `Make a PUT request to: \n ${resetUrl}`

	try {
		// @Question
		await sendEmail({
			to: user.email,
			subject: 'Password reset token',
			message,
		})

		res.status(200).json({ data: 'Email sent.' })
	} catch (err) {
		console.log(err)
		user.forgetPasswordToken = undefined
		user.forgetPasswordExpire = undefined

		await user.save({ validateBeforeSave: false })

		res.status(500).send('Email could not be sent.')
	}
}

// Helper function
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
	const token = user.getSignedJwtToken()

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000
		), //Expires in 1 hr
		httpOnly: true,
	}

	res.status(statusCode).cookie('token', token, options).json({ token })
}
