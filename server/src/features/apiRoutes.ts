import express from 'express'
import regularUser from './regularUser/regularUserRoutes'
import twItem from './twItem/twItemRoutes'
import user from './user/userRoutes'

const api = express.Router()

api.use('/regularUser', regularUser)
api.use('/twItem', twItem)
api.use('/user', user)

export default api
