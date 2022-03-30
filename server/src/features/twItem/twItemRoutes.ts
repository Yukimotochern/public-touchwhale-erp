import express from 'express'
import auth from '../../middlewares/authMiddleware'
import errorCatcher from '../../middlewares/errorCatcher'
import { permission } from '../../middlewares/permissionMiddleware'

import {
  createItem,
  getItemsWithDetail,
  getItems,
  getItem,
  updateItem,
  deleteItem,
  getB2URL,
  deleteItemImage,
} from './twItemController'

const router = express.Router()

router
  .route('/')
  .all(auth)
  .get(permission(['tw_item.get_items']), errorCatcher(getItems))
  .post(permission(['tw_item.create_item']), errorCatcher(createItem))

router.get(
  '/withDetail',
  auth,
  permission(['tw_item.get_items_with_detail']),
  getItemsWithDetail
)

router
  .route('/:id')
  .all(auth)
  .get(permission(['tw_item.get_item']), errorCatcher(getItem))
  .put(permission(['tw_item.update_item']), errorCatcher(updateItem))
  .delete(permission(['tw_item.delete_item']), errorCatcher(deleteItem))

router.get(
  '/uploadImage/:id',
  auth,
  permission(['tw_item.upload_img']),
  errorCatcher(getB2URL)
)
router.delete(
  '/uploadImage/:key',
  auth,
  permission(['tw_item.delete_img']),
  errorCatcher(deleteItemImage)
)

export default router
