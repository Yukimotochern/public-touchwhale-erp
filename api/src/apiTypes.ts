import { JSONSchemaType } from 'ajv'
import { NextFunction, Request, Response } from 'express'
import { Send } from 'express-serve-static-core'
import CustomError from './utils/CustomError'

// * Response Types

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

export interface TypedAndCheckedResponse<ResponseBodyDataType>
  extends Response<ResponseBody<ResponseBodyDataType>> {
  send: Send<ResponseBody<ResponseBodyDataType>, this>
}

// * Request Types

export interface AuthJWT {
  id: string
  iat: number
  exp: number
  isOwner: boolean
  owner: string
}

export interface TypedPrivateRequest<RequestBodyType>
  extends Request<{}, any, RequestBodyType> {
  user: AuthJWT
}

export interface TypedRequest<RequestBodyType>
  extends Request<{}, any, RequestBodyType> {}

export interface NextWithCustomError extends NextFunction {
  (...err: ConstructorParameters<typeof CustomError>): void
}

// * Private
export type TypedPrivateRequestHandler<RequestBodyType, ResponseBodyDataType> =
  | ((
      req: TypedPrivateRequest<RequestBodyType>,
      res: Response<ResponseBody<ResponseBodyDataType>>,
      next: NextWithCustomError
    ) => void)
  | ((
      req: TypedPrivateRequest<RequestBodyType>,
      res: Response<ResponseBody<ResponseBodyDataType>>,
      next: NextWithCustomError
    ) => Promise<any>)

// * Non-Private
export type TypedRequestHandler<RequestBodyType, ResponseBodyDataType> =
  | ((
      req: TypedRequest<RequestBodyType>,
      res: Response<ResponseBody<ResponseBodyDataType>>,
      next: NextWithCustomError
    ) => void)
  | ((
      req: TypedRequest<RequestBodyType>,
      res: Response<ResponseBody<ResponseBodyDataType>>,
      next: NextWithCustomError
    ) => Promise<any>)
