import { ApiErrorDealtInternallyAndThrown } from './CustomError'

export function isErrorButApiError(err: any): err is Error {
  return (
    !(err instanceof ApiErrorDealtInternallyAndThrown) && err instanceof Error
  )
}

export const notApiError = (err: any) =>
  !(err instanceof ApiErrorDealtInternallyAndThrown)
