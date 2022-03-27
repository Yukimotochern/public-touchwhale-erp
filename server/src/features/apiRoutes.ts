import express from 'express'
import twItem from './twItem/twItemRoutes'
import user from './user/userRoutes'
import role from './role/roleRoutes'

const api = express.Router()
api.use('/twItem', twItem)
api.use('/user', user)
api.use('/role', role)

export default api
