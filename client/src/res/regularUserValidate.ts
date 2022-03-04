import { JSONSchemaType } from 'ajv'
import ajv from '../utils/ajv'

export interface IRegularUserRes {
  email: string
  avatar?: string
  company_name?: string
  username?: string
  createdAt?: string
  updatedAt?: string
  provider: 'TouchWhale' | 'Google'
}
const RegularUserResSchema: JSONSchemaType<IRegularUserRes> = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    avatar: { type: 'string', nullable: true },
    company_name: { type: 'string', nullable: true },
    username: { type: 'string', nullable: true },
    updatedAt: { type: 'string', nullable: true },
    createdAt: { type: 'string', nullable: true },
    provider: { type: 'string', enum: ['Google', 'TouchWhale'] },
  },
  required: ['email'],
  additionalProperties: true,
}

const getRegularUserResValidator = ajv.compile(RegularUserResSchema)

export { getRegularUserResValidator }
