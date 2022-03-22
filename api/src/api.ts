import { ResponseBody, responseBodyWithAnyDataJSONSchema } from './apiTypes'
import { ValidateFunction, JSONSchemaType, DefinedError } from 'ajv'
import { AnyValidateFunction } from 'ajv/dist/types/index'
import ajv from './utils/ajv'
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { ApiPromise } from './utils/ApiPromise'
import CustomError, {
  AjvErrors,
  ApiErrorDealtInternallyAndThrown,
} from './utils/CustomError'
import { message } from 'antd'

let config: AxiosRequestConfig = {
  timeout: process.env.REACT_APP_API_TIMEOUT
    ? +process.env.REACT_APP_API_TIMEOUT
    : 999999999,
  baseURL: process.env.REACT_APP_URL || 'https://touchwhale-erp.com',
  headers: { 'content-type': 'application/json' },
}

interface SchemaOption<ReqestBodyType, ResponseDataType> {
  bodySchema: JSONSchemaType<ReqestBodyType>
  dataSchema: JSONSchemaType<ResponseDataType>
}

export default class api<ReqestBodyType, ResponseDataType> {
  public bodyValidator: ValidateFunction<ReqestBodyType>
  public dataValidator: ValidateFunction<ResponseDataType>
  public resWithAnyDataValidator = ajv.compile<ResponseBody>(
    responseBodyWithAnyDataJSONSchema
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
        responseBodyWithAnyDataJSONSchema
      )
    }
  }

  _reject = (rejectedError: any) =>
    new ApiPromise((resolve, reject) => reject(rejectedError))
  _resolve = (data: ResponseDataType | undefined) =>
    new ApiPromise((resolve, reject) => resolve(data))

  async request(
    url: string,
    method: Method,
    data: ReqestBodyType | undefined,
    abortController: AbortController | undefined = undefined,
    cof: AxiosRequestConfig<ReqestBodyType> = {}
  ) {
    try {
      // validate request body data under developent mode
      if (process.env.NODE_ENV === 'development') {
        if (!this.bodyValidator(data)) {
          console.log('Unexpected thing about to sent:')
          console.log(data)
          throw new AjvErrors(
            'Invalid request body sent.',
            this.bodyValidator.errors as DefinedError[],
            400
          )
        }
      }
      // make the actural request
      const res = await axios.request<
        ResponseDataType,
        AxiosResponse<ResponseDataType>,
        ReqestBodyType
      >({
        url: `/api/v${process.env.REACT_APP_API_VERSION || 1}${url}`,
        method,
        data,
        ...config,
        ...cof,
        signal: abortController?.signal || undefined,
      })
      // validate response data
      if (!this.resValidator(res.data)) {
        console.log('Unexpected thing got:')
        console.log(res.data)
        throw new AjvErrors(
          'Invalid response from server received.',
          this.resValidator.errors as DefinedError[],
          500
        )
      }
      return this._resolve(res.data)
    } catch (err) {
      let innerError = new ApiErrorDealtInternallyAndThrown(err)
      innerError = this.errorProcessor(innerError)
      return this._reject(innerError)
    }
  }
  errorProcessor(
    innerError: ApiErrorDealtInternallyAndThrown
  ): ApiErrorDealtInternallyAndThrown {
    let err = innerError.thrown
    console.log(err instanceof Error)
    console.log((err as any).message)
    if (err instanceof AjvErrors) {
      // validate problem
    } else if (axios.isAxiosError(err)) {
      // possibly server error
      if (err.response?.data) {
        // deserialize error if possible
        // mongoose error
        // mongoDB error
        // custom error from server
        console.log('here')
      } else {
        // some intrinsic error
        if (err instanceof Error && err.message === 'Network Error') {
          // nework problem
          message.error('Please check your net work connection.')
        } else {
          // unexpected error
          message.error('Something seems to go wrong')
        }
      }
    } else if (err instanceof axios.Cancel) {
      // cancel error
    } else {
      // Unknown Problem
    }
    innerError.thrown = err
    return innerError
  }

  // Belows are merely sugar, they may be SWEET~
  async get(
    url: string,
    cof: AxiosRequestConfig = {},
    abortController: AbortController | undefined = undefined
  ) {
    return this.request(url, 'GET', undefined, abortController, cof)
  }

  async post(
    url: string,
    data: ReqestBodyType,
    cof: AxiosRequestConfig = {},
    abortController: AbortController | undefined = undefined
  ) {
    return this.request(url, 'POST', data, abortController, cof)
  }

  async put(
    url: string,
    data: ReqestBodyType,
    cof: AxiosRequestConfig = {},
    abortController: AbortController | undefined = undefined
  ) {
    return this.request(url, 'PUT', data, abortController, cof)
  }

  async delete(
    url: string,
    data: ReqestBodyType | undefined,
    cof: AxiosRequestConfig = {},
    abortController: AbortController | undefined = undefined
  ) {
    return this.request(url, 'DELETE', data, abortController, cof)
  }
}

export { api }
