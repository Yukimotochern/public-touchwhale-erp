import ErrorResponse, { TWError } from '../utils/errorResponse'
import { DefinedError } from 'ajv'

import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (err: TWError, req, res, next) => {
  // Log to console for dev
  console.error(err)
  let error = new ErrorResponse(err.message || 'Server Error', 500, err)
  let message: string, messageArray: string[]

  switch (err.name) {
    // Mongoose bad ObjectId or other fields
    case 'CastError':
      message = 'Resource not found'
      error = new ErrorResponse(message, 404, err)
      break
    // Mongoose validation error
    case 'ValidationError':
      message = 'Invalid data provided'
      messageArray = Object.values(err.errors).map((val) => val.message)
      error = new ErrorResponse(message, 400, err, messageArray)
      break
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error,
  })
}
export { errorHandler }
