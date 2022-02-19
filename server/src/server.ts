import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import api_v1 from './routes/api'
import connectDB from './utils/mongodb'
import 'colorts/lib/string'

const app = express()

// Load env vars
dotenv.config({ path: path.join('.', 'src', 'config', 'config.env') })

// Connect to MongoDB
connectDB()

// Init Middleware
app.use(express.json({ limit: '999999MB' }))
app.use('/api/v1', api_v1)

const server = app.listen(5000)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any, promise) => {
  if (typeof err.message === 'string') {
    console.log(`Unhandled Rejection: ${err.message}`)
  } else {
    console.error(`Unknown thing thrown: ${err}`)
  }
  // Close server & exit process
  server.close(() => process.exit(1))
})
