import path from 'path'
import dotenv from 'dotenv'

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') })

import express from 'express'
import cookieParser from 'cookie-parser'

import passport from 'passport'
import cors from 'cors'

// routes
import api_v1 from './features/apiRoutes'

import connectDB from './utils/mongodb'
import 'colorts/lib/string'
import { errorHandler } from './middlewares/errorMiddleware'
import passportOAuth from './utils/passportOAuth'

const app = express()

app.use(cookieParser())

// Connect to MongoDB
connectDB()

// Init Middleware
app.use(express.json({ limit: '999999MB' }))

passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser((user: any, done) => {
  done(null, user)
})

passportOAuth(passport)

// Enable CORS
app.use(cors())

// Mount API
app.use('/api/v1', api_v1)

app.use(errorHandler)

const PORT = process.env.SERVER_PORT || 5000

export const server = app.listen(PORT, () =>
  console.log(
    `[server] Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      .yellow.bold
  )
)

server.setTimeout(999999999)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')))
  app.get('*', (req, res) => {
    res.setHeader('Set-Cookie', 'HttpOnly;Secure;SameSite=Strict')
    res.sendFile(
      path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html')
    )
  })
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any, promise) => {
  if (err instanceof Error) {
    console.log(`Unhandled Rejection: ${err.message}`)
  } else {
    console.error(`Unknown thing thrown: ${err}`)
  }
  // Close server & exit process
  server.close(() => process.exit(1))
})

export default app
