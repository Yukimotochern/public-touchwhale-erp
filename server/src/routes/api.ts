import express from 'express'
import regularUser from './regularUser/userRoutes'
import twItem from './TwItem/twItemRoutes'

const api = express.Router()

api.use('/regularUser', regularUser)
api.use('/twItem', twItem)

export default api
