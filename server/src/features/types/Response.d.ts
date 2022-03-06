import { Response } from 'express'

interface SuccessResponse<DataType = any> extends Response {
  data?: DataType
  msg?: string
}
