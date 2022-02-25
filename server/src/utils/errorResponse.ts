import { DefinedError } from 'ajv'
import { Error as mgError } from 'mongoose'
export default class ErrorResponse extends Error {
  public name: 'CustomError' = 'CustomError'
  constructor(
    msg: string = 'Unspecified Error Message',
    public statusCode: number = 500,
    public errorData?: any,
    public messageArray?: string[]
  ) {
    super(msg)
    // Object.setPrototypeOf(this, ErrorResponse.prototype)
  }
}

export type MongooseErrors =
  | mgError.CastError
  | mgError.DisconnectedError
  | mgError.DivergentArrayError
  | mgError.DocumentNotFoundError
  | mgError.MissingSchemaError
  | mgError.MongooseServerSelectionError
  | mgError.ObjectExpectedError
  | mgError.ObjectParameterError
  | mgError.OverwriteModelError
  | mgError.ParallelSaveError
  | mgError.ParallelValidateError
  | mgError.StrictModeError
  | mgError.SyncIndexesError
  | mgError.ValidationError
  | mgError.ValidatorError
  | mgError.VersionError
export type TWError = MongooseErrors | ErrorResponse // possible adding other errors with name