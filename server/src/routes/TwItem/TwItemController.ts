import { itemOwnerResponseHandler } from '../../middlewares/itemOwnerMiddleware'
import { PrivateRequestHandler } from '../../middlewares/authMiddleware'
import { advancedResultResponse } from '../../middlewares/advancedResult'

import TwItem from '../../models/TwItem'
import TwItemSetDetail from '../../models/TwItemSetDetail'

import ErrorResponse from '../../utils/errorResponse'
import uploadImage from '../../utils/AWS/uploadImage'

// Validator
import { addItemValidator } from './twItemValidate'
import { itemSetValidator } from '../twItemSetDetail/twItemSetValidate'

// @route    GET api/v1/twItem/
// @desc     Get all items with specific user
// @access   Private
export const getItems: PrivateRequestHandler = async (
	req,
	res: advancedResultResponse,
	next
) => {
	res.status(200).json(res.advancedResults)
}

// @route    POST api/v1/twItem/
// @desc     Add a item and ref to user
// @access   Private
export const addItem: PrivateRequestHandler = async (req, res, next) => {
	if (addItemValidator(req.body) && req.userJWT?.id) {
		const { name, unit, custom_id, count_stock, item_type, element } = req.body
		const item_for_user = await TwItem.findOne({
			user: req.userJWT.id,
			name: name.trim(),
		})
		if (item_for_user) {
			return next(
				new ErrorResponse(`You have a item with same name: \'${name}\' `)
			)
		}

		console.log(element)
		const item = new TwItem({
			user: req.userJWT.id,
			name,
			unit,
			custom_id,
			count_stock,
			item_type,
		})
		await item.save()

		if (item_type === 'set') {
			const set = new TwItemSetDetail({
				user: req.userJWT.id,
				parentItem: item._id,
				element,
			})

			await set.save()
		}

		res.status(200).json(item)
	}
}

// @route    GET api/v1/twItem/:id
// @desc     Get single item by item's id
// @access   Private
export const getItem: itemOwnerResponseHandler = async (req, res, next) => {
	// itemOwnerMiddleware result will ensure res.item will not be null
	res.status(200).json(res.item)
}

// @route    GET api/v1/twItem/uploadAvatar/:id
// @desc     Get B2 url for frontend to make a put request
// @access   Private
export const getB2URL: itemOwnerResponseHandler = async (req, res, next) => {
	const itemId = req.params.id
	const result = await uploadImage('TwItemImage', itemId)
	if (!res.item) {
		return next(new ErrorResponse('B2 can not set image to item.', 500))
	}
	res.item.image = result.Key
	await res.item.save()
	res.status(200).send(result)
}

// @route    PUT api/v1/twItem/:id
// @desc     Update item by item's id
// @access   Private
export const updateItem: itemOwnerResponseHandler = async (req, res, next) => {
	if (!req.userJWT?.id) {
		return next(new ErrorResponse('Invalid credentials.', 401))
	}
	if (addItemValidator(req.body) && res.item) {
		// User want to change these fields
		const { name, unit, custom_id, count_stock, item_type } = req.body

		// itemOwnerMiddleware will check user is owner with this item(/:id) and to next()
		const item = res.item

		// Find if user has a item's name that same with req.body
		const item_for_user = await TwItem.findOne({
			user: req.userJWT.id,
			name: name.trim(),
		})

		// Check if that item not equal with item(/:id)
		if (
			item_for_user?.custom_id &&
			item_for_user?.custom_id !== item.custom_id
		) {
			return next(
				new ErrorResponse(`You have a item with same name: \'${name}\' `)
			)
		}

		item.name = name ? name : item.name
		item.unit = unit ? unit : item.unit
		item.custom_id = custom_id ? custom_id : item.custom_id
		item.count_stock = count_stock ? count_stock : item.count_stock
		item.item_type = item_type ? item_type : item.item_type
		try {
			await item.save()
		} catch (err) {
			return next(
				new ErrorResponse(
					'Something wrong. Maybe there has duplicate field in your items',
					401,
					err
				)
			)
		}
		res.status(200).json(item)
	}
}

// @route    DELETE api/v1/twItem/:id
// @desc     Update item by item's id
// @access   Private
export const deleteItem: itemOwnerResponseHandler = async (req, res, next) => {
	res.item?.delete()

	res.status(200).json('Item deleted.')
}
