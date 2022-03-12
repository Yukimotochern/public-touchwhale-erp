import jwt from 'jsonwebtoken'
import { RequestHandler } from 'express'
import { JSONSchemaType } from 'ajv'
import ajv from '../utils/ajv'
import ErrorResponse from '../utils/errorResponse'

export interface AuthJWT {
  id: string
  iat: number
  exp: number
}

declare global {
  namespace Express {
    interface Request {
      userJWT?: AuthJWT
    }
    interface Response {}
    interface Application {}
  }
}

// export interface RequestWithRegularUser extends Request {
//   userJWT?: AuthJWT
// }

// export interface PrivateRequestHandler {
//   (req: RequestWithRegularUser, res: Response, next: NextFunction):
//     | void
//     | Promise<void>
//     | Promise<void | Response<any, Record<string, any>>>
// }

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

const tokenValidator = ajv.compile(tokenSchema)

const authMiddleware: RequestHandler = (req, res, next) => {
  let token = req.body.token

  if (!token) {
    token = req.cookies.token
  }
  if (!token) {
    return next(new ErrorResponse('No token, authorization denied.', 401))
  }
  try {
    const decode = jwt.verify(token, process.env.JWTSECRET)
    if (tokenValidator(decode)) {
      req.userJWT = decode
      return next()
    } else {
      return next(new ErrorResponse('Token is invalid.', 401))
    }
  } catch (err) {
    console.log('Token is invalid.')
    return next(new ErrorResponse('Token is invalid.', 401, err))
  }
}

export default authMiddleware
