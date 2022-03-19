import CustomError, { MongoError } from '../utils/CustomError'
// import { serializeError } from 'serialize-error'
import { DefinedError } from 'ajv'
import { ErrorRequestHandler } from 'express'
import { Error as MongooseError, mongo } from 'mongoose'

const errorHandler: ErrorRequestHandler = (err: any, req, res, next) => {
  // catch error that has definite type
  // mongo.Error
  // Error... from mongoose
  let error: CustomError = new CustomError(
    (err && err.message) || 'Server Error',
    (err && err.statusCode) || 500,
    err
  )

  if (err instanceof Error) {
    if (!(err instanceof CustomError)) {
      let message: string, messageArray: string[]
      // Mongoose Error
      if (err instanceof MongooseError.CastError) {
        message = 'Resource not found'
        error = new CustomError(message, 404, err)
      }
      if (err instanceof MongooseError.ValidationError) {
        message = 'Invalid data provided'
        messageArray = Object.values(err.errors).map((val) => val.message)
        error = new CustomError(message, 400, err, messageArray)
      }
      if (err instanceof mongo.MongoError) {
        error = new MongoError('', err)
      }
    } else {
      console.log(err.message)
      console.error(err)
      error = err
    }
  } else {
    console.error(`Unknown thing with type ${typeof err} thrown: `)
    console.error(err)
  }
  // console.log(serializeError(error))
  return res
    .status(error.statusCode)
    .set('Content-Type', 'application/json')
    .send(error)
}
export { errorHandler }
