import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware'
// import itemOwnerMiddleware from '../../middlewares/itemOwnerMiddleware'  2022/3/18 deprecated
import advancedResult from '../../middlewares/advancedResult'
import errorCatcher from '../../middlewares/errorCatcher'

import {
	addItem,
	getItems,
	getItem,
	updateItem,
	deleteItem,
	getB2URL,
	deleteItemImage,
} from './twItemController'
import { TwItem } from './twItemModel'

const router = express.Router()

// @todo twItem routes supposed to handle diff user access right.
router
	.route('/')
	.all(authMiddleware)
	.get([advancedResult(TwItem, 'setOfElement')], errorCatcher(getItems))
	.post(errorCatcher(addItem))

router
	.route('/:id')
	.all(authMiddleware)
	.get(errorCatcher(getItem))
	.put(errorCatcher(updateItem))
	.delete(errorCatcher(deleteItem))

router
	.route('/uploadImage/:id')
	.all(authMiddleware)
	.get(errorCatcher(getB2URL))
	.delete(errorCatcher(deleteItemImage))

export default router
