import { JSONSchemaType } from 'ajv'

export interface TwApiRes {
  success?: boolean
}

export const twApiSchema: JSONSchemaType<TwApiRes> = {
  type: 'object',
  properties: {
    success: { type: 'boolean', nullable: true },
    // and other thing like error
  },
  additionalProperties: true,
}
