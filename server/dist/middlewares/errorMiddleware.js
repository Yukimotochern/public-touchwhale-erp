"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const CustomError_1 = __importStar(require("../utils/CustomError"));
const mongoose_1 = require("mongoose");
const errorHandler = (err, req, res, next) => {
    // catch error that has definite type
    // mongo.Error
    // Error... from mongoose
    let error = new CustomError_1.default((err && err.message) || 'Server Error', (err && err.statusCode) || 500, err);
    if (err instanceof Error) {
        if (!(err instanceof CustomError_1.default)) {
            let message, messageArray;
            // Mongoose Error
            if (err instanceof mongoose_1.Error.CastError) {
                message = 'Resource not found';
                error = new CustomError_1.default(message, 404, err);
            }
            if (err instanceof mongoose_1.Error.ValidationError) {
                message = 'Invalid data provided';
                messageArray = Object.values(err.errors).map((val) => val.message);
                error = new CustomError_1.default(message, 400, err, messageArray);
            }
            if (err instanceof mongoose_1.mongo.MongoError) {
                error = new CustomError_1.MongoError('', err);
            }
        }
        else {
            console.log(err.message);
            console.error(err);
            error = err;
        }
    }
    else {
        console.error(`Unknown thing with type ${typeof err} thrown: `);
        console.error(err);
    }
    // console.log(serializeError(error))
    return res
        .status(error.statusCode)
        .set('Content-Type', 'application/json')
        .send(error);
};
exports.errorHandler = errorHandler;
