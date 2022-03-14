import express from 'express'
import { getRoles } from './roleControllers'

// Middleware
import authMiddleware from '../../middlewares/authMiddleware'
import errorCatcher from '../../middlewares/errorCatcher'

const router = express.Router()

router.route('/').get(authMiddleware, errorCatcher(getRoles))

export default router
