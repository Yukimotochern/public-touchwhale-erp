import { JSONSchemaType, ValidateFunction } from 'ajv'
import ajv from '../utils/ajv'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import CustomError from '../utils/CustomError'
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
      // do some computationally intensive checks in development mode
      if (process.env.NODE_ENV === 'development') {
        if (resBodyValidator(resBody)) {
          // JSON.parce(JSON.stringfy(data)) is problematic for performance and will not be performed in production environment
          let clientObtainedThing = JSON.parse(JSON.stringify(data))

          // check owner
          type objectWithOwner = { owner: string }
          let ArrayWithOwner: objectWithOwner[] = []
          const isObjectWithOwner = (x: any): x is objectWithOwner =>
            typeof x === 'object' && typeof x.owner === 'string'
          const isArrayWithOwner = (x: any[]): x is objectWithOwner[] =>
            x.every(isObjectWithOwner)

          if (isObjectWithOwner(clientObtainedThing)) {
            ArrayWithOwner.push(clientObtainedThing)
          } else if (
            Array.isArray(clientObtainedThing) &&
            isArrayWithOwner(clientObtainedThing)
          ) {
            ArrayWithOwner = ArrayWithOwner.concat(clientObtainedThing)
          }
          if (ArrayWithOwner.length !== 0) {
            if (!ArrayWithOwner.every((item) => item.owner === res.owner)) {
              return new CustomError(
                'Controller has returned something that is not owned by this user or the owner of this user.'
              )
            }
          }

          // check with provided validator
          if (!validator(clientObtainedThing)) {
            console.log(`Here's what client obtained: `)
            console.log(clientObtainedThing)
            console.log(`with the following errors:`)
            console.log(validator.errors)
            throw new CustomError('Unexpected response body from server.')
          }
        } else {
          throw new CustomError('Unexpected response from server.')
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

// general response body json validator
export const resBodyValidator = ajv.compile<ResBody>({
  type: 'object',
  properties: {
    message: { type: 'string', nullable: true },
    data: {},
  },
  additionalProperties: false,
})
