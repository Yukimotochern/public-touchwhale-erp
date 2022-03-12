import { JSONSchemaType, ValidateFunction } from 'ajv'
import ajv from '../utils/ajv'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import ErrorResponse from '../utils/errorResponse'
import { ResBody, ResBodyWithOutData } from './apiTypes'

export class HandlerIO {
  // Request
  static bodyValidatorCreator<BodyType>(schema: JSONSchemaType<BodyType>) {
    return ajv.compile(schema)
  }
  // Response
  // default data sender
  static send(
    res: Response,
    statusCode: number = 200,
    extra: ResBodyWithOutData = {}
  ) {
    res.status(statusCode).json(extra)
  }

  // customized data sender
  static sendDataCreator<DataType>(schema: JSONSchemaType<DataType>) {
    const validator = ajv.compile(schema)
    return function (
      res: Response,
      data: DataType,
      extra: ResBodyWithOutData = {},
      statusCode: number = 200
    ) {
      const resBody: ResBody = {
        data,
        ...extra,
      }

      if (process.env.NODE_ENV === 'development') {
        if (resBodyValidator(resBody)) {
          // JSON.parce(JSON.stringfy(data)) is problematic for performance and will not be performed in production environment
          let clientObtainedThing = JSON.parse(JSON.stringify(data))
          if (!validator(clientObtainedThing)) {
            console.log(clientObtainedThing)
            console.log(validator.errors)
            throw new ErrorResponse('Unexpected response body from server.')
          }
        } else {
          throw new ErrorResponse('Unexpected response from server.')
        }
      }
      return res.status(statusCode).json(resBody)
    }
  }

  // response validator
  static checkResponseWithDataCreator<DataType>(
    validator: ValidateFunction<DataType>
  ) {
    return function (body: any): body is ResBody<DataType> {
      return resBodyValidator(body) && validator(body.data)
    }
  }
}

// only for type check purpose, since any type in 'data' field is not representable by JSONSchemaType
export const bodyWithOutDataJSONSchemaType: JSONSchemaType<ResBodyWithOutData> =
  {
    type: 'object',
    properties: {
      message: { type: 'string', nullable: true },
      // if any thing should be added here, do add it in resBodyValidator (below) !!!!!
    },
    additionalProperties: false,
  }

// general response body json validator
export const resBodyValidator = ajv.compile<ResBody>({
  type: 'object',
  properties: {
    message: { type: 'string', nullable: true },
    data: {},
  },
  additionalProperties: false,
})
