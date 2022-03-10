import { Response } from 'express'
import { ResBody } from '../types/CustomExpressTypes'
import ajv from './ajv'
import { JSONSchemaType } from 'ajv'
import ErrorResponse from './errorResponse'

export interface ResBodyWithOutData extends Omit<ResBody, 'data'> {}

// send data function creator
export function sendDataCreator<DataType>(
  validator?: (data: any) => data is DataType
) {
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
        if (validator) {
          if (!validator(data)) {
            throw new ErrorResponse('Unexpected response body from server.')
          }
        }
      } else {
        throw new ErrorResponse('Unexpected response from server.')
      }
    }
    return res.status(statusCode).json(resBody)
  }
}

export function send(
  res: Response,
  statusCode: number = 200,
  extra: ResBodyWithOutData = {}
) {
  res.status(statusCode).json(extra)
}

// response validator
export function checkResponseWithDataCreator<DataType>(
  validator: (data: any) => data is DataType
) {
  return function (body: any): body is ResBody<DataType> {
    return resBodyValidator(body) && validator(body.data)
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
