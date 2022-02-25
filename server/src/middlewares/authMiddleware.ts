import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, NextFunction, Response } from 'express'
import { RegularUserJWTPayload } from '../models/RegularUser'
import ErrorResponse from '../utils/errorResponse'

interface RequestWithRegularUser extends Request {
	user?: RegularUserJWTPayload
}

interface PrivateRequestHandler {
	(req: RequestWithRegularUser, res: Response, next: NextFunction): void
}

const authMiddleware: PrivateRequestHandler = (req, res, next) => {
	const token = req.cookies.token

	if (!token) {
		return next(new ErrorResponse('No token, authorization denied.', 401))
	}
	// console.log(token)
	try {
		const decode = jwt.verify(
			token,
			process.env.JWTSECRET
		) as RegularUserJWTPayload

		req.user = decode
		next()
	} catch (err) {
		return next(new ErrorResponse('Token is invalid.', 401))
	}
}

export { RequestWithRegularUser, PrivateRequestHandler }

export default authMiddleware
