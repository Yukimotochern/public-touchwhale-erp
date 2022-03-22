import { JSONSchemaType } from 'ajv'

export interface ResponseBody<ResponseBodyDataType = any> {
  data?: ResponseBodyDataType
  message?: string
}

export interface ResponseBodyWithOutData extends Omit<ResponseBody, 'data'> {}

/**
 * only for type check purpose,
 * since any type in 'data' field is not representable by JSONSchemaType
 */
export const responeBodyWithOutDataJSONSchema: JSONSchemaType<ResponseBodyWithOutData> =
  {
    type: 'object',
    properties: {
      message: { type: 'string', nullable: true },
      /**
       * ! if any thing should be added here for type safe,
       * ! do add it in responseBodyWithAnyDataSchema (below) !
       */
    },
    additionalProperties: false,
  }

export const responseBodyWithAnyDataJSONSchema = {
  type: 'object',
  properties: {
    message: { type: 'string', nullable: true },
    data: {},
  },
  additionalProperties: false,
} as const
