import express from 'express'
import dotenv from 'dotenv'
import api_v1 from './routes/api'
import connectDB from './utils/mongodb'

const app = express()

// Load env vars
dotenv.config({ path: './config/config.env' })

// Connect to MongoDB
connectDB()

// Init Middleware
app.use(express.json({ limit: '999999MB' }))
app.use('/api/v1', api_v1)

app.listen(5000)
