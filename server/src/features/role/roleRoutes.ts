import express from 'express'
import {
  getRoles,
  createRole,
  getRole,
  updateRole,
  deleteRole,
} from './roleControllers'

// Middleware
import auth from '../../middlewares/authMiddleware'
import errorCatcher from '../../middlewares/errorCatcher'
import { permission } from '../../middlewares/permissionMiddleware'

const router = express.Router()

router
  .route('/')
  .all(auth)
  .get(permission(['role.get_roles']), errorCatcher(getRoles))
  .post(permission(['role.create_role']), errorCatcher(createRole))

router
  .route('/:id')
  .all(auth)
  .get(permission(['role.get_role']), errorCatcher(getRole))
  .put(permission(['role.update_role']), errorCatcher(updateRole))
  .delete(permission(['role.delete_role']), errorCatcher(deleteRole))

export default router
