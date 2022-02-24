import { DefinedError } from 'ajv'
import { Error as mgError } from 'mongoose'
export default class ErrorResponse extends Error {
  name: 'CustomError'
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errorData?: TWError | DefinedError[],
    public messageArray?: string[]
  ) {
    super(message)
    this.name = 'CustomError'
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
