import Ajv, { ErrorObject, DefinedError } from 'ajv'
import CustomError from './CustomError'
import addFormat from 'ajv-formats'

export const ajv = new Ajv({ allErrors: true })
addFormat(ajv)

const avjErrorWrapper = (
  err: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined
) => new CustomError('Invalid data provided', 400, err as DefinedError[])

export { avjErrorWrapper }

export default ajv
