"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var errorResponse_1 = __importDefault(require("../utils/errorResponse"));
var mongoose_1 = require("mongoose");
mongoose_1.mongo.MongoError;
var errorHandler = function (err, req, res, next) {
    // Log to console for dev
    console.error(err);
    var error = new errorResponse_1.default(err.message || 'Server Error', err.statusCode || 500, err);
    if (err instanceof errorResponse_1.default) {
        error = err;
    }
    var message, messageArray;
    if (err instanceof mongoose_1.Error.CastError) {
        message = 'Resource not found';
        error = new errorResponse_1.default(message, 404, err);
    }
    if (err instanceof mongoose_1.Error.ValidationError) {
        message = 'Invalid data provided';
        messageArray = Object.values(err.errors).map(function (val) { return val.message; });
        error = new errorResponse_1.default(message, 400, err, messageArray);
    }
    return res.status(error.statusCode || 500).json({
        success: false,
        error: {
            message: error.message,
            errorData: error.errorData,
            messageArray: error.messageArray,
        },
    });
};
exports.errorHandler = errorHandler;
