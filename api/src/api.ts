import {
  ResponseBody,
  responseBodyWithAnyDataJSONSchema,
  ResponseBodyWithOutData,
  TypedPrivateRequestHandler,
  TypedPrivateRequest,
  NextWithCustomError,
} from './apiTypes'
import { Send } from 'express-serve-static-core'
import { ValidateFunction, JSONSchemaType, DefinedError, AnySchema } from 'ajv'
import { AnyValidateFunction } from 'ajv/dist/types/index'
import ajv, { avjErrorWrapper } from './utils/ajv'
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { ApiPromise } from './utils/ApiPromise'
import CustomError, {
  AjvErrors,
  ApiErrorDealtInternallyAndThrown,
} from './utils/CustomError'
import { deserializeError } from 'serialize-error'
import { Request, NextFunction, RequestHandler, Response } from 'express'

let config: AxiosRequestConfig = {
  timeout: process.env.REACT_APP_API_TIMEOUT
    ? +process.env.REACT_APP_API_TIMEOUT
    : 999999999,
  baseURL: process.env.REACT_APP_URL || 'https://touchwhale-erp.com',
  headers: { 'content-type': 'application/json' },
}

interface SchemaOption<RequestBodyType, ResponseDataType> {
  bodySchema: JSONSchemaType<RequestBodyType>
  dataSchema: JSONSchemaType<ResponseDataType>
}

export default class api<RequestBodyType, ResponseDataType> {
  public bodyValidator: ValidateFunction<RequestBodyType>
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
  }: Partial<SchemaOption<RequestBodyType, ResponseDataType>> = {}) {
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

  setDataValidator(dataSchema: AnySchema) {
    this.dataValidator = ajv.compile<ResponseDataType>(dataSchema)
    this.resValidator = ajv.compile<ResponseBody<ResponseDataType>>({
      type: 'object',
      properties: {
        message: { type: 'string', nullable: true },
        data: dataSchema,
      },
      additionalProperties: false,
    })
    return this
  }

  /**
   * * Server Things
   */
  send(
    res: Response,
    statusCode: number = 200,
    extra: ResponseBodyWithOutData = {}
  ) {
    return res.status(statusCode).json(extra)
  }

  sendData(
    res: Response,
    data: ResponseDataType,
    extra: ResponseBodyWithOutData = {},
    statusCode: number = 200
  ) {
    const resBody: ResponseBody = {
      data,
      ...extra,
    }
    // do some computationally intensive checks in development mode
    if (process.env.NODE_ENV === 'development') {
      if (this.resWithAnyDataValidator(resBody)) {
        // JSON.parce(JSON.stringfy(data)) is problematic for performance and will not be performed in production environment
        let clientObtainedThing = JSON.parse(JSON.stringify(data))

        // check owner
        const isObjectOwnByOther = (x: any): boolean =>
          !!x &&
          typeof x === 'object' &&
          typeof x.owner === 'string' &&
          x.owner !== String(res.owner)
        const hasNestedObjectOwnByOthers = (ob: any): boolean => {
          if (!!ob && typeof ob === 'object' && !Array.isArray(ob)) {
            if (isObjectOwnByOther(ob)) {
              console.log(
                'The following object is owned by others. Please check your code.'
              )
              return true
            } else {
              return Object.entries(ob).some(([name, value]) =>
                hasNestedObjectOwnByOthers(value)
              )
            }
          } else if (Array.isArray(ob)) {
            return ob.some((inner) => hasNestedObjectOwnByOthers(inner))
          } else {
            return false
          }
        }
        // * next line will be imaginably extremly slow ...
        if (hasNestedObjectOwnByOthers(clientObtainedThing)) {
          return new CustomError(
            'Controller has returned something that is not owned by this user or the owner of this user.'
          )
        }

        // check with provided validator
        if (!this.dataValidator(clientObtainedThing)) {
          console.log(`Here's what client obtained: `)
          console.log(clientObtainedThing)
          console.log(`with the following errors:`)
          console.log(this.dataValidator.errors)
          throw new CustomError('Unexpected response body from server.')
        }
      } else {
        throw new CustomError('Unexpected response from server.')
      }
    }
    return res.status(statusCode).json(resBody)
  }

  createPrivateController(
    typedController: TypedPrivateRequestHandler<
      RequestBodyType,
      ResponseDataType
    >
  ): RequestHandler[] {
    return [
      // authMiddleware,
      (req, res: Response<ResponseBody<ResponseDataType>>, next) => {
        /**
         * * 1. make sure req.user is there
         * * 2. make sure the type of req.body is correct
         * * 3. attach modified res.json, res.send, res.sendData, next to:
         *     * make sure the response object is validate
         *     * make sure object owned by others is not sent accidentally
         * * 4. call the typedController
         */

        // * enhanced next
        const nextCustom: NextWithCustomError = (
          ...err: ConstructorParameters<typeof CustomError>
        ) => {
          next(new CustomError(...err))
        }

        // * make sure req.user is there
        const hasUser = (
          req: Request<{}, any, RequestBodyType>
        ): req is TypedPrivateRequest<any> => !!req.user
        if (!hasUser(req)) {
          return nextCustom('Token is invalid.', 401)
        }

        // * make sure the type of req.body is correct
        const hasBodyOfCorrectType = (
          req: TypedPrivateRequest<any>
        ): req is TypedPrivateRequest<RequestBodyType> =>
          this.bodyValidator(req.body)
        if (!hasBodyOfCorrectType(req)) {
          return next(avjErrorWrapper(this.bodyValidator.errors))
        }

        // * create modified res.json, res.send
        const originalSend = res.send
        const originalJson = res.json
        const checkOwner = (data: ResponseDataType) => {
          // JSON.parce(JSON.stringfy(data)) is problematic for performance and will not be performed in production environment
          let clientObtainedThing = JSON.parse(JSON.stringify(data))
          const isObjectOwnByOther = (x: any): boolean =>
            !!x &&
            typeof x === 'object' &&
            typeof x.owner === 'string' &&
            x.owner !== String(req.user.owner)
          const hasNestedObjectOwnByOthers = (ob: any): boolean => {
            if (!!ob && typeof ob === 'object' && !Array.isArray(ob)) {
              if (isObjectOwnByOther(ob)) {
                console.log(
                  'The following object is owned by others. Please check your code.'
                )
                return true
              } else {
                return Object.entries(ob).some(([name, value]) =>
                  hasNestedObjectOwnByOthers(value)
                )
              }
            } else if (Array.isArray(ob)) {
              return ob.some((inner) => hasNestedObjectOwnByOthers(inner))
            } else {
              return false
            }
          }
          // * next line will be imaginably extremly slow ...
          if (hasNestedObjectOwnByOthers(clientObtainedThing)) {
            return next(
              new CustomError(
                'Controller has returned something that is not owned by this user or the owner of this user.'
              )
            )
          }
        }
        const api = this

        // function  (resBody?: ResponseBody<ResponseDataType>) {
        //   if (api.resWithAnyDataValidator(resBody)) {
        //   } else {
        //   }
        //   return this
        // }
        // const enhancedSend: Send<ResponseBody<ResponseDataType>, Response<ResponseBody<ResponseDataType>, Record<string, any>>> = function (resBody?: ResponseBody<ResponseDataType>) {
        //   return this
        // }
        // const enhancedSendData: Send<ResponseDataType, this> = (
        //   data?: ResponseDataType,
        //   extra: ResponseBodyWithOutData = {}
        // ) => {
        //   return this
        // }
        // const enhancedJson: Send<ResponseBody<ResponseDataType>, this> = (
        //   response?: ResponseBody<ResponseDataType>
        // ) => {
        //   return this
        // }
        // // * attach modified res.json, res.send
        // res.send = enhancedSend

        // * send the response with typedController
        typedController(req, res, next)
      },
    ]
  }

  /**
   * * Client Things
   */
  request = (
    url: string,
    method: Method,
    data: RequestBodyType | undefined,
    abortController?: AbortController,
    cof: AxiosRequestConfig<RequestBodyType> = {}
  ) =>
    new ApiPromise<ResponseDataType>((resolve, reject) => {
      const processAndReject = (err: any) => {
        let innerError = new ApiErrorDealtInternallyAndThrown(err)
        innerError = this.errorProcessor(innerError)
        reject(innerError)
      }
      // validate request body data under developent mode
      if (process.env.NODE_ENV === 'development') {
        if (!this.bodyValidator(data)) {
          console.log('Unexpected thing about to sent:')
          console.log(data)
          processAndReject(
            new AjvErrors(
              'Invalid request body sent.',
              this.bodyValidator.errors as DefinedError[],
              400
            )
          )
        }
      }
      // make the actural request
      axios
        .request<
          Required<ResponseBody<ResponseDataType>>,
          AxiosResponse<Required<ResponseBody<ResponseDataType>>>,
          RequestBodyType
        >({
          url: `/api/v${process.env.REACT_APP_API_VERSION || 1}${url}`,
          method,
          data,
          ...config,
          ...cof,
          signal: abortController?.signal || undefined,
        })
        .then((res) => {
          // validate response data
          if (!this.resValidator(res.data)) {
            console.log('Unexpected thing got:')
            console.log(res.data)
            processAndReject(
              new AjvErrors(
                'Invalid response from server received.',
                this.resValidator.errors as DefinedError[],
                500
              )
            )
          } else {
            resolve(res.data.data)
          }
        })
        .catch(processAndReject)
    })

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
        const deserializedError = deserializeError(err.response.data)
        innerError.customError = err.response.data
        innerError.deserializedError = deserializedError
        if (err.response.status === 401) {
          /**
           * Unauthorized, redirect if possible
           * Also, cancel the request.
           */
          if (this.onUnAuthoried) {
            this.onUnAuthoried()
          }
        } else {
          // deserialize error if possible
          /**
           * ! Uncomment the below to catch custom error
           */
          // console.log('The following error thrown from server,')
          // console.error(deserializedError)
          // console.log('with the following data,')
          // console.log(err.response.data)
          // console.log(
          //   `Your may catch it by name of ${deserializedError.name} and message of ${deserializedError.message}.`
          // )
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
  get = (
    url: string,
    abortController?: AbortController,
    cof: AxiosRequestConfig = {}
  ) => this.request(url, 'GET', undefined, abortController, cof)

  post = (
    url: string,
    data: RequestBodyType,
    abortController?: AbortController,
    cof: AxiosRequestConfig = {}
  ) => this.request(url, 'POST', data, abortController, cof)

  put = (
    url: string,
    data: RequestBodyType,
    abortController?: AbortController,
    cof: AxiosRequestConfig = {}
  ) => this.request(url, 'PUT', data, abortController, cof)

  delete = (
    url: string,
    data: RequestBodyType | undefined,
    abortController?: AbortController,
    cof: AxiosRequestConfig = {}
  ) => this.request(url, 'DELETE', data, abortController, cof)
}

export { api }
