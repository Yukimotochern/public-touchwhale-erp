"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var errorResponse_1 = __importDefault(require("../utils/errorResponse"));
var errorHandler = function (err, req, res, next) {
    // Log to console for dev
    console.error(err);
    var error = new errorResponse_1.default(err.message || 'Server Error', 500, err);
    var message, messageArray;
    switch (err.name) {
        // Mongoose bad ObjectId or other fields
        case 'CastError':
            message = 'Resource not found';
            error = new errorResponse_1.default(message, 404, err);
            break;
        // Mongoose validation error
        case 'ValidationError':
            message = 'Invalid data provided';
            messageArray = Object.values(err.errors).map(function (val) { return val.message; });
            error = new errorResponse_1.default(message, 400, err, messageArray);
            break;
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: error,
    });
};
exports.errorHandler = errorHandler;
