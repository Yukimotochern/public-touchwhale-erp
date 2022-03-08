import jwt from 'jsonwebtoken'
import { Request, NextFunction, Response } from 'express'
import { JSONSchemaType } from 'ajv'
import ajvInstance from '../utils/ajv'
import ErrorResponse from '../utils/errorResponse'

export interface AuthJWT {
  id: string
  iat: number
  exp: number
}

export interface RequestWithRegularUser extends Request {
  userJWT?: AuthJWT
}

export interface PrivateRequestHandler {
  (req: RequestWithRegularUser, res: Response, next: NextFunction):
    | void
    | Promise<void>
    | Promise<void | Response<any, Record<string, any>>>
}

const tokenSchema: JSONSchemaType<AuthJWT> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    iat: { type: 'number' },
    exp: { type: 'number' },
  },
  required: ['id', 'iat', 'exp'],
  additionalProperties: true,
}

const tokenValidator = ajvInstance.compile(tokenSchema)

const authMiddleware: PrivateRequestHandler = (req, res, next) => {
  let token = req.cookies.token

  if (!token) {
    token = req.body.token
  }
  if (!token) {
    return next(new ErrorResponse('No token, authorization denied.', 401))
  }
  try {
    const decode = jwt.verify(token, process.env.JWTSECRET)
    if (tokenValidator(decode)) {
      req.userJWT = decode
      next()
    }
    return next(new ErrorResponse('Token is invalid.', 401))
  } catch (err) {
    console.error(err)
    return next(new ErrorResponse('Token is invalid.', 401, err))
  }
}

export default authMiddleware
