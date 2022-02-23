import Ajv from 'ajv'
import addFormat from 'ajv-formats'

export const ajvInstance = new Ajv({ allErrors: true })
addFormat(ajvInstance)

export default ajvInstance
