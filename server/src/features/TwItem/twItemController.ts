// Models
import TwItem from './TwItem'
import TwItemSetDetail from './TwItemSetDetail'

// Middlewares
import { advancedResultResponse } from '../../middlewares/advancedResult'
import { PrivateRequestHandler } from '../../middlewares/authMiddleware'

// Utils modules
import uploadImage from '../../utils/AWS/uploadImage'
import ErrorResponse from '../../utils/errorResponse'

// Type definition
import {
	addItemBodyType,
	AddItemRequestHandler,
	AddItemRequestType,
	itemOwnerResponseHandler,
} from './twItemType'

// Validator
import { addItemValidator } from './twItemValidate'

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
export const addItem: AddItemRequestHandler = async (req, res, next) => {
	if (addItemValidator(req.body) && req.userJWT?.id) {
		const { name, unit, custom_id, count_stock, item_type, element } =
			req.body as AddItemRequestType
		const item_for_user = await TwItem.findOne({
			user: req.userJWT.id,
			name: name.trim(),
		})
		if (item_for_user) {
			return next(
				new ErrorResponse(`You have a item with same name: \'${name}\' `)
			)
		}
		if (item_type === 'element' && element) {
			return next(
				new ErrorResponse('You can not set element into single item.')
			)
		}

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
			// await item.save() worst case is n, best case is 1
			element.map(async (ele) => {
				const element = await TwItem.findById(ele.id)
				if (element && element.level > item.level) {
					item.level += element.level + 1
					await item.save()
				}
			})
			const set = new TwItemSetDetail({
				user: req.userJWT.id,
				parentItem: item._id,
				element,
			})
			await set.save()
		}

		res.status(200).json({ data: item })
	}
}

// @route    GET api/v1/twItem/:id
// @desc     Get single item by item's id
// @access   Private
export const getItem: itemOwnerResponseHandler = async (req, res, next) => {
	// itemOwnerMiddleware result will ensure res.item will not be null
	res.status(200).json({ data: res.item })
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
	res.status(200).send({ msg: result })
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
		const { name, unit, custom_id, count_stock, item_type, element } = req.body

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

		if (item_type === 'element' && element) {
			return next(
				new ErrorResponse('You can not set element into single intem.')
			)
		}

		item.name = name ? name : item.name
		item.unit = unit ? unit : item.unit
		item.custom_id = custom_id ? custom_id : item.custom_id
		item.count_stock = count_stock ? count_stock : item.count_stock
		item.item_type = item_type ? item_type : item.item_type

		try {
			if (element) {
				if (res.itemSetElement) {
					console.log(res.itemSetElement)

					const itemSetElement = res.itemSetElement
					itemSetElement.element = element
					await itemSetElement.save()
				} else {
					const set = new TwItemSetDetail({
						user: req.userJWT.id,
						parentItem: item._id,
						element,
					})

					await set.save()
				}
			}

			await item.save()
			res.status(200).json({ data: item.populate('setOfElement', 'element') })
		} catch (err) {
			return next(
				new ErrorResponse(
					'Something wrong. Maybe there has duplicate field in your items',
					401,
					err
				)
			)
		}
	}
}

// @route    DELETE api/v1/twItem/:id
// @desc     Update item by item's id
// @access   Private
export const deleteItem: itemOwnerResponseHandler = async (req, res, next) => {
	res.item?.delete()

	res.status(200).json({ msg: 'Item deleted.' })
}
