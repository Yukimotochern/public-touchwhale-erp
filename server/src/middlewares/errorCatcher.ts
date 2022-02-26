import { RequestHandler } from 'express'
import { PrivateRequestHandler } from './authMiddleware'

type GeneralHandler = RequestHandler | PrivateRequestHandler

const asyncHandler: (fn: GeneralHandler) => RequestHandler =
  (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }

export default asyncHandler
