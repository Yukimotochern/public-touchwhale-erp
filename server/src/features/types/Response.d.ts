import { Response } from 'express'

export interface SuccessResponseBody<DataType> {
  data?: DataType
  message?: string
}

export interface SuccessResponse<DataType = any>
  extends Response<SuccessResponseBody<DataType>> {}
