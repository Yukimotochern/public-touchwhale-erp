import { NextFunction, RequestHandler, Response } from 'express'
import {
  RequestWithGoogleProfile,
  GoogleAuthCallbackHandler,
} from '../../utils/passportOAuth'
import { PrivateRequestHandler } from '../../middlewares/authMiddleware'
import crypto from 'crypto'

import { sendEmail } from '../../utils/sendEmail'
import { avjErrorWrapper } from '../../utils/ajv'
import ErrorResponse from '../../utils/errorResponse'
import { mongo } from 'mongoose'

import {
  signInBodyValidator,
  signUpBodyValidator,
  updateRegularUserBodyValidator,
  changePasswordBodyValidator,
  forgetPasswordBodyValidator,
  resetPasswordBodyValidator,
} from './userValidate'

import RegularUserModel from '../../models/RegularUser'
import {
  forgetPasswordMessage,
  sixDigitsMessage,
} from '../../utils/emailMessage'
import uploadImage from '../../utils/AWS/uploadImage'

// @route    POST api/v1/regularUser/signUp
// @desc     Signup regularuser
// @access   Public
export const regularUserSignUp: RequestHandler = async (req, res, next) => {
  if (signUpBodyValidator(req.body)) {
    const { email } = req.body
    let user = await RegularUserModel.findOne({ email })
    if (user && user.active) {
      return next(new ErrorResponse('Email has been taken.', 409))
    }
    // Since req.body has been strictly validate by ajv, we can plug it into query, by Yuki
    const sixDigits = Math.floor(100000 + Math.random() * 900000).toString()
    if (!user) {
      user = new RegularUserModel({
        email,
        password: sixDigits, //Generate 6 digits number
        provider: 'TouchWhale',
      })
    } else {
      user.password = sixDigits
    }
    await user.save({ validateBeforeSave: false })

    const message = sixDigitsMessage({ sixDigits })
    await sendEmail({
      to: email,
      subject: 'Your verificatiom code',
      message: message,
    })

    res
      .status(200)
      .json({ data: `Verification code has been send to ${email}` })
  } else {
    return next(avjErrorWrapper(signUpBodyValidator.errors))
  }
}

// @route    POST api/v1/regularUser/signUp/verify
// @desc     New regularuser enter verification code
// @access   Public
export const regularUserVerify: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body
  const user = await RegularUserModel.findOne({ email }).select('+password')
  if (!user || user.active) {
    return next(new ErrorResponse('User email is invalid.', 401))
  }

  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials.', 401))
  }
  return res.status(200).json({ token: user.getSignedJWTToken() })
}

// @route    POST api/v1/regularUser/signIn or POST api/v1/regularUser/signUp/verify
// @desc     Sign regularuser in
// @access   Public
export const regularUserSignIn: RequestHandler = async (req, res, next) => {
  if (signInBodyValidator(req.body)) {
    const { email, password } = req.body
    const user = await RegularUserModel.findOne({ email }).select('+password')
    if (!user || !user.active) {
      return next(
        new ErrorResponse(
          'User not found or maybe you have not been verified.',
          404
        )
      )
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

// @route    Google OAuth callback
// @desc     Call back function for google OAuth
// @access   Public
export const OAuthCallback: GoogleAuthCallbackHandler = async (
  req,
  res,
  next
) => {
  try {
    if (req.user) {
      const profile = req.user._json
      const email = profile.email

      let user = await RegularUserModel.findOne({ email })

      if (!user) {
        user = new RegularUserModel({
          email: profile?.email,
          password: crypto.randomBytes(10).toString('hex'),
          avatar: profile?.picture,
          provider: 'Google',
        })

        await user.save()
      } else {
        if (user.provider !== 'Google') {
          user.provider = 'Google'
          await user.save()
        }
      }
      setToken(user, 200, res)
      return res.redirect('/')
    } else {
      return next(new ErrorResponse('Google Bad Request', 500))
    }
  } catch (err) {
    return next(new ErrorResponse('Google Bad Request', 500, err))
  }
}

// @route    GET api/v1/regularUser/signOut
// @desc     Sign regularuser out
// @access   Private
export const regularUserSignOut: PrivateRequestHandler = async (
  req,
  res,
  next
) => {
  res.clearCookie('token', {
    httpOnly: true,
  })

  res.status(200).json({
    data: {},
  })
}

// @route    GET api/v1/regularUser/
// @desc     Get regularuser infomation
// @access   Private
export const getRegularUser: PrivateRequestHandler = async (req, res, next) => {
  if (req.userJWT) {
    const user = await RegularUserModel.findById(req.userJWT.id)
    if (user) {
      res.status(200).json({
        data: user,
      })
    }
  } else {
    return next(new ErrorResponse('Server Error'))
  }
}

// @route    PUT api/v1/regularUser/
// @desc     Update regularUser infomation
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
    if (req.userJWT) {
      const user = await RegularUserModel.findByIdAndUpdate(
        req.userJWT.id,
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

// @route    GET api/v1/regularUser/uploadAvatar
// @desc     Get B2 url for frontend to make a put request
// @access   Private
export const getB2URL: PrivateRequestHandler = async (req, res, next) => {
  if (!req.userJWT?.id) {
    return next(new ErrorResponse('Invalid credentials.'))
  }
  const { id } = req.userJWT
  res.status(200).send(await uploadImage(id))
}

// @route    POST api/v1/regularUser/uploadAvatar
// @desc     Set imageKey in RegularUser
// @access   Private
export const setAvatar: PrivateRequestHandler = async (req, res, next) => {
  try {
    const { id, imgKey } = req.body

    const user = await RegularUserModel.findById(id)
    if (!user) {
      return next(new ErrorResponse('Server Error.'))
    }
    user.avatar = imgKey
    user.save()

    res.status(200).json({ id: user.id, imgKey })
  } catch (err) {
    return next(new ErrorResponse('Server Error', 500, err))
  }
}

// @route    PUT api/v1/regularUser/changePassword
// @desc     Update password
// @access   Private
export const changePassword: PrivateRequestHandler = async (req, res, next) => {
  if (changePasswordBodyValidator(req.body) && req.userJWT) {
    const user = await RegularUserModel.findById(req.userJWT.id).select(
      '+password'
    )
    if (user && user.active) {
      if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect.', 400))
      }
      user.password = req.body.newPassword
      await user.save()
      return sendTokenResponse(user, 200, res)
    } else if (user && !user.active) {
      user.password = req.body.newPassword
      user.active = true
      await user.save()
      return sendTokenResponse(user, 200, res)
    }
    return next(new ErrorResponse('Server Error'))
  } else {
    return next(avjErrorWrapper(changePasswordBodyValidator.errors))
  }
}

// @route    POST api/v1/regularUser/forgetPassword
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
    const option = {
      protocol: req.protocol,
      host: req.get('host'),
      token,
    }
    const message = forgetPasswordMessage(option)
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
// @route       PUT /api/v1/regularUser/forgetPassword/:resetToken
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

// Helper functions
const setToken = (user: any, statusCode: number, res: Response): any => {
  const token = user.getSignedJWTToken()
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000
    ), //Expires in 1 hr
    httpOnly: true,
  }

  res.status(statusCode).cookie('token', token, options)
  return token
}

const sendTokenResponse = (
  user: any,
  statusCode: number,
  res: Response
): void => {
  const token = setToken(user, statusCode, res)
  res.json({ token })
}
