import { ValidateFunction, JSONSchemaType } from 'ajv'
import { AnyValidateFunction } from 'ajv/dist/types/index'
import ajv from '../utils/ajv'
import { ResponseBody, ResponseBodyWithOutData } from './apiTypes'

interface SchemaOption<ReqestBodyType, ResponseDataType> {
  bodySchema: JSONSchemaType<ReqestBodyType>
  dataSchema: JSONSchemaType<ResponseDataType>
}

/**
 * only for type check purpose,
 * since any type in 'data' field is not representable by JSONSchemaType
 */
export const bodyWithOutDataJSONSchemaType: JSONSchemaType<ResponseBodyWithOutData> =
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

const responseBodyWithAnyDataSchema = {
  type: 'object',
  properties: {
    message: { type: 'string', nullable: true },
    data: {},
  },
  additionalProperties: false,
} as const

export class Validator<ReqestBodyType, ResponseDataType> {
  public bodyValidator: ValidateFunction<ReqestBodyType>
  public dataValidator: ValidateFunction<ResponseDataType>
  public resWithAnyDataValidator = ajv.compile<ResponseBody>(
    responseBodyWithAnyDataSchema
  )
  public resValidator: AnyValidateFunction<ResponseBody<ResponseDataType>>
  constructor({
    bodySchema,
    dataSchema,
  }: Partial<SchemaOption<ReqestBodyType, ResponseDataType>>) {
    if (bodySchema) {
      this.bodyValidator = ajv.compile(bodySchema)
    } else {
      this.bodyValidator = ajv.compile({})
    }
    if (dataSchema) {
      this.dataValidator = ajv.compile(dataSchema)
      this.resValidator = ajv.compile<ResponseBody<ResponseDataType>>({
        type: 'object',
        properties: {
          message: { type: 'string', nullable: true },
          data: dataSchema,
        },
        additionalProperties: false,
      })
    } else {
      this.dataValidator = ajv.compile({})
      this.resValidator = ajv.compile<ResponseBody<ResponseDataType>>(
        responseBodyWithAnyDataSchema
      )
    }
  }
}
