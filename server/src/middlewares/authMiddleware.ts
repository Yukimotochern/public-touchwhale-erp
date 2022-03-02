import jwt from 'jsonwebtoken'
import { Request, NextFunction, Response } from 'express'
import { RegularUserJWTPayload } from '../models/RegularUser'
import ErrorResponse from '../utils/errorResponse'

interface RequestWithRegularUser extends Request {
  userJWT?: RegularUserJWTPayload
}

interface PrivateRequestHandler {
  (
    req: RequestWithRegularUser,
    res: Response,
    next: NextFunction
  ): void | Promise<void>
}

const authMiddleware: PrivateRequestHandler = (req, res, next) => {
  let token = req.body.token
  if (!token) {
    token = req.cookies.token
  }
  console.log(token)
  if (!token) {
    return next(new ErrorResponse('No token, authorization denied.', 401))
  }
  try {
    const decode = jwt.verify(
      token,
      process.env.JWTSECRET
    ) as RegularUserJWTPayload

    req.userJWT = decode
    next()
  } catch (err) {
    return next(new ErrorResponse('Token is invalid.', 401))
  }
}

export { RequestWithRegularUser, PrivateRequestHandler }

export default authMiddleware
