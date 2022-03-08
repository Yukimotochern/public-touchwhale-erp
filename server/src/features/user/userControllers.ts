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
import { signUpBodyValidator } from './userValidators'
import { ResBody } from '../../types/CustomExpressTypes'

// @route    POST api/v1/user/signUp
// @desc     Sign user up
// @access   Public

export const userSignUp: RequestHandler<{}, ResBody> = async (
  req,
  res,
  next
) => {
  if (signUpBodyValidator(req.body)) {
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
    // how to do success response ?
    res.status(200).json({ message: '' })
  }
  next(avjErrorWrapper(signUpBodyValidator.errors))
}
