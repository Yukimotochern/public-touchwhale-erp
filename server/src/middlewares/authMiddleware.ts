import jwt from 'jsonwebtoken'
import { RequestHandler } from 'express'
import { JSONSchemaType } from 'ajv'
import ajv from 'api/dist/utils/ajv'
import CustomError from '../utils/CustomError'

export interface AuthJWT {
  id: string
  iat: number
  exp: number
  isOwner: boolean
  owner: string
}

declare global {
  namespace Express {
    interface Request {
      userJWT?: AuthJWT
    }
    interface Response {
      owner: string
    }
  }
}

const tokenSchema: JSONSchemaType<AuthJWT> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    iat: { type: 'number' },
    exp: { type: 'number' },
    isOwner: { type: 'boolean' },
    owner: { type: 'string' },
  },
  required: ['id', 'iat', 'exp', 'isOwner', 'owner'],
  additionalProperties: true,
}

const tokenValidator = ajv.compile(tokenSchema)

const authMiddleware: RequestHandler = (req, res, next) => {
  let token = req.body.token

  if (!token) {
    token = req.cookies.token
  }
  if (!token) {
    return next(new CustomError('No token, authorization denied.', 401))
  }
  try {
    const decode = jwt.verify(token, process.env.JWTSECRET)
    if (tokenValidator(decode)) {
      req.userJWT = decode
      // used to check owner when sending data
      res.owner = decode.owner
      return next()
    } else {
      return next(new CustomError('Token is invalid.', 401))
    }
  } catch (err) {
    console.log('Token is invalid.')
    return next(new CustomError('Token is invalid.', 401, err))
  }
}

export default authMiddleware
