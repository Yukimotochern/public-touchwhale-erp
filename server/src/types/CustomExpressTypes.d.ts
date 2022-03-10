import { Response } from 'express'

export interface ResBody<ResponseBodyDataType = any> {
  data?: ResponseBodyType | undefined
  message?: string
}

export interface SuccessResponse<ResponseBodyDataType = any>
  extends Response<ResBody<DataType>> {}
