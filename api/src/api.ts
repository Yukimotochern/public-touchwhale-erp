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
import { deserializeError } from 'serialize-error'
import { NavigateFunction } from 'react-router'

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
  public onUnAuthoried?: Function = undefined
  public onNetworkError?: Function = undefined
  public onUnknownError?: Function = undefined

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
  /**
   * * Server Things
   * TODO: 1. send
   * TODO: 2. sendData
   */
  /**
   * * Client Things
   */
  _reject = (rejectedError: any) =>
    new ApiPromise<ResponseDataType>((resolve, reject) => reject(rejectedError))
  _resolve = (data: ResponseDataType) =>
    new ApiPromise<ResponseDataType>((resolve, reject) => resolve(data))

  async request(
    url: string,
    method: Method,
    data: ReqestBodyType | undefined,
    abortController?: AbortController,
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
        Required<ResponseBody<ResponseDataType>>,
        AxiosResponse<Required<ResponseBody<ResponseDataType>>>,
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
      return this._resolve(res.data.data)
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
    if (err instanceof AjvErrors) {
      // validate problem
      console.log('Ajv errors:')
      console.log(err.message)
      console.log('with the following fields,')
      console.log(err.ajvError)
    } else if (axios.isAxiosError(err)) {
      // server error
      if (err.response?.data) {
        if (err.response.status === 401) {
          /**
           * Unauthorized, redirect if possible
           * Also, cancel the request.
           */
          if (this.onUnAuthoried) {
            this.onUnAuthoried()
          }
          innerError.thrown = new axios.Cancel('Unauthorized.')
          return innerError
        } else {
          // deserialize error if possible
          const deserializedError = deserializeError(err.response.data)
          err = err.response.data
          innerError.deserializedError = deserializedError

          // mongoose error
          // mongoDB error
          // custom error from server
          console.log('The following error thrown from server,')
          console.error(deserializedError)
          console.log('with the following data,')
          console.log(err.response.data)
          console.log(
            `Your may catch it by name of ${deserializedError.name} and message of ${deserializedError.message}.`
          )
        }
      } else {
        // some intrinsic error
        if (err instanceof Error && err.message === 'Network Error') {
          // nework problem
          if (this.onNetworkError) {
            this.onNetworkError()
          }
        } else {
          // unexpected error
          if (this.onUnknownError) {
            this.onUnknownError()
          }
          console.log(
            'Receive error from axios but without any response data. This might be some unexpected server internal error or axios error.'
          )
          console.log(err)
          console.error(err)
          console.log(`with typeof ${typeof err}.`)
          console.log(`Isinstance of Error: ${err instanceof Error}.`)
          console.log(
            `Isinstance of CustomError: ${err instanceof CustomError}.`
          )
        }
      }
    } else if (err instanceof axios.Cancel) {
      // cancel error
      console.log('Api call canceled.')
    } else {
      // Unknown Problem
      console.log(
        'Unknown error of thing thrown, which is neither ajv error nor axios error,'
      )
      console.log(err)
      console.error(err)
      console.log(`with typeof ${typeof err}.`)
      console.log(`Isinstance of Error: ${err instanceof Error}.`)
      console.log(`Isinstance of CustomError: ${err instanceof CustomError}.`)
      if (this.onUnknownError) {
        this.onUnknownError()
      }
    }
    innerError.thrown = err

    return innerError
  }

  // The belows are merely sugar, they may be SWEET~
  async get(
    url: string,
    abortController?: AbortController,
    cof: AxiosRequestConfig = {}
  ) {
    return this.request(url, 'GET', undefined, abortController, cof)
  }

  async post(
    url: string,
    data: ReqestBodyType,
    abortController?: AbortController,
    cof: AxiosRequestConfig = {}
  ) {
    return this.request(url, 'POST', data, abortController, cof)
  }

  async put(
    url: string,
    data: ReqestBodyType,
    abortController?: AbortController,
    cof: AxiosRequestConfig = {}
  ) {
    return this.request(url, 'PUT', data, abortController, cof)
  }

  async delete(
    url: string,
    data: ReqestBodyType | undefined,
    abortController?: AbortController,
    cof: AxiosRequestConfig = {}
  ) {
    return this.request(url, 'DELETE', data, abortController, cof)
  }
}

export { api }
