import jwt from 'jsonwebtoken'
import { Request, NextFunction, Response, RequestHandler } from 'express'
import { RegularUserJWTPayload } from '../features/regularUser/regularUserModel'
import ErrorResponse from '../utils/errorResponse'

interface RequestWithRegularUser extends Request {
  userJWT?: RegularUserJWTPayload
}

interface PrivateRequestHandler {
  (req: RequestWithRegularUser, res: Response, next: NextFunction):
    | void
    | Promise<void>
    | Promise<void | Response<any, Record<string, any>>>
}

const authMiddleware: PrivateRequestHandler = (req, res, next) => {
  let token = req.cookies.token

  if (!token) {
    token = req.body.token
  }
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
    console.error(err)
    return next(new ErrorResponse('Token is invalid.', 401))
  }
}

export { RequestWithRegularUser, PrivateRequestHandler }

export default authMiddleware
