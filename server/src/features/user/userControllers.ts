import { RequestHandler, Response } from 'express'
import { GoogleAuthCallbackHandler } from '../../utils/passportOAuth'
import { PrivateRequestHandler } from '../../middlewares/authMiddleware'
import crypto from 'crypto'

import { sendEmail } from '../../utils/sendEmail'
import { avjErrorWrapper } from '../../utils/ajv'
import ErrorResponse from '../../utils/errorResponse'
import UserModel from './userModel'
import {
  forgetPasswordMessage,
  sixDigitsMessage,
} from '../../utils/emailMessage'
import { uploadImage, deleteImage } from '../../utils/AWS/b2'
import { UserValidator } from './userValidators'
import { ResBody } from '../../types/CustomExpressTypes'
import { send } from '../../utils/customExpress'
import mongoose from 'mongoose'

const { SignUp, Verify, SignIn } = UserValidator

// @route    POST api/v1/user/signUp
// @desc     Sign user up
// @access   Public
export const userSignUp: RequestHandler<{}, ResBody> = async (
  req,
  res,
  next
) => {
  if (SignUp.body(req.body)) {
    const { email } = req.body
    let user = await UserModel.findOne({ email })
    const sixDigits = Math.floor(100000 + Math.random() * 900000).toString()
    if (user) {
      if (user.isActive) {
        // User already register and has been activated
        return next(new ErrorResponse('User already exists.', 409))
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
    return send(res, 200, {
      message: `Verification code has been send to ${email}`,
    })
  }
  next(avjErrorWrapper(SignUp.body.errors))
}

// @route    POST api/v1/user/
// @desc
// @access   Public
export const userVerify: RequestHandler = async (req, res, next) => {
  if (Verify.body(req.body)) {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email }).select('+password')
    if (!user || user.isActive) {
      return next(new ErrorResponse('User email is invalid.', 401))
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials.', 401))
    }
    return Verify.sendData(res, user.getSignedJWTToken())
  }
  next(avjErrorWrapper(Verify.body.errors))
}

// @route    POST api/v1/user/signIn
// @desc     Sign user in
// @access   Public
export const userSignIn: RequestHandler = async (req, res, next) => {
  if (SignIn.body(req.body)) {
    const { email, login_name, password } = req.body
    let user = await UserModel.findOne({ login_name }).select('+password')
    if (!user) {
      user = await UserModel.findOne({ email }).select('+password')
    }
    if (!user || !user.isActive) {
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
  }
  next(avjErrorWrapper(SignIn.body.errors))
}

// @route    Google OAuth callback
// @desc     Call back function for google OAuth
// @access   Public
export const userOAuthCallbackSignUP: RequestHandler = async (
  req,
  res,
  next
) => {
  if (req.user) {
  }
}

/*
// @route    POST api/v1/user/
// @desc     
// @access   Public
export const userXXX: RequestHandler = async (req, res, next) => {
  if (XXX.body(req.body)) {
    // return send(res, {})
    // or
    // return XXX.sendData(res, {})
  }
  next(avjErrorWrapper(XXX.body.errors))
}
*/

// Helper functions
const setToken = (user: any, res: Response): any => {
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
  user: any,
  statusCode: number,
  res: Response
): void => {
  const token = setToken(user, res)
  send(res, statusCode)
  res.status(statusCode).json({ token })
}
