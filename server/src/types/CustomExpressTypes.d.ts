import { Response } from 'express'

export interface ResBody<DataType = any> {
  data?: DataType
  message?: string
}

export interface Response<DataType = any> extends Response<ResBody<DataType>> {}
