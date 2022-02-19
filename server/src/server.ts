import express from 'express'
import dotenv from 'dotenv'
import api_v1 from './routes/api'

const app = express()

// Load env vars
dotenv.config({ path: './config/config.env' })

// Init Middleware
app.use(express.json({ limit: '999999MB' }))
app.use('/api/v1', api_v1)

console.log('text')
console.log('Hello World!')
app.listen(5000)
