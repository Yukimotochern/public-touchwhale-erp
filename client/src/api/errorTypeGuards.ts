import ErrorResponse from '@backend/utils/errorResponse'

export function isError(err: any): err is Error {
  return !!err && err instanceof Error && err.constructor !== ErrorResponse
}

// eslint-disable-next-line
export function isCustomError(err: any): err is ErrorResponse {
  return !!err && err.constructor === ErrorResponse
}

// eslint-disable-next-line
export function isDOMException(err: any): err is DOMException {
  return !!err && err.constructor === DOMException
}

// eslint-disable-next-line
export function isString(x: any): x is string {
  return typeof x === 'string' && x.length > 0
}
