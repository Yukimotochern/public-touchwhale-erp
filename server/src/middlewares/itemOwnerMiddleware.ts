import { PrivateRequestHandler } from './authMiddleware'
import ErrorResponse from '../utils/errorResponse'

import TwItem, { TwItemPayload } from '../models/TwItem'

import { Request, NextFunction, Response } from 'express'
import { RequestWithRegularUser } from './authMiddleware'

interface itemOwnerResponse extends Response {
	item?: TwItemPayload
}

interface itemOwnerResponseHandler {
	(
		req: RequestWithRegularUser,
		res: itemOwnerResponse,
		next: NextFunction
	): void | Promise<void>
}

const itemOwnerMiddleware: itemOwnerResponseHandler = async (
	req,
	res,
	next
) => {
	if (req.userJWT?.id) {
		const itemId = req.params.id
		const populate = req.query.populate

		let query = TwItem.findById(itemId)

		if (populate) {
			query = query.populate('setOfElements', 'element')
		}

		const item = await query

		// Ensure that item must exist and user have ownership with this item
		if (!item || item.user.toString() !== req.userJWT.id) {
			return next(new ErrorResponse('Item not found', 404))
		}

		res.item = item

		next()
	}

	return next(new ErrorResponse('Server Error', 500))
}

export { itemOwnerResponseHandler }

export default itemOwnerMiddleware
