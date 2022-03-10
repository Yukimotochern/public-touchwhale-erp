import express from 'express'
import authMiddleware from '../../middlewares/authMiddleware'
import itemOwnerMiddleware from '../../middlewares/itemOwnerMiddleware'
import advancedResult from '../../middlewares/advancedResult'
import errorCatcher from '../../middlewares/errorCatcher'

import {
  addItem,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  getB2URL,
} from './twItemController'
import { TwItem } from './twItemModel'

const router = express.Router()

// @todo twItem routes supposed to handle diff user access right.
router
  .route('/')
  .get(
    [authMiddleware, advancedResult(TwItem, 'setOfElement')],
    errorCatcher(getItems)
  )
  .post(authMiddleware, errorCatcher(addItem))

router
  .route('/:id')
  .get([authMiddleware, itemOwnerMiddleware], errorCatcher(getItem))
  .put([authMiddleware, itemOwnerMiddleware], errorCatcher(updateItem))
  .delete([authMiddleware, itemOwnerMiddleware], errorCatcher(deleteItem))

router
  .route('/uploadImage/:id')
  .get([authMiddleware, itemOwnerMiddleware], errorCatcher(getB2URL))

export default router
