import { Request, Response, NextFunction } from 'express'

export default function (ajvValidate: any) {
	return (req: Request, res: Response, next: NextFunction) => {
		const valid = ajvValidate(req.body)

		if (!valid) {
			const errors = ajvValidate.errors
			return res.status(400).json(errors)
		}
		next()
	}
}
