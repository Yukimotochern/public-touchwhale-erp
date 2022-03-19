"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoError = exports.MongooseError = void 0;
class CustomError extends Error {
    constructor(message = 'Unspecified Error Message', statusCode = 500, errorData, messageArray) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.errorData = errorData;
        this.messageArray = messageArray;
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
