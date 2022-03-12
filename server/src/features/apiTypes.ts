import { Request, Response, NextFunction, RequestHandler } from 'express'
import ajv from '../utils/ajv'
import { JSONSchemaType, ValidateFunction } from 'ajv'
import ErrorResponse from '../utils/errorResponse'

export interface ResBody<ResBodyDataType = any> {
  data?: ResBodyDataType | undefined
  message?: string
}

export interface ApiRes<ResBodyDataType = any>
  extends Response<ResBody<ResBodyDataType>> {}

export interface ResBodyWithOutData extends Omit<ResBody, 'data'> {}
