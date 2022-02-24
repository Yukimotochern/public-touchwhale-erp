import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, NextFunction, Response } from 'express'
import { UserJWTPayload } from '../models/User'

interface RequestWithUser extends Request {
  user?: UserJWTPayload
}

interface PrivateRequestHandler {
  (req: RequestWithUser, res: Response, next: NextFunction): void
}

const authMiddleware: PrivateRequestHandler = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied.' })
  }

  try {
    const decode = jwt.verify(token, process.env.JWTSECRET) as JwtPayload
    req.user = decode.user
    next()
  } catch (err) {
    res.status(400).json({ error: 'Token is invalid.' })
  }
}

export { RequestWithUser, PrivateRequestHandler }

export default authMiddleware
