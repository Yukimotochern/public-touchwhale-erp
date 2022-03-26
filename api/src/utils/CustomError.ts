import { DefinedError } from 'ajv'

export default class CustomError extends Error {
  public name = 'CustomError'
  constructor(
    public message: string = 'Unspecified Error Message',
    public statusCode: number = 500,
    public errorData?: any
  ) {
    super(message)
    // restore prototype chain
    this.name = new.target.name
    if (typeof (Error as any).captureStackTrace === 'function') {
      ;(Error as any).captureStackTrace(this, new.target)
    }
    if (typeof Object.setPrototypeOf === 'function') {
      Object.setPrototypeOf(this, new.target.prototype)
    } else {
      ;(this as any).__proto__ = new.target.prototype
    }
  }
}

export interface serializedCustomError {
  name: 'CustomError'
  message: string
  statusCode: number
  errorData?: any
}

/**
 * Typed wrapper for known errors
 * Copied from mongoose, :)
 */
type GenericMongooseError =
  | IMongooseError.CastError
  | IMongooseError.DisconnectedError
  | IMongooseError.DivergentArrayError
  | IMongooseError.DocumentNotFoundError
  | IMongooseError.MissingSchemaError
  | IMongooseError.MongooseServerSelectionError
  | IMongooseError.ObjectExpectedError
  | IMongooseError.ObjectParameterError
  | IMongooseError.OverwriteModelError
  | IMongooseError.ParallelSaveError
  | IMongooseError.ParallelValidateError
  | IMongooseError.StrictModeError
  | IMongooseError.SyncIndexesError
  | IMongooseError.ValidationError
  | IMongooseError.ValidatorError
  | IMongooseError.VersionError

export class MongooseError extends CustomError {
  public name = 'MongooseError'
  constructor(
    msg: string,
    public mongooseError: GenericMongooseError,
    statusCode: number = 500
  ) {
    super(msg, statusCode)
  }
}

export class MongoError extends CustomError {
  public name = 'MongoError'
  constructor(
    msg: string,
    public mongoError: IMongoError.MongoError,
    statusCode: number = 500
  ) {
    super(msg, statusCode)
  }
}

export class AjvErrors extends CustomError {
  public name = 'AjvError'
  constructor(
    msg: string,
    public ajvError: DefinedError[],
    statusCode: number = 500
  ) {
    super(msg, statusCode)
  }
}

export class ApiErrorDealtInternallyAndThrown extends CustomError {
  public name = 'ApiErrorDealtInternallyAndThrown'
  public deserializedError?: Error
  public customError?: serializedCustomError
  public catched: boolean = false
  constructor(public thrown: any, public statusCode: number = 500) {
    super('DO NOT CATCH THIS ERROR OUTSIDE CUSTOM API PROMISE!', statusCode)
  }
}

/**
 * Copy from mongoose
 */
export namespace IMongoError {
  export interface MongoError extends Error {
    code?: number | string
    get name(): string
    get errmsg(): string
    hasErrorLabel(label: string): boolean
    addErrorLabel(label: string): void
    get errorLabels(): string[]
  }

  export interface MongoServerError extends MongoError {
    codeName?: string
    writeConcernError?: Document
    errInfo?: Document
    ok?: number
    [key: string]: any
    get name(): string
  }
}

export namespace IMongooseError {
  export interface CastError extends Error {
    name: 'CastError'
    stringValue: string
    kind: string
    value: any
    path: string
    reason?: Error | null
    model?: any
  }
  export interface SyncIndexesError extends Error {
    name: 'SyncIndexesError'
    errors?: Record<string, IMongoError.MongoServerError>
  }

  export interface DisconnectedError extends Error {
    name: 'DisconnectedError'
  }

  export interface DivergentArrayError extends Error {
    name: 'DivergentArrayError'
  }

  export interface MissingSchemaError extends Error {
    name: 'MissingSchemaError'
  }

  export interface DocumentNotFoundError extends Error {
    name: 'DocumentNotFoundError'
    result: any
    numAffected: number
    filter: any
    query: any
  }

  export interface ObjectExpectedError extends Error {
    name: 'ObjectExpectedError'
    path: string
  }

  export interface ObjectParameterError extends Error {
    name: 'ObjectParameterError'
  }

  export interface OverwriteModelError extends Error {
    name: 'OverwriteModelError'
  }

  export interface ParallelSaveError extends Error {
    name: 'ParallelSaveError'
  }

  export interface ParallelValidateError extends Error {
    name: 'ParallelValidateError'
  }

  export interface MongooseServerSelectionError extends Error {
    name: 'MongooseServerSelectionError'
  }

  export interface StrictModeError extends Error {
    name: 'StrictModeError'
    isImmutableError: boolean
    path: string
  }

  export interface ValidationError extends Error {
    name: 'ValidationError'

    errors: { [path: string]: ValidatorError | CastError | ValidationError }
    addError: (
      path: string,
      error: ValidatorError | CastError | ValidationError
    ) => void
  }

  export interface ValidatorError extends Error {
    name: 'ValidatorError'
    properties: {
      message: string
      type?: string
      path?: string
      value?: any
      reason?: any
    }
    kind: string
    path: string
    value: any
    reason?: Error | null
  }

  export interface VersionError extends Error {
    name: 'VersionError'
    version: number
    modifiedPaths: Array<string>
  }
}
