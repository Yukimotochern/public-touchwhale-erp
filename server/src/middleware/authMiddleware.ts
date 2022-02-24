import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface userRequest extends Request {
  user?: any
}

export default function (req: userRequest, res: Response, next: NextFunction) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied.' })
  }

  try {
    const decode = jwt.verify(token, process.env.JWTSECRET) as JwtPayload

    req.user = decode.user
    next()
  } catch (err) {
    res.status(400).json({ error: 'Token is not valid.' })
  }
}
