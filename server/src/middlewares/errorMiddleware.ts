import ErrorResponse, { TWError } from '../utils/errorResponse'
import { DefinedError } from 'ajv'

import { ErrorRequestHandler } from 'express'
import { Error } from 'mongoose'

const errorHandler: ErrorRequestHandler = (err: any, req, res, next) => {
  // Log to console for dev
  console.error(err)
  let error = new ErrorResponse(
    err.message || 'Server Error',
    err.statusCode || 500,
    err
  )
  if (err instanceof ErrorResponse) {
    error = err
  }
  let message: string, messageArray: string[]
  if (err instanceof Error.CastError) {
    message = 'Resource not found'
    error = new ErrorResponse(message, 404, err)
  }
  if (err instanceof Error.ValidationError) {
    message = 'Invalid data provided'
    messageArray = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400, err, messageArray)
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message,
      errorData: error.errorData,
      messageArray: error.messageArray,
    },
  })
}
export { errorHandler }
