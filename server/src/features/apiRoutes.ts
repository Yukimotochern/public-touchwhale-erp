import express from 'express'
import twItem from './twItem/twItemRoutes'
import user from './user/userRoutes'

const api = express.Router()
api.use('/twItem', twItem)
api.use('/user', user)

export default api
