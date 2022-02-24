import Ajv, { ErrorObject, DefinedError } from 'ajv'
import addFormat from 'ajv-formats'
import ErrorResponse from './errorResponse'

export const ajvInstance = new Ajv({ allErrors: true })
addFormat(ajvInstance)

const avjErrorWrapper = (
  err: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined
) => new ErrorResponse('Invalid data provided', 400, err as DefinedError[])

export { avjErrorWrapper }

export default ajvInstance
