import { DefinedError } from 'ajv';
export default class CustomError extends Error {
    message: string;
    statusCode: number;
    errorData?: any;
    messageArray?: string[] | undefined;
    name: string;
    constructor(message?: string, statusCode?: number, errorData?: any, messageArray?: string[] | undefined);
}
/**
 * typed wrapper for known errors
 */
declare type GenericMongooseError = IMongooseError.CastError | IMongooseError.DisconnectedError | IMongooseError.DivergentArrayError | IMongooseError.DocumentNotFoundError | IMongooseError.MissingSchemaError | IMongooseError.MongooseServerSelectionError | IMongooseError.ObjectExpectedError | IMongooseError.ObjectParameterError | IMongooseError.OverwriteModelError | IMongooseError.ParallelSaveError | IMongooseError.ParallelValidateError | IMongooseError.StrictModeError | IMongooseError.SyncIndexesError | IMongooseError.ValidationError | IMongooseError.ValidatorError | IMongooseError.VersionError;
export declare class MongooseError extends CustomError {
    mongooseError: GenericMongooseError;
    name: string;
    constructor(msg: string, mongooseError: GenericMongooseError, statusCode?: number);
}
export declare class MongoError extends CustomError {
    mongoError: IMongoError.MongoError;
    name: string;
    constructor(msg: string, mongoError: IMongoError.MongoError, statusCode?: number);
}
export declare class AjvErrors extends CustomError {
    ajvError: DefinedError[];
    name: string;
    constructor(msg: string, ajvError: DefinedError[], statusCode?: number);
}
export declare class ApiErrorDealtInternallyAndThrown extends CustomError {
    thrown: any;
    name: string;
    constructor(thrown: any, statusCode?: number);
}
/**
 * Copy from mongoose
 */
export declare namespace IMongoError {
    interface MongoError extends Error {
        code?: number | string;
        get name(): string;
        get errmsg(): string;
        hasErrorLabel(label: string): boolean;
        addErrorLabel(label: string): void;
        get errorLabels(): string[];
    }
    interface MongoServerError extends MongoError {
        codeName?: string;
        writeConcernError?: Document;
        errInfo?: Document;
        ok?: number;
        [key: string]: any;
        get name(): string;
    }
}
export declare namespace IMongooseError {
    interface CastError extends Error {
        name: 'CastError';
        stringValue: string;
        kind: string;
        value: any;
        path: string;
        reason?: Error | null;
        model?: any;
    }
    interface SyncIndexesError extends Error {
        name: 'SyncIndexesError';
        errors?: Record<string, IMongoError.MongoServerError>;
    }
    interface DisconnectedError extends Error {
        name: 'DisconnectedError';
    }
    interface DivergentArrayError extends Error {
        name: 'DivergentArrayError';
    }
    interface MissingSchemaError extends Error {
        name: 'MissingSchemaError';
    }
    interface DocumentNotFoundError extends Error {
        name: 'DocumentNotFoundError';
        result: any;
        numAffected: number;
        filter: any;
        query: any;
    }
    interface ObjectExpectedError extends Error {
        name: 'ObjectExpectedError';
        path: string;
    }
    interface ObjectParameterError extends Error {
        name: 'ObjectParameterError';
    }
    interface OverwriteModelError extends Error {
        name: 'OverwriteModelError';
    }
    interface ParallelSaveError extends Error {
        name: 'ParallelSaveError';
    }
    interface ParallelValidateError extends Error {
        name: 'ParallelValidateError';
    }
    interface MongooseServerSelectionError extends Error {
        name: 'MongooseServerSelectionError';
    }
    interface StrictModeError extends Error {
        name: 'StrictModeError';
        isImmutableError: boolean;
        path: string;
    }
    interface ValidationError extends Error {
        name: 'ValidationError';
        errors: {
            [path: string]: ValidatorError | CastError | ValidationError;
        };
        addError: (path: string, error: ValidatorError | CastError | ValidationError) => void;
    }
    interface ValidatorError extends Error {
        name: 'ValidatorError';
        properties: {
            message: string;
            type?: string;
            path?: string;
            value?: any;
            reason?: any;
        };
        kind: string;
        path: string;
        value: any;
        reason?: Error | null;
    }
    interface VersionError extends Error {
        name: 'VersionError';
        version: number;
        modifiedPaths: Array<string>;
    }
}
export {};
