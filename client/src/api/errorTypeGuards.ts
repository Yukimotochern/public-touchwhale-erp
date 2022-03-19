import CustomError from '@backend/utils/CustomError'

export function isError(err: any): err is Error {
  return !!err && err instanceof Error && err.constructor !== CustomError
}

// eslint-disable-next-line
export function isCustomError(err: any): err is CustomError {
  return !!err && err.constructor === CustomError
}

// eslint-disable-next-line
export function isDOMException(err: any): err is DOMException {
  return !!err && err.constructor === DOMException
}

// eslint-disable-next-line
export function isString(x: any): x is string {
  return typeof x === 'string' && x.length > 0
}
