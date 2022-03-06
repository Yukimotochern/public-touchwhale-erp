import express from 'express'
import regularUser from './regularUser/regularUserRoutes'
import twItem from './twItem/twItemRoutes'

const api = express.Router()

api.use('/regularUser', regularUser)
api.use('/twItem', twItem)

export default api
