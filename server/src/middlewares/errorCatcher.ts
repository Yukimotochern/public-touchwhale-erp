import { RequestHandler } from 'express'

const asyncHandler: (fn: RequestHandler) => RequestHandler =
  (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next)
  }

export default asyncHandler
