import { JSONSchemaType } from 'ajv'
import ajv from '../utils/ajv'

export interface IRegularUserRes {
  email: string
  avatar?: string
  company_name?: string
}
const RegularUserResSchema: JSONSchemaType<IRegularUserRes> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    avatar: { type: 'string', nullable: true },
    company_name: { type: 'string', nullable: true },
  },
  required: ['email'],
  additionalProperties: true,
}

const getRegularUserResValidator = ajv.compile(RegularUserResSchema)

export { getRegularUserResValidator }
