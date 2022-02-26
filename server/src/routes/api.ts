import express from 'express'
import regularUser from './regularUser/userRoutes'

const api = express.Router()

api.use('/regularUser', regularUser)

export default api
