"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiErrorDealtInternallyAndThrown = exports.AjvErrors = exports.MongoError = exports.MongooseError = void 0;
class CustomError extends Error {
    constructor(message = 'Unspecified Error Message', statusCode = 500, errorData) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorData = errorData;
        this.name = 'CustomError';
        // restore prototype chain
        this.name = new.target.name;
        if (typeof Error.captureStackTrace === 'function') {
            ;
            Error.captureStackTrace(this, new.target);
        }
        if (typeof Object.setPrototypeOf === 'function') {
            Object.setPrototypeOf(this, new.target.prototype);
        }
        else {
            ;
            this.__proto__ = new.target.prototype;
        }
    }
}
exports.default = CustomError;
class MongooseError extends CustomError {
    constructor(msg, mongooseError, statusCode = 500) {
        super(msg, statusCode);
        this.mongooseError = mongooseError;
        this.name = 'MongooseError';
    }
}
exports.MongooseError = MongooseError;
class MongoError extends CustomError {
    constructor(msg, mongoError, statusCode = 500) {
        super(msg, statusCode);
        this.mongoError = mongoError;
        this.name = 'MongoError';
    }
}
exports.MongoError = MongoError;
class AjvErrors extends CustomError {
    constructor(msg, ajvError, statusCode = 500) {
        super(msg, statusCode);
        this.ajvError = ajvError;
        this.name = 'AjvError';
    }
}
exports.AjvErrors = AjvErrors;
class ApiErrorDealtInternallyAndThrown extends CustomError {
    constructor(thrown, statusCode = 500) {
        super('DO NOT CATCH THIS ERROR OUTSIDE CUSTOM API PROMISE!', statusCode);
        this.thrown = thrown;
        this.statusCode = statusCode;
        this.name = 'ApiErrorDealtInternallyAndThrown';
    }
}
exports.ApiErrorDealtInternallyAndThrown = ApiErrorDealtInternallyAndThrown;
