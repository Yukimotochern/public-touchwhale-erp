import Ajv from 'ajv'
import addFormat from 'ajv-formats'

export const ajv = new Ajv({ allErrors: true })
addFormat(ajv)

export default ajv
