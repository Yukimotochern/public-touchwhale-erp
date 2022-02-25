import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, NextFunction, Response } from 'express'
import { RegualrUserJWTPayload } from '../models/User'

interface RequestWithRegualrUser extends Request {
	user?: RegualrUserJWTPayload
}

interface PrivateRequestHandler {
	(req: RequestWithRegualrUser, res: Response, next: NextFunction): void
}

const authMiddleware: PrivateRequestHandler = (req, res, next) => {
	const token = req.cookies.token

	if (!token) {
		return res.status(401).json({ error: 'No token, authorization denied.' })
	}
	// console.log(token)
	try {
		const decode = jwt.verify(
			token,
			process.env.JWTSECRET
		) as RegualrUserJWTPayload

		req.user = decode
		next()
	} catch (err) {
		res.status(400).json({ error: 'Token is invalid.' })
	}
}

export { RequestWithRegualrUser, PrivateRequestHandler }

export default authMiddleware
